<script>

import '../assets/tailwind.css';
import checkAnswer from '@/utils/AnswerHandling';
import generateAnswer from '@/utils/GenerateAnswer';

export default {
  name: 'StereoDelayContent',
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
      feedfwdNodeLeft: null,
      feedfwdNodeRt: null,
      delayNodeLeft: null,
      delayNodeRt: null,
      delayTimeValLeft: 0.0, // slider value
      delayTimeValRt: 0.0, // slider value
      feedbackNodeLeft: null,
      feedbackNodeRt: null,
      feedbackGainLeft: 0.0,
      feedbackGainRt: 0.0,
      dryGainNodeLeft: null,
      wetGainNodeLeft: null,
      dryGainNodeRt: null,
      wetGainNodeRt: null,
      wetDryValLeft: 0.5,   // 0 means 100% dry & 0% wet, 1 means 100% wet & 0% dry
      wetDryValRt: 0.5,
      outputGainNodeLeft: null,
      outputGainNodeRt: null,
      outputGainLeft: 0.0,
      outputGainRt: 0.0,
      splitterNode: null,
      chanMergerNode: null,
      score: null,
      delayScore: null, 
      fdbkScore: null, 
      wetDryScore: null,
      showScore: false,
      yoursActive: true,   
      toggleMode: false,  // toggle state for yours vs expected audio
      mute: false,        // mute/unmute audio
      // answer key variables
      ansDelayTimeValLeft: 0.5, 
      ansFeedbackGainLeft: 0.5,
      ansWetDryValLeft: 0.5,  
      ansDelayTimeValRt: 0.5, 
      ansFeedbackGainRt: 0.5,
      ansWetDryValRt: 0.5,  
      exerciseNum: 1,
      showAudio: false
    };
  },
  mounted() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.bufferSource = new AudioBufferSourceNode(this.context);
    this.loadBuffer();

    this.dryGainNodeLeft = new GainNode(this.context);
    this.delayNodeLeft = new DelayNode(this.context);
    this.feedbackNodeLeft = new GainNode(this.context);
    this.wetGainNodeLeft = new GainNode(this.context); // used for muting audio 

    this.dryGainNodeRt = new GainNode(this.context);
    this.delayNodeRt = new DelayNode(this.context);
    this.feedbackNodeRt = new GainNode(this.context);
    this.wetGainNodeRt = new GainNode(this.context); // used for muting audio 
    
    // controling the output volume of left and right channels respectively
    this.outputGainNodeLeft = new GainNode(this.context);
    this.outputGainNodeRt = new GainNode(this.context);
    this.outputGainNodeLeft.gain.value = 0.0;
    this.outputGainNodeRt.gain.value = 0.0;

    const splitterOpt = {
      numberOfOutputs: 4,
    };
    const mergerOpt = {
      numberOfInputs: 4,
    };

    // split input signal into left and right channel
    this.splitterNode = new ChannelSplitterNode(this.context, splitterOpt);
    // eventually used to merge the left dry + left wet. right dry + right wet
    this.chanMergerNode = new ChannelMergerNode(this.context, mergerOpt);
    
    //***** DONT TOUCH -- FOR DRY AUDIO *****// 
    this.bufferSource.connect(this.splitterNode);
    this.dryGainNodeLeft.gain.value = 1.0;    // default to dry 100%
    this.splitterNode.connect(this.dryGainNodeLeft, 0);
    this.dryGainNodeLeft.connect(this.chanMergerNode, 0, 0);
    
    this.dryGainNodeRt.gain.value = 1.0;    // default to dry 100%
    this.splitterNode.connect(this.dryGainNodeRt, 1);
    this.dryGainNodeRt.connect(this.chanMergerNode, 0, 1);
    //***** DONT TOUCH -- FOR DRY AUDIO *****// 
    
    this.splitterNode.connect(this.delayNodeLeft, 0).connect(this.feedbackNodeLeft).connect(this.delayNodeLeft);
    this.delayNodeLeft.connect(this.wetGainNodeLeft).connect(this.outputGainNodeLeft);

    this.splitterNode.connect(this.delayNodeRt, 1).connect(this.feedbackNodeRt).connect(this.delayNodeRt);
    this.delayNodeRt.connect(this.wetGainNodeRt).connect(this.outputGainNodeRt);

    this.outputGainNodeLeft.connect(this.chanMergerNode, 0, 0);
    this.outputGainNodeRt.connect(this.chanMergerNode, 0, 1);
    this.chanMergerNode.connect(this.context.destination);
    
    
    // now randomly generating the answer 
    this.ansDelayTimeValLeft = generateAnswer(0,1.0);
    this.ansFeedbackGainLeft = generateAnswer(0,0.6);
    this.ansWetDryValLeft = generateAnswer(0.0,1.0);

    this.ansDelayTimeValRt = generateAnswer(0,1.0);
    this.ansFeedbackGainRt = generateAnswer(0,0.6);
    this.ansWetDryValRt = generateAnswer(0.0,1.0);
    console.log(
                "delayTime Left Ans: ", (this.ansDelayTimeValLeft*1000),
                "\nfdbk gain Left Ans: ", this.ansFeedbackGainLeft,
                "\nwetdry Left Ans: ", this.ansWetDryValLeft);
    console.log(
                "delayTime Rt Ans: ", (this.ansDelayTimeValRt*1000),
                "\nfdbk gain Rt Ans: ", this.ansFeedbackGainRt,
                "\nwetdry Rt Ans: ", this.ansWetDryValRt);

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
        const response = await fetch('/soundfiles/loop/guitar.wav');
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

      this.bufferSource.connect(this.delayNodeLeft);
      this.bufferSource.connect(this.delayNodeRt);
      this.bufferSource.connect(this.dryGainNodeLeft);
      this.bufferSource.connect(this.dryGainNodeRt);
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
    delayTimeUpdateLeft(event) {
      if (this.yoursActive) {
        this.delayTimeValLeft = event.target.value;
        this.delayNodeLeft.delayTime.setValueAtTime(event.target.value, this.context.currentTime);
        console.log(this.delayNodeLeft.delayTime.value);
      } 
    },
    delayTimeUpdateRt(event) {
      if (this.yoursActive) {
        this.delayTimeValRt = event.target.value;
        this.delayNodeRt.delayTime.setValueAtTime(event.target.value, this.context.currentTime);
        console.log(this.delayNodeRt.delayTime.value);
      } 
    },
    feedbackGainUpdateLeft(event) {
      if (this.yoursActive) {
        this.feedbackGainLeft = event.target.value;
        this.feedbackNodeLeft.gain.setValueAtTime(event.target.value, this.context.currentTime);
      } 
    },
    feedbackGainUpdateRt(event) {
      if (this.yoursActive) {
        this.feedbackGainRt = event.target.value;
        this.feedbackNodeRt.gain.setValueAtTime(event.target.value, this.context.currentTime);
      } 
    },
    wetDryUpdateLeft(event) {
        if (this.yoursActive) {
            this.wetDryValLeft = event.target.value;
            this.dryGainNodeLeft.gain.value = 1.0 - this.wetDryValLeft;
            this.wetGainNodeLeft.gain.value = this.wetDryValLeft;
            this.dryGainNodeLeft.gain.setValueAtTime(this.dryGainNodeLeft.gain.value, this.context.currentTime);
            this.wetGainNodeLeft.gain.setValueAtTime(this.wetGainNodeLeft.gain.value, this.context.currentTime);
            console.log("wet: ", this.wetGainNodeLeft.gain.value, "dry: ", this.dryGainNodeLeft.gain.value);
        }
    },
    wetDryUpdateRt(event) {
        if (this.yoursActive) {
            this.wetDryValRt = event.target.value;
            this.dryGainNodeRt.gain.value = 1.0 - this.wetDryValRt;
            this.wetGainNodeRt.gain.value = this.wetDryValRt;
            this.dryGainNodeRt.gain.setValueAtTime(this.dryGainNodeRt.gain.value, this.context.currentTime);
            this.wetGainNodeRt.gain.setValueAtTime(this.wetGainNodeRt.gain.value, this.context.currentTime);
            console.log("wet: ", this.wetGainNodeRt.gain.value, "dry: ", this.dryGainNodeRt.gain.value);
        } 
    },
    muteAudio(event) {
      this.mute = !this.mute;
      if (this.mute) {
        this.dryGainNodeLeft.gain.setValueAtTime(0, this.context.currentTime);
        this.wetGainNodeLeft.gain.setValueAtTime(0, this.context.currentTime);

        this.dryGainNodeRt.gain.setValueAtTime(0, this.context.currentTime);
        this.wetGainNodeRt.gain.setValueAtTime(0, this.context.currentTime);
      } else {
        this.dryGainNodeLeft.gain.setValueAtTime(1.0, this.context.currentTime);
        this.wetGainNodeLeft.gain.setValueAtTime(1.0, this.context.currentTime);

        this.dryGainNodeRt.gain.setValueAtTime(1.0, this.context.currentTime);
        this.wetGainNodeRt.gain.setValueAtTime(1.0, this.context.currentTime);
      }
    },
    checkAnswer(event) {
      // *1000 because in milliseconds
      [this.delayScore, this.fdbkScore, this.wetDryScore, this.score] = 
      checkAnswer((this.delayTimeValLeft)*1000, this.feedbackGainLeft, this.wetDryValLeft,
                  (this.ansDelayTimeValLeft)*1000, this.ansFeedbackGainLeft, this.ansWetDryValLeft);  
      this.showScore = true;
    },
    switchAudioMode(event) {
      this.toggleMode = !this.toggleMode;   // toggleMode = false --> yoursActive = true
      this.yoursActive = !this.yoursActive;
      // TODO: modularize & fix this code -- right now very crude
      if (this.yoursActive) {
        this.delayNodeLeft.delayTime.setValueAtTime(this.delayTimeValLeft, this.context.currentTime);
        this.feedbackNodeLeft.gain.setValueAtTime(this.feedbackGainLeft, this.context.currentTime);
        this.dryGainNodeLeft.gain.setValueAtTime(1.0 - this.wetDryValLeft, this.context.currentTime);
        this.wetGainNodeLeft.gain.setValueAtTime(this.wetDryValLeft, this.context.currentTime);

        this.delayNodeRt.delayTime.setValueAtTime(this.delayTimeValRt, this.context.currentTime);
        this.feedbackNodeRt.gain.setValueAtTime(this.feedbackGainRt, this.context.currentTime);
        this.dryGainNodeRt.gain.setValueAtTime(1.0 - this.wetDryValRt, this.context.currentTime);
        this.wetGainNodeRt.gain.setValueAtTime(this.wetDryValRt, this.context.currentTime);
      } else {
        this.delayNodeLeft.delayTime.setValueAtTime(this.ansDelayTimeValLeft, this.context.currentTime);
        this.feedbackNodeLeft.gain.setValueAtTime(this.ansFeedbackGainLeft, this.context.currentTime);
        this.dryGainNodeLeft.gain.setValueAtTime(1.0 - this.ansWetDryValLeft, this.context.currentTime);
        this.wetGainNodeLeft.gain.setValueAtTime(this.ansWetDryValLeft, this.context.currentTime);
        
        this.delayNodeRt.delayTime.setValueAtTime(this.ansDelayTimeValRt, this.context.currentTime);
        this.feedbackNodeRt.gain.setValueAtTime(this.ansFeedbackGainRt, this.context.currentTime);
        this.dryGainNodeRt.gain.setValueAtTime(1.0 - this.ansWetDryValRt, this.context.currentTime);
        this.wetGainNodeRt.gain.setValueAtTime(this.ansWetDryValRt, this.context.currentTime);
      }
    },
    outputGainUpdateLeft(event) {
        if (this.yoursActive) {
            this.outputGainLeft = event.target.value;
            this.outputGainNodeLeft.gain.setValueAtTime(this.outputGainLeft, this.context.currentTime);
            console.log("left output gain: ", this.outputGainNodeLeft.gain.value);
        }
    },
    outputGainUpdateRt(event) {
        if (this.yoursActive) {
            this.outputGainRt = event.target.value;
            this.outputGainNodeRt.gain.setValueAtTime(event.target.value, this.context.currentTime);
            console.log("right output gain: ", this.outputGainNodeRt.gain.value);
        }
    },
    generateAnswer(event) {
      this.showScore = false; // hide the old answer if creating new answer now
      this.exerciseNum++;
      this.ansDelayTimeValLeft = generateAnswer(0,1.0);
      this.ansFeedbackGainLeft = generateAnswer(0, 1.0);
      this.ansWetDryValLeft = generateAnswer(0.0,1.0);
      this.ansDelayTimeValRt = generateAnswer(0,1.0);
      this.ansFeedbackGainRt = generateAnswer(0, 1.0);
      this.ansWetDryValRt = generateAnswer(0.0,1.0);
      console.log("new answer:",
                "\ndelayTime Left Ans: ", (this.ansDelayTimeValLeft*1000), 
                "\nfdbk gain Left Ans: ", this.ansFeedbackGainLeft,
                "\nwetdry Left Ans: ", this.ansWetDryValLeft);
    console.log("new answer:",
                "\ndelayTime Rt Ans: ", (this.ansDelayTimeValRt*1000), 
                "\nfdbk gain Rt Ans: ", this.ansFeedbackGainRt,
                "\nwetdry Rt Ans: ", this.ansWetDryValRt);
    }
  },
};

</script>

<template>
  
  <div class="title">
    <h1 class="black">Stereo Delay</h1>
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
      <input type="range" @input="delayTimeUpdateLeft" v-model="this.delayTimeValLeft" id="delayDurLeft"
      name="Left Delay Duration Left" min="0.0" max="0.03" step="0.001" value="0.0" class="efx-slider" >
      <p>left delay duration: {{ (this.delayTimeValLeft)*1000 }} ms</p>
      
      <input type="range" @input="feedbackGainUpdateLeft" v-model="this.feedbackGainLeft" id="fdbkGainLeft"
      name="Left Feedback Gain" min="0" max=".9" step=".1" value="0.0" class="efx-slider" >
      <p>left feedback gain: {{ (this.feedbackGainLeft) }}</p>
      
      <input type="range" @input="wetDryUpdateLeft" v-model="this.wetDryValLeft" id="wetDryMixLeft"
      name="Left Wet/Dry Mix" min="0.0" max="1.0" step="0.1" class="efx-slider" >
      <p>left dry/wet mix {{ (this.wetDryValLeft)*100 }}%</p>

      <input type="range" @input="outputGainUpdateLeft" v-model="this.outputGainLeft" id="outputGainLeft"
      name="Left Output Gain" min="0.0" max="1" step="0.1" value="0.0" class="efx-slider" >
      <p>left output gain: {{ this.outputGainLeft }} </p>

      <input type="range" @input="delayTimeUpdateRt" v-model="this.delayTimeValRt" id="delayDurRt"
      name="Right Delay Duration" min="0.0" max="0.03" step="0.001" value="0.0" class="efx-slider" >
      <p>right delay duration: {{ (this.delayTimeValRt)*1000 }} ms</p>
      
      <input type="range" @input="feedbackGainUpdateRt" v-model="this.feedbackGainRt" id="fdbkGainRt"
      name="Right Feedback Gain" min="0" max=".9" step=".1" value="0.0" class="efx-slider" >
      <p>right feedback gain: {{ (this.feedbackGainRt) }}</p>
      
      <input type="range" @input="wetDryUpdateRt" v-model="this.wetDryValRt" id="wetDryMixRt"
      name="Right Wet/Dry Mix" min="0.0" max="1.0" step="0.1" class="efx-slider" >
      <p>right dry/wet mix {{ (this.wetDryValRt)*100 }}%</p>
      
      <input type="range" @input="outputGainUpdateRt" v-model="this.outputGainRt" id="outputGainRt"
      name="Right Output Gain" min="0.0" max="1" step="0.1" value="0.0" class="efx-slider" >
      <p>right output gain: {{ this.outputGainRt }} </p>

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
  margin-top: 2%;
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
