<template>
  <NavigatorBar/>
  <component :is="selectedComponent" />
  <!-- <PhaserContent/> -->
  <!-- <StereoDelayContent/> -->
  <!-- <FlangerContent/> -->
  <!-- <ChorusContent/>
  <DoublingContent/> 
  <EchoContent/>  -->
  <!-- <VibratoContent/> -->
  <!-- <WhiteChorusContent/> -->
</template>

<script>
import './assets/tailwind.css';
// import '@/customButton.js';
import '@/utils/effectProps.js';
import NavigatorBar from './components/NavigatorBar.vue';
import PhaserContent from './components/PhaserContent.vue';
import FlangerContent from './components/FlangerContent.vue';
import ChorusContent from './components/ChorusContent.vue';
import DoublingContent from './components/DoublingContent.vue';
import EchoContent from './components/EchoContent.vue';
import About from './components/About.vue';
import router from './router';
// import VibratoContent from './components/VibratoContent.vue';
// import WhiteChorusContent from './components/WhiteChorusContent.vue';
// import StereoDelayContent from './components/StereoDelay.vue';



export default {
  name: 'App',
  components: {
    NavigatorBar,
    FlangerContent,
    ChorusContent,
    DoublingContent,
    EchoContent,
    About,
    // VibratoContent,
    // WhiteChorusContent,
    // StereoDelayContent,
    PhaserContent
  },
  props: {
    component: {
      type: String,
      default: 'FlangerContent' // Default component
    }
  },
  computed: {
    selectedComponent() {
      return this.$route.query.component || 'PhaserContent'; // Default component
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background-color: var(--serum-dark-bg);
  color: --serum-highlight-blue; */
  

  /* margin-top: 60px; */
}
</style>
