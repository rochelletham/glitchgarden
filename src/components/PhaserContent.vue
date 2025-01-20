<script>

import '../assets/tailwind.css';
import checkAnswer from '@/utils/AnswerHandling';
import generateAnswer from '@/utils/GenerateAnswer';
import RadioButton from './RadioButton.vue';

export default {
  name: 'PhaserContent',
  components: {
  },
  data() {
    return {
      context: null,
      audioBuffer: null,
      bufferSource: null,
      playheadPos: 0,
      isPlaying: false,
      isloopEnabled: true,
      numStages: 4,
      allPassFilters: [],
      rate: 5, 
      depth: 500, 
      resonance: 6,
      feedbackVal: .9,
      depthNode: null,
      feedbackNode: null,
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
    this.loadAudio();
    this.loadBuffer();

    //**** LFO that will be fed into delay node  ****//
    // set up LFO. should osc between 0 and 1
    this.lfo = new OscillatorNode(this.context);
    this.lfo.type = this.lfoType;
    this.depthNode = new GainNode(this.context);
    this.depthNode.gain.setValueAtTime(this.depth, this.context.currentTime);
    //controls speed the notches and peaks move. det. how quickly modulation occurs. 
    this.lfo.frequency.value = this.rate;
    this.lfo.connect(this.depthNode);
    this.lfo.start();
    
    // create filters and push to allPassFilters array
    for (let i = 0; i < this.numStages; i++) {
      const filter = this.context.createBiquadFilter();
      filter.type = 'allpass';
      filter.Q.value = this.resonance;
      filter.frequency.value = 1000;   // center frequency = 1kHz
      this.allPassFilters.push(filter);
      this.depthNode.connect(this.allPassFilters[i].frequency);
    }

    this.feedbackNode = new GainNode(this.context);
    // feedback contributes to resonant and swirling character.
    // some of output from phaser fed back into input to enhance certain freq 
    this.feedbackNode.gain.value = this.feedbackVal;

    // used for muting audio 
    this.wetGainNode = new GainNode(this.context);
    this.wetGainNode.gain.value = this.wetDryVal;

    this.bufferSource.connect(this.allPassFilters[0]);
    // connect the all pass filters sequentially
    for (let i = 0; i < this.numStages - 1; i++) {
      this.allPassFilters[i].connect(this.allPassFilters[i+1]);
    }
    this.allPassFilters[this.allPassFilters.length - 1].connect(this.feedbackNode).connect(this.allPassFilters[0]);
    this.allPassFilters[this.allPassFilters.length - 1].connect(this.wetGainNode).connect(this.context.destination);

    //***** DONT TOUCH -- FOR DRY AUDIO *****// 
    this.dryGainNode = new GainNode(this.context);
    this.dryGainNode.gain.value = 1.0;    // default to dry 100%
    this.bufferSource.connect(this.dryGainNode).connect(this.context.destination);
    //***** DONT TOUCH -- FOR DRY AUDIO *****// 
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
        // const response = await fetch('/soundfiles/loop/electric_guitar.wav');
        const response = await fetch('/soundfiles/loop/guitar.wav');
        // const response = await fetch('/soundfiles/loop/guitar_note.wav');
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
      this.startAudioContext();
      this.context.resume();
      
      this.loadAudio();
        
      this.bufferSource.connect(this.allPassFilters[0]);
      if (this.dryGainNode === null) {
        console.log("dry gain node");
      }
      
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
    wetDryUpdate(event) {
      if (this.yoursActive) {
        this.wetDryVal = event.target.value;
        this.dryGainNode.gain.setValueAtTime(1.0 - this.wetDryVal, this.context.currentTime);
        this.wetGainNode.gain.setValueAtTime(this.wetDryVal, this.context.currentTime);
      } 
    },
    feedbackUpdate(event) {
      if (this.yoursActive) {
        this.feedbackVal = event.target.value;
        this.feedbackNode.gain.setValueAtTime(this.feedbackVal, this.context.currentTime);
      } 
    },
    rateUpdate(event) {
      if (this.yoursActive) {
        this.rate = event.target.value;
        this.lfo.frequency.setValueAtTime(this.rate, this.context.currentTime);
      } 
    },
    depthUpdate(event) {
      if (this.yoursActive) {
        this.depth = event.target.value;
        this.depthNode.gain.setValueAtTime(this.depth, this.context.currentTime);
      } 
    },
    resonanceUpdate(event) {
      if (this.yoursActive) {
        this.resonance = event.target.value;
        for (let i = 0; i < this.allPassFilters.length; i++) {
          this.allPassFilters[i].Q.setValueAtTime(this.resonance, this.context.currentTime);
        }
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
      if (this.yoursActive) {
        this.dryGainNode.gain.setValueAtTime(1.0 - this.wetDryVal, this.context.currentTime);
        this.wetGainNode.gain.setValueAtTime(this.wetDryVal, this.context.currentTime);
      } else {
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
      this.ansDelayTimeVal = generateAnswer(0,1);
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
    <h1 class="black">Phaser</h1>
    <h2 class="black" id="difficultyid">difficulty: beginner</h2>
    <h2 class="black" id="exerciseNumid">exercise number: {{this.exerciseNum}}</h2>
    <br>
  </div>
    <div>
    <audioButton v-if="isPlaying" @click="pauseAudio" id="playButton" class="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
      <img src="../svgs/pause.svg" class="icon">
    </audioButton>
    <audioButton v-else @click="playAudio" id="playButton" class="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
      <img src="../svgs/play.svg" class="icon">
    </audioButton>
    <audioButton @click="loopAudio" id="loopButton" class="cursor-pointer bg-gray-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ease-in-out" :class="{ 'bg-green-300': isloopEnabled}">
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
          <div class="w-16 h-10 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out" :class="{ 'bg-green-300': !yoursActive}">
            <div class="bg-white w-7 h-7 rounded-full shadow-md transform duration-300 ease-in-out" :class="{ 'translate-x-6': !yoursActive}"></div>
          </div>
        </button>
        &nbsp; Expected
      </p>
    </div>
    <br>
    <div>
      <input type="range" @input="rateUpdate" v-model="this.rate" id="rate"
      name="rate" min="0.0" max="10.0" step="0.1" class="efx-slider" >
      <p>rate {{ this.rate }}</p>
      <input type="range" @input="depthUpdate" v-model="this.depth" id="depth"
      name="rate" min="100" max="500" step="10" class="efx-slider" >
      <p>depth {{ this.depth }}</p>
      <input type="range" @input="feedbackUpdate" v-model="this.feedbackVal" id="feedback"
      name="feedback" min="0.0" max="0.9" step="0.1" class="efx-slider" >
      <p>feedback {{ this.feedbackVal }}</p>
      <input type="range" @input="wetDryUpdate" v-model="this.wetDryVal" id="wetDryMix"
      name="wet/dry mix" min="0.0" max="1.0" step="0.1" class="efx-slider" >
      <p>dry/wet mix {{ (this.wetDryVal)*100 }}%</p>
    
      <br>
      <button @click="checkAnswer" type="button" class="text-white 
    bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 
    font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 
    dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">check answer</button>  
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

</style>
