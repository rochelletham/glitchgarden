import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
export const Mode = {
    YOURS: 1,
    EXPECTED: 2
  };
createApp(App).mount('#app')