<script>
import { defineComponent } from 'vue';

export default {
    name: "CustomButton",
    data() {
    return {
      buttonColor: "lightblue", // Default color
    };
  },
  methods: {
    handleClick() {
      this.$emit("clicked"); // Emit a custom event when clicked
    },
  },
};
</script>

<template>

</template>

<style scoped>
button {
    margin: 5px;
    text-align: center;
    max-height: 50px;
    max-width: 60px;
}
</style>
