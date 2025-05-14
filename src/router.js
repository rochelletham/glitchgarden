import { createMemoryHistory, createRouter } from 'vue-router'

import App from '@/App.vue';
import About from '@/components/About.vue';
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
    component: App,
    props: route => ({ component: route.query.component })
  },
  { path: '/@/components/FlangerContent.vue', 
    name: 'FlangerContent',
    component: FlangerContent},
  { path: '/@/components/ChorusContent.vue', 
    name: 'ChorusContent',
    component: ChorusContent},
  { path: '/@/components/VibratoContent.vue', 
    name: 'VibratoContent',
    component: VibratoContent},
  { path: '/@/components/WhiteChorusContent.vue', 
    name: 'WhiteChorusContent',
    component: WhiteChorusContent},
  { path: '/@/components/DoublingContent.vue', 
    name: 'DoublingContent',
    component: DoublingContent},
  { path: '/@/components/EchoContent.vue', 
    name: 'EchoContent',
    component: EchoContent
  }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;