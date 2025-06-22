<template lang="pug">
    v-text-field(
        color="primary"
        label="Your phone number"
        variant="outlined"
        v-model="fullNumber"
        type="tel"
        @change="e => $emit('update:fullNumber', e)"
    )
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  name: "TextNumberPhone",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  emits: ['update:fullNumber'],
  setup(props) {
    const fullNumber = ref(props.value);

    watch(() => props.value, (newValue) => {
      fullNumber.value = newValue;
    });


    return {
      fullNumber
    };
  },
});
</script>