<script>

import '../assets/tailwind.css';
import checkAnswer from '@/utils/AnswerHandling';
import generateAnswer from '@/utils/GenerateAnswer';
import RadioButton from './RadioButton.vue';
import {FLANGER_MIN_DELAY} from '@/utils/effectProps.js';
import {FLANGER_MAX_DELAY} from '@/utils/effectProps.js';
import {FLANGER_FEEDBACK} from '@/utils/effectProps.js';

export default {
  name: 'FlangerContent',
  components: {
    RadioButton,
  },
  data() {
    return {
      context: null,
      audioBuffer: null,
      bufferSource: null,
      playheadPos: 0,
      isPlaying: false,
      isloopEnabled: true,
      lfo: null,
      lfoType: "sine",
      feedfwdNode: null,
      delayNode: null,
      delayTimeVal: 0.0, // slider value
      feedbackNode: null,
      feedbackGain: 0.0,
      dryGainNode: null,
      wetGainNode: null,
      wetDryVal: 0.5,   // 0 means 100% dry & 0% wet, 1 means 100% wet & 0% dry
      score: null,
      delayScore: null, 
      fdbkScore: null, 
      wetDryScore: null,
      showScore: false,
      yoursActive: true,   
      toggleMode: false,  // toggle state for yours vs expected audio
      mute: false,        // mute/unmute audio
      // answer key variables
      ansDelayTimeVal: 0.5, 
      ansFeedbackGain: 0.5,
      ansWetDryVal: 0.5,  
      exerciseNum: 1,
      showAudio: false
    };
  },
  mounted() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.bufferSource = new AudioBufferSourceNode(this.context);
    this.loadBuffer();

    this.delayNode = new DelayNode(this.context);
    this.feedbackNode = new GainNode(this.context);
    // used for muting audio 
    this.wetGainNode = new GainNode(this.context);
    
    this.bufferSource.connect(this.delayNode).connect(this.feedbackNode).connect(this.delayNode);
    this.delayNode.connect(this.wetGainNode).connect(this.context.destination);

    //***** DONT TOUCH -- FOR DRY AUDIO *****// 
    this.dryGainNode = this.context.createGain();
    this.dryGainNode.gain.value = 1.0;    // default to dry 100%
    this.bufferSource.connect(this.dryGainNode);
    this.dryGainNode.connect(this.context.destination);
    //***** DONT TOUCH -- FOR DRY AUDIO *****// 
    
    //**** LFO that will be fed into delay node  ****//
    // set up LFO. should osc between 0 and 1
    this.lfo = new OscillatorNode(this.context);
    this.lfo.type = this.lfoType;
    const depth = new GainNode(this.context);
    this.lfo.connect(depth).connect(this.delayNode.delayTime);
    this.lfo.start();

    this.feedbackGain = 0.7;
    this.lfo.frequency.value = 0.1;
    this.delayTimeVal = 0.005;
    this.delayNode.delayTime.value = this.delayTimeVal;
    this.feedbackNode.gain.value = this.feedbackGain;
    depth.gain.value = 0.004;
    
    // now randomly generating the answer 
    this.ansDelayTimeVal = generateAnswer(FLANGER_MIN_DELAY, FLANGER_MAX_DELAY);
    this.ansFeedbackGain = generateAnswer(0,1.0);
    this.ansWetDryVal = generateAnswer(0.0,1.0);
    console.log(
                "delayTime Ans: ", (this.ansDelayTimeVal*1000),
                "\nfdbk gain Ans: ", this.ansFeedbackGain,
                "\nwetdry Ans: ", this.ansWetDryVal);

    const horiSlider = document.querySelector('.hori-slider');
    const horiSliderValue = document.querySelector('.hori-slider-value');

    // horiSlider.addEventListener('input', function () {
    //     // Synchronize input number with slider value
    //     horiSliderValue.value = horiSlider.value; 
    //     this.style.background = `linear-gradient(to right, rgba(7, 235, 123, 1) ${horiSlider.value}%,
    //     rgba(38, 42, 45, 1) ${horiSlider.value}%)`;
    // });

    // horiSlider.addEventListener('input', function () {
    //   let value = parseInt(horiSliderValue.value, 10);
    //     if (value >= 0 && value <= 100) {
    //       horiSlider.value = value;
    //       horiSliderValue.value = horiSlider.value;
    //       horiSlider.style.background = `linear-gradient(to right, rgba(7, 235, 123, 1) ${horiSlider.value}%,
    //     rgba(38, 42, 45, 1) ${horiSlider.value}%)`;
    //     }
    // });

  },
  methods: {
    startAudioContext() {
      if (this.context === null) {
        console.log("initialized context");
        this.context = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.context.state === 'suspended'){
        this.context.resume();
        console.log("suspended context is now resumed");
      }
    },
    async loadBuffer() {
      try {
        // Fetch the WAV file
        // Use URL from git repo
        const audioPath = 'https://rochelletham.github.io/glitchgarden/soundfiles/loop/guitar.wav';
        const response = await fetch(audioPath);
        const audioData = await response.arrayBuffer();
        this.audioBuffer = await this.context.decodeAudioData(audioData);
        this.isloopEnabled = true;
      } catch (error) {
        console.log("unable to load the wav file.");
      }
        
    },
    async loadAudio() {
      try {
        this.bufferSource = new AudioBufferSourceNode(this.context);
        this.bufferSource.loop = this.isloopEnabled;
        this.bufferSource.buffer = this.audioBuffer;
      } catch (error) {
        console.error('Error with loading the audio file.');
      }
    },
    playAudio() {
      this.isPlaying = true;
      this.context.resume();
      this.loadAudio();

      this.bufferSource.connect(this.delayNode);
      this.bufferSource.connect(this.dryGainNode);
      this.bufferSource.start(0, this.playheadPos);
    },
    pauseAudio() {
      try {
        this.bufferSource.stop();
        this.isPlaying = false;
        console.log('stopped audio');
        this.playheadPos = (this.context.currentTime > this.audioBuffer.duration) ? 0.0 : this.context.currentTime;
      } catch (error) {
        console.log('duration', this.audioBuffer.duration);
        console.log('playhead', this.playheadPos);
        console.log("unable to pause audio");
      }
    },
    loopAudio() {
      this.isloopEnabled = !this.isloopEnabled;
      this.bufferSource.loop = this.isloopEnabled;
    },
    delayTimeUpdate(event) {
      if (this.yoursActive) {
        this.delayTimeVal = event.target.value;
        this.delayNode.delayTime.setValueAtTime(event.target.value, this.context.currentTime);
      } 
    },
    feedbackGainUpdate(event) {
      if (this.yoursActive) {
        this.feedbackGain = event.target.value;
        this.feedbackNode.gain.setValueAtTime(event.target.value, this.context.currentTime);
      } 
    },
    wetDryUpdate(event) {
      if (this.yoursActive) {
        this.wetDryVal = event.target.value;
        this.dryGainNode.gain.value = 1.0 - this.wetDryVal;
        this.wetGainNode.gain.value = this.wetDryVal;
        this.dryGainNode.gain.setValueAtTime(this.dryGainNode.gain.value, this.context.currentTime);
        this.wetGainNode.gain.setValueAtTime(this.wetGainNode.gain.value, this.context.currentTime);
      } 
    },
    muteAudio(event) {
      this.mute = !this.mute;
      if (this.mute) {
        this.dryGainNode.gain.setValueAtTime(0, this.context.currentTime);
        this.wetGainNode.gain.setValueAtTime(0, this.context.currentTime);
      } else {
        this.dryGainNode.gain.setValueAtTime(1.0, this.context.currentTime);
        this.wetGainNode.gain.setValueAtTime(1.0, this.context.currentTime);
      }
    },
    checkAnswer(event) {
      // *1000 because in milliseconds
      [this.delayScore, this.fdbkScore, this.wetDryScore, this.score] = 
      checkAnswer((this.delayTimeVal)*1000, this.feedbackGain, this.wetDryVal,
                  (this.ansDelayTimeVal)*1000, this.ansFeedbackGain, this.ansWetDryVal);  
      this.showScore = true;
    },
    switchAudioMode(event) {
      this.toggleMode = !this.toggleMode;   // toggleMode = false --> yoursActive = true
      this.yoursActive = !this.yoursActive;
      // TODO: modularize & fix this code -- right now very crude
      if (this.yoursActive) {
        this.delayNode.delayTime.setValueAtTime(this.delayTimeVal, this.context.currentTime);
        this.feedbackNode.gain.setValueAtTime(this.feedbackGain, this.context.currentTime);
        this.dryGainNode.gain.setValueAtTime(1.0 - this.wetDryVal, this.context.currentTime);
        this.wetGainNode.gain.setValueAtTime(this.wetDryVal, this.context.currentTime);
      } else {
        this.delayNode.delayTime.setValueAtTime(this.ansDelayTimeVal, this.context.currentTime);
        this.feedbackNode.gain.setValueAtTime(this.ansFeedbackGain, this.context.currentTime);
        this.dryGainNode.gain.setValueAtTime(1.0 - this.ansWetDryVal, this.context.currentTime);
        this.wetGainNode.gain.setValueAtTime(this.ansWetDryVal, this.context.currentTime);
      }
    },
    changeLfoType(newlfoType) {
      this.lfoType = newlfoType;  
      console.log(this.lfoType);
      console.log(this.lfo.type);
    },
    generateAnswer(event) {
      this.showScore = false; // hide the old answer if creating new answer now
      this.exerciseNum++;
      this.ansDelayTimeVal = generateAnswer(FLANGER_MIN_DELAY,FLANGER_MAX_DELAY);
      this.ansFeedbackGain = generateAnswer(0, 1.0);
      this.ansWetDryVal = generateAnswer(0.0,1.0);
      console.log("new answer:",
                "\ndelayTime Ans: ", (this.ansDelayTimeVal*1000), 
                "\nfdbk gain Ans: ", this.ansFeedbackGain,
                "\nwetdry Ans: ", this.ansWetDryVal);
    }
  },
};

</script>

<template>
  
  <div class="title">
    <h1 >Flanger</h1>
    <h2  id="difficultyid">difficulty: beginner</h2>
    <h2  id="exerciseNumid">exercise number: {{this.exerciseNum}}</h2>
    <br>
  </div>
    <div>
    <audioButton v-if="isPlaying" @click="pauseAudio" id="playButton" class="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
      <img src="../svgs/pause.svg" class="icon">
    </audioButton>
    <audioButton v-else @click="playAudio" id="playButton" class="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
      <img src="../svgs/play.svg" class="icon">
    </audioButton>
    <audioButton @click="loopAudio" id="loopButton" class="cursor-pointer bg-gray-300 hover:bg-dark-green text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ease-in-out" :class="{ 'bg-light-green': isloopEnabled}">
      <img src="../svgs/loopEnabled.svg" class="icon"> 
    </audioButton>
    <audioButton v-if="mute" @click="muteAudio" id="muteButton" class="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
      <img src="../svgs/mute.svg" class="icon">
    </audioButton>
    <audioButton v-else @click="muteAudio" id="muteButton" class="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
      <img src="../svgs/muteOff.svg" class="icon">
    </audioButton>
    </div>
    <br>
    <div>
      <p class="items-center flex">Yours
        <button @click="switchAudioMode">
          <div class="w-16 h-10 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out" :class="{ 'bg-light-green': !yoursActive}">
            <div class="bg-white w-7 h-7 rounded-full shadow-md transform duration-300 ease-in-out" :class="{ 'translate-x-6': !yoursActive}"></div>
          </div>
        </button>
        &nbsp; Expected
      </p>
    </div>
    <br>
    <div>
      <input type="range" @input="delayTimeUpdate" v-model="this.delayTimeVal" id="delayDur"
      name="Delay Duration" min="0.0" max="0.01" step="0.001" value="0.0" class="efx-slider" >
      <p>delay duration: {{ (this.delayTimeVal)*1000 }} ms</p>
      <!-- <input id="hori-slider-value" type="number" class="hori-slider-value" min="0" max="100" value="0"> -->
      
      <input type="range" @input="feedbackGainUpdate" v-model="this.feedbackGain" id="fdbkGain"
      name="Feedback Gain" min="0" max="1.0" step=".1" value="0.0" class="efx-slider" >
      <p>feedback gain: {{ (this.feedbackGain) }}</p>
      
      <input type="range" @input="wetDryUpdate" v-model="this.wetDryVal" id="wetDryMix"
      name="Wet/Dry Mix" min="0.0" max="1.0" step="0.1" class="efx-slider" >
      <p>dry/wet mix {{ (this.wetDryVal)*100 }}%</p>
      <br>
      <button @click="checkAnswer" type="button" class="text-t-color 
    bg-dark-green hover:bg-light-green focus:outline-none focus:ring-4 focus:ring-lighter-green
    font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 
    dark:bg-green-600 dark:hover:bg-dark-green dark:focus:ring-green-900">check answer</button>  
    <button @click="generateAnswer" type="button" class="space-x-[15px] text-white 
    bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 
    font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 
    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900">next exercise</button> 
      <br><br>
      <p v-if="showScore">delay duration: {{ this.delayScore }}</p>
      <p v-if="showScore">feedback gain: {{ this.fdbkScore }}</p>
      <p v-if="showScore">dry/wet mix: {{ this.wetDryScore }}</p>
      <p v-if="showScore">overall score: {{ this.score }} %</p>
      <br class="vert-space">
    </div>

</template>

<style scoped>

button {
  margin: 5px;
  text-align: center;
}

audioButton {
  margin: 5px;
  text-align: center;
  max-height: 50px;
  max-width: 60px;
}

.vert-space {
  margin-top: 100px;
}
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}
.title {
  margin-top: 60px;
}
div {
  margin-left: 5%;
  text-align: left;
}

div.flex {
  margin-left: 0%;
  margin-bottom: 5%;
}

span {
  margin-left: -8%;
}


h3 {
  font-size: 1.2rem;
}

.title h1,
.title h3 {
  text-align: left;
}

/* slider bar */
.efx-slider {
  -webkit-appearance: none;
  -moz-appearance: none;
  margin-top: 3%;
  margin-bottom: 2%;
  height: 12px;
  cursor: pointer;
  position: relative;
  align-items: center;
  border-radius: 3px;
  background: rgb(229, 225, 233);
  width:50%;
  max-width: 500px;
  outline: none;
  opacity: 0.85;
}

.efx-slider:hover {
  box-shadow: 0 0 0 1px rgb(237, 236, 236);
}
  /* the knob of the slider */
  .efx-slider::-webkit-slider-thumb {
    /* Remove default thumb styling */
    -webkit-appearance: none; 
    appearance: none;
    width: 12px; 
    height: 35px; 
    background-color: rgb(255, 255, 255);
    border: 2px solid rgb(184, 183, 183);
    border-radius:  3px;
    cursor: pointer; /* Pointer on hover */
}

.efx-slider::-webkit-slider-thumb:hover {
  /* animation for highlight */
  transition: .05s ease-in-out; 
  border-color: rgb(220, 220, 220);
  height: 40px;
  /* box-shadow: h-offset v-offset blur-radius spread-radius color inset; */
  box-shadow: 0 0 0 2px rgb(237, 236, 236);
}

audio::-webkit-media-controls {
        display: none;
    }

/***************************************************************************/
/* Horizontal Slider */
/***************************************************************************/
.hori-slider-container {
    /* background-color: red; */
    background-color: rgba(62, 66, 69, 1);
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 242.5px;
    height: 36px;
    gap: 5px; 
    position: relative;
    padding: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
}
/* 
.slider-label {
    background-color: red;
    font-size: 14px;
    color: red;
    text-align: center;
    margin-bottom: 5px; /* Space between label and slider 
}  */

/* for the tick marks on slider */
.hori-slider::before {
    content: ''; 
    position: absolute;
    /* left: -50%; Extend tick marks to the left */
    /* top: -50%;  */
    background: repeating-linear-gradient(
        to right, 
        transparent 5px, 
        transparent 15px, 
        rgba(103, 105, 107, 1) 6px, 
        rgba(103, 105, 107, 1) 16px 
    ); 
    z-index: -1; 
    pointer-events: none;
    height: 24px;
    width: 100%;
}

.hori-slider {
    -webkit-appearance: none;
    -moz-appearance: none;
    /* width: 200px; */
    width: 25%;
    height: 12px; 
    cursor: pointer;
    position: relative;
    align-items: center;
    background: rgba(38, 42, 45, 1);
    outline: none;
    opacity: 0.85;
    writing-mode: horizontal-tb;
    margin: 0;
    border-radius: 3px;
}


/* the knob of the slider */
.hori-slider::-webkit-slider-thumb {
    -webkit-appearance: none; 
    appearance: none;
    height: 20px; 
    width: 10px;    /* because track width is 12px*/
    border: 1px solid rgb(255, 255, 255);
    border-radius: 3px;
    cursor: pointer; /* Pointer on hover */
    background: linear-gradient(  /* for creating a line on the knob */
        to right,
        transparent 38%,
        rgba(132, 137, 138, 1) 38%,
        rgba(132, 137, 138, 1) 55%,
        transparent 56%
    );
    background-color: rgb(255, 255, 255);
}

.hori-slider-value {
    pointer-events: auto; 
    user-select: auto;
    text-align: center;
    line-height: normal;
    padding: 5px;
    width: 10%;
    height: 25%;
    font-size: 12px;
    color: rgba(132, 137, 138, 1); 
    /* border: 1px solid rgba(132, 136, 138, 1); */
    /* background-color: rgba(198, 198, 198, 1); */
    background-color: rgb(255, 255, 255);
    border: 1px solid rgba(198, 198, 198, 1);
    border-radius: 5px;
    #textBox{ z-index:1000; }
}

.hori-slider-value:focus {
    outline: 1px solid black; 
    background-color: rgba(132, 137, 138, 1);
    box-shadow: none; 
    color: white;
}
</style>
