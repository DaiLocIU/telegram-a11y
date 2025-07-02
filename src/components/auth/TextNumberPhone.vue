<template lang="pug">
    v-text-field(
      color="primary"
      label="Your phone number"
      variant="outlined"
      v-model="fullNumber"
      type="tel"
      @update:modelValue="onChange"
    )
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "TextNumberPhone",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  emits: ["update:fullNumber"],
  setup(props, { emit }) {
    const fullNumber = ref(props.value);

    watch(
      () => props.value,
      (newValue) => {
        console.log("Watching value change in TextNumberPhone:", newValue);
        fullNumber.value = newValue;
      }
    );
    const onChange = (value: string) => {
      console.log("Handling change in TextNumberPhone:", value);
      fullNumber.value = value;
      // Emit the updated full number
      emit("update:fullNumber", fullNumber.value);
    };

    return {
      fullNumber,
      onChange,
    };
  },
});
</script>
