import { defineCustomElement } from 'vue';
import CustomButton from '@/components/CustomButton.vue';

const CustomButtonConstructor = defineCustomElement(CustomButton);

// Register the custom element with the browser
customElements.define('CustomButton', CustomButtonConstructor);