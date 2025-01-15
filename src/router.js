import { createMemoryHistory, createRouter } from 'vue-router'

import FlangerContent from '@/components/FlangerContent.vue'
import ChorusContent from '@/components/ChorusContent.vue'
import VibratoContent from '@/components/VibratoContent.vue'
import WhiteChorusContent from '@/components/WhiteChorusContent.vue'
import DoublingContent from '@/components/DoublingContent.vue'
import EchoContent from '@/components/EchoContent.vue'

const routes = [
  { path: '/@/components/FlangerContent.vue', component: FlangerContent},
  { path: '/@/components/ChorusContent.vue', component: ChorusContent},
  { path: '/@/components/VibratoContent.vue', component: VibratoContent},
  { path: '/@/components/WhiteChorusContent.vue', component: WhiteChorusContent},
  { path: '/@/components/DoublingContent.vue', component: DoublingContent},
  { path: '/@/components/EchoContent.vue', component: EchoContent},
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router