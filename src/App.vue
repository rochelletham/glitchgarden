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
import StereoDelayContent from './components/StereoDelayContent.vue';



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
    StereoDelayContent,
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
      return this.$route.query.component || 'EchoContent'; // Default component
    }
  }
}
</script>

<style>

</style>
