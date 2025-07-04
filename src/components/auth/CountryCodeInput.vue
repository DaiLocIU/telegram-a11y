<template lang="pug">
    v-autocomplete(
        ref="countryCodeInputRef"
        label="Country"
        v-model="selectedCountry"
        :items="phoneCodes"
        variant="outlined"
        return-object
        item-title="defaultName"
        item-value="id"
        color="primary"
        no-data-text="Country not found"
        @update:modelValue="handleUpdate"
    )
        template(v-slot:item="{ item, props }")
          v-list-item(v-bind="props")
            template(v-slot:title)
              .flex.justify-between.items-center
                .flex.items-center.gap-2
                  span.text-3xl {{ isoToEmoji(item.raw.iso2) }}
                  span.text-sm.font-medium {{ item.raw.defaultName || item.name }}
                span.text-sm.font-medium.opacity-50 {{ `+${item.raw.countryCode}` }}
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { isoToEmoji } from "../../utils/emoji/emoji";
import type { ApiCountryCode } from "../../api/types";
import { on } from "events";

export default defineComponent({
  name: "CountryCodeInput",
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
    phoneCodes: {
      type: Array as () => ApiCountryCode[],
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const countryCodeInputRef = ref(null);
    const selectedCountry = ref(props.modelValue);

    const forceUpdateUI = (newValue) => {
      if (!newValue) {
        const vInputEl = countryCodeInputRef.value.$el;
        const vFieldEl = vInputEl.querySelector(".v-field");
        vInputEl.classList.remove("v-input--dirty", "v-input--is-active");
        vFieldEl.classList.remove("v-field--dirty", "v-field--is-active");

        const inputEl = vInputEl.querySelector("input");
        inputEl.value = "";
        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }

      const vInputEl = countryCodeInputRef.value.$el;
      const inputEl = vInputEl.querySelector("input");
      inputEl.value = newValue["defaultName"];
      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
    };

    watch(
      () => props.modelValue,
      (newValue) => {
        selectedCountry.value = newValue;
        console.log("Model value changed:", newValue);
        if (!newValue) {
        }
        forceUpdateUI(newValue);
        // selectedCountryChange.value += 1; // Trigger re-render
      }
    );

    const handleUpdate = (value: ApiCountryCode) => {
      if (value === props.modelValue) {
        console.log("No change in selected country, skipping update.");
        return
      }
      console.log("handleUpdateee", value);
      selectedCountry.value = value;
      emit("update:modelValue", value);
    };

    onMounted(() => {
      console.log("countryCodeInputRef", countryCodeInputRef.value);
    });
    return {
      selectedCountry,
      isoToEmoji,
      handleUpdate,
      countryCodeInputRef,
    };
  },
});
</script>
