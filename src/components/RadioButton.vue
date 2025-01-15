<script>

import '../assets/tailwind.css';


export default {
  name: 'RadioButton',
  props: {
    lfoType: {
      required: true
    }
  },
  
  data() {
    return {
      localLfoType: this.lfoType
    };
  },
  watch: {
    // Watch the localLfoType and emit changes back to the parent
    localLfoType(newValue) {
      this.$emit('changeLFOType', newValue);
    }
  },
  mounted() {
  },
  methods: {
    updateLocalLfoType() {
        this.$emit('changeLFOType', 'sine');
    }
  },
};

</script>

<!-- https://play.tailwindcss.com/LXJZf4rCsi -->
<template>
    <div class="flex">
        <div class="inline-flex overflow-hidden border border-gray-200 rounded-lg">
            <label for="sine" class="cursor-pointer">
                <input type="radio" name="lfotype" id="sine" class="sr-only peer" @click="updateLocalLfoType" value="sine" v-model="localLfoType" checked>
                <span class="relative inline-flex items-center h-full py-2 pr-3 space-x-2 text-sm pl-7 peer-checked:bg-blue-200">
                <span class="before:w-2 before:h-2 before:bg-blue-500 before:rounded-full before:absolute before:top-[14px] before:left-3">sine</span>
                </span>
            </label>
            <label for="saw" class="cursor-pointer">
                <input type="radio" name="lfotype" id="saw" @click="updateLocalLfoType" value="saw" v-model="localLfoType" class="sr-only peer">
                <span class="relative inline-flex items-center h-full py-2 pr-3 space-x-2 text-sm pl-7 peer-checked:bg-green-200">
                <span class="before:w-2 before:h-2 before:bg-green-500 before:rounded-full before:absolute before:top-[14px] before:left-3">saw</span>
                </span>
            </label>
            <label for="square" class="cursor-pointer">
                <input type="radio" name="lfotype" id="square" @click="updateLocalLfoType" value="square" v-model="localLfoType" class="sr-only peer">
                <span class="relative inline-flex items-center h-full py-2 pr-3 space-x-2 text-sm pl-7 peer-checked:bg-indigo-200">
                <span class="before:w-2 before:h-2 before:bg-indigo-500 before:rounded-full before:absolute before:top-[14px] before:left-3">square</span>
                </span>
            </label>
            </div>
    </div>
    <h2>lfo type</h2>
</template>

<style scoped>
h2 {
    padding-top: 2px;
}
</style>