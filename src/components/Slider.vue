<script>

// defineProps({
//   title: {
//     type: String,
//     required: true
//   }
// })
import '../assets/tailwind.css';


export default {
  data() {
    return {
      
    };
  },
  mounted() {
  }
};

</script>

<template>
  <div class="title">
    <h1 class="black"></h1>
  </div>
  <div>
    <!-- <button @click="startAudioContext" class="bg-green-500">Start Audio Context</button> -->
    <button type="button"  @click="startAudioContext" class="text-white bg-gradient-to-r 
    from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
    focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 
    text-center me-2 mb-2">Start Audio Context</button>

    <br>
    <button @click="playAudio" class="bg-blue-200">Play</button>
    <audio ref="audioElement" controls>
      <source src="../soundfiles/audio.mp3" type="audio/mpeg" />
      Your browser does not support the audio tag.
    </audio>
    
    <input type="range" @input="delayTimeUpdate" v-model="this.delayTimeVal" id="delayDur"
     name="Delay Duration" min="0" max="1" step="0.01" value="0.0" class="efx-slider" >
    <p>duration: {{ (this.delayTimeVal)*1000 }} ms</p>
    <input type="range" @input="feedbackGainUpdate" v-model="this.feedbackGain" id="fdbkGain"
     name="Delay Duration" min="0" max="1" step=".1" value="0.0" class="efx-slider" >
    <p>feedback gain: {{ (this.feedbackGain) }}</p>
  </div>

</template>

<style scoped>

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.title h1,
.title h3 {
  text-align: center;
}

/* slider bar */
.efx-slider {
  -webkit-appearance: none;
  -moz-appearance: none;
  transform: rotate(180deg) scaleX(-1);
  writing-mode: vertical-lr;
  width: 18px;
  cursor: pointer;
  /* margin-top: 45%; un-comment if want to have the param label at bottom instead */
  position: relative;
  align-items: center;
  min-height: 270px;
  max-height: fit-content;
  /* height: 50%; */
  border-radius: 3px;
  /* background: rgb(211, 211, 211); */
  background: rgb(229, 225, 233);
  /* border: 1px solid rgb(205, 204, 204); */
  max-width: 50%;
  outline: none;
  opacity: 0.85;
  }

  /* the knob of the slider */
  .efx-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    -moz-appearance: none;
    height: 15px;
    width: 40px;
    background-color: rgb(255, 255, 255);
    border: 2px solid rgb(184, 183, 183);
    /* border: 2px solid rgb(192, 192, 192); */
    border-radius: 3px;

  }

  .efx-slider::-webkit-slider-thumb:hover {
    /* animation for highlight */
    transition: .05s ease-in-out; 
    border-color: rgb(220, 220, 220);
    width: 46px;
    /* box-shadow: h-offset v-offset blur-radius spread-radius color inset; */
    box-shadow: 0 0 0 2px rgb(237, 236, 236);
  }

  .efx-slider:hover {
    transition: .05s ease-in-out; 
    border-radius: 3px;
    /* box-shadow: h-offset v-offset blur-radius spread-radius color inset; */
    box-shadow: 0 0 0 1px rgb(237, 236, 236);
  }

/* @media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
} */
</style>
