<script>

import '../assets/tailwind.css';
// import StartButton from './StartButton.vue';
import checkAnswer from '@/utils/checkAnswer';

export default {
  name: 'DelayContent',
  
  data() {
    return {
      context: null,
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
    };
  },
  mounted() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    // Create a MediaElementAudioSourceNode
    const audioClip = document.querySelector('audio');
    const source = this.context.createMediaElementSource(audioClip);
    this.feedbackGain = 0.0;
    this.delayTimeVal = 0.0;
    this.wetDryVal = 0.0;
    this.delayNode = new DelayNode(this.context, {
      delayTime: this.delayTimeVal,
      maxDelayTime: 5.0,
    });
    this.dryGainNode = this.context.createGain();
    this.dryGainNode.gain.value = 1.0;    // default to dry 100%
    console.log("intialize dry gain: ", this.dryGainNode.gain.value);
    source.connect(this.dryGainNode);
    this.dryGainNode.connect(this.context.destination);

    source.connect(this.delayNode);
    this.feedbackNode = this.context.createGain();
    this.feedbackNode.gain.value = 0.5;

    this.delayNode.connect(this.feedbackNode);
    this.feedbackNode.connect(this.delayNode);

    this.wetGainNode = this.context.createGain();
    this.delayNode.connect(this.wetGainNode);
    this.wetGainNode.gain.value = this.wetDryVal;
    console.log("intialize wet gain: ", this.wetGainNode.gain.value);
    this.wetGainNode.connect(this.context.destination);

    
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
    playAudio() {
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      this.$refs.audioElement.play();
    },
    pauseAudio() {
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      this.$refs.audioElement.pause();
    },
    delayTimeUpdate(event) {
      // if (currMode == Mode.YOURS)
      this.delayTimeVal = event.target.value;
      // this.delayNode.delayTime.value = this.delayTimeVal;
      this.delayNode.delayTime.setValueAtTime(event.target.value, this.context.currentTime);
    },
    feedbackGainUpdate(event) {
      // if (currMode == Mode.YOURS)
      this.feedbackGain = event.target.value;
      this.feedbackNode.gain.value = this.feedbackGain;
    },
    wetDryUpdate(event) {
      // if (currMode == Mode.YOURS)
      this.wetDryVal = event.target.value;
      this.dryGainNode.gain.value = 1.0 - this.wetDryVal;
      this.wetGainNode.gain.value = this.wetDryVal;
      console.log("dry, wet ", this.dryGainNode.gain.value, this.wetGainNode.gain.value);
    
    },
    checkAnswer(event) {
      // *1000 because in milliseconds
      [this.delayScore, this.fdbkScore, this.wetDryScore, this.score] = 
      checkAnswer((this.delayTimeVal)*1000, this.feedbackGain, this.wetDryVal);  
      this.showScore = true;
    },
    
  },
};

</script>

<template>
<!-- navbar from flowbite https://flowbite.com/docs/components/navbar/ -->
<nav class="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Audio Effects</span>
    </a>
    <button data-collapse-toggle="navbar-hamburger" type="button" class="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false">
      <span class="sr-only">Open main menu</span>
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
      </svg>
    </button>
    <div class="hidden w-full" id="navbar-hamburger">
      <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <!-- <li>
          <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded dark:bg-blue-600" aria-current="page">Home</a>
        </li> -->
        
      </ul>
    </div>
  </div>
</nav>

  <div class="title">
    <h1 class="black">Delay</h1>
  </div>
  <div>
  <button @click="startAudioContext" type="button" class="text-white 
  bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 
  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">start audio context</button>  
  <br><br>
    <!-- <button @click="playAudio" class="bg-blue-200">Play</button> -->
    <audio ref="audioElement" controls>
      <source src="../soundfiles/audio.mp3" type="audio/mpeg" />
      Your browser does not support the audio tag.
    </audio>
    <br>
    <input type="range" @input="delayTimeUpdate" v-model="this.delayTimeVal" id="delayDur"
     name="Delay Duration" min="0" max="1" step="0.01" value="0.0" class="efx-slider" >
    <p>duration: {{ (this.delayTimeVal)*1000 }} ms</p>
    
    <input type="range" @input="feedbackGainUpdate" v-model="this.feedbackGain" id="fdbkGain"
     name="Delay Duration" min="0" max="1" step=".1" value="0.0" class="efx-slider" >
    <p>feedback gain: {{ (this.feedbackGain) }}</p>
    
    <input type="range" @input="wetDryUpdate" v-model="this.wetDryVal" id="wetDryMix"
     name="Wet/Dry Mix" min="0" max="1" step="0.1" class="efx-slider" >
    <p>dry/wet mix {{ (this.wetDryVal) }}</p>
    <br>
    <button @click="checkAnswer" type="button" class="text-white 
  bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 
  font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 
  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">check answer</button>  
    <br><br>
    <p v-if="showScore">delay duration: {{ this.delayScore }}</p>
    <p v-if="showScore">feedback gain: {{ this.fdbkScore }}</p>
    <p v-if="showScore">dry/wet mix: {{ this.wetDryScore }}</p>
    <p v-if="showScore">overall score: {{ this.score }} %</p>
  </div>

</template>

<style scoped>
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
    height: 30px; 
    background-color: rgb(255, 255, 255);
    border: 2px solid rgb(184, 183, 183);
    border-radius:  3px;
    cursor: pointer; /* Pointer on hover */
}

.efx-slider::-webkit-slider-thumb:hover {
  /* animation for highlight */
  transition: .05s ease-in-out; 
  border-color: rgb(220, 220, 220);
  height: 35px;
  /* box-shadow: h-offset v-offset blur-radius spread-radius color inset; */
  box-shadow: 0 0 0 2px rgb(237, 236, 236);
}

/* @media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
} */
</style>
