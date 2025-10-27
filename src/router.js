import { createMemoryHistory, createRouter } from 'vue-router'

import App from '@/App.vue';
import About from '@/components/About.vue';
import PhaserContent from '@/components/PhaserContent.vue'
import FlangerContent from '@/components/FlangerContent.vue'
import ChorusContent from '@/components/ChorusContent.vue'
import VibratoContent from '@/components/VibratoContent.vue'
import WhiteChorusContent from '@/components/WhiteChorusContent.vue'
import DoublingContent from '@/components/DoublingContent.vue'
import EchoContent from '@/components/EchoContent.vue'

const routes = [
  { path: '/about', 
    name: 'About', 
    component: About},
  { path: '/', 
    name: 'Home', 
    component: EchoContent},
    // props: route => ({ component: route.query.component })},
  { path: '/flanger', 
    name: 'FlangerContent',
    component: FlangerContent},
  { path: '/chorus', 
    name: 'ChorusContent',
    component: ChorusContent},
  { path: '/vibrato', 
    name: 'VibratoContent',
    component: VibratoContent},
  { path: '/whitechorus', 
    name: 'WhiteChorusContent',
    component: WhiteChorusContent},
  { path: '/doubling', 
    name: 'DoublingContent',
    component: DoublingContent},
  { path: '/echo', 
    name: 'EchoContent',
    component: EchoContent},
  { path: '/phaser', 
    name: 'PhaserContent',
    component: PhaserContent
  }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
router.push({ query: { ...routes.query, t: Date.now() }});
export default router;