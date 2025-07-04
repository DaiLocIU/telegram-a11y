<template lang="pug">
    v-form.w-full.max-w-sm.mx-auto.pt-24.px-4
        CountryCodeInput(
            v-model="selectedCountry"
            :phone-codes="phoneCodes"
            @update:modelValue="handleChangeSelectedCountry"
        )
        TextNumberPhone(
          :value="fullNumber"
          @update:fullNumber="handleUpdateFullNumber"
          ref="textNumberPhoneRef"
        )
</template>
<script lang="ts">
import { defineComponent, ref, computed, nextTick, watch } from "vue";
import CountryCodeInput from "../../components/auth/CountryCodeInput.vue";
import TextNumberPhone from "../../components/auth/TextNumberPhone.vue";
import type { ApiCountryCode } from "../../api/types";
import { getCountryFromPhoneNumber } from "../../utils/phoneNumber";

interface Country {
  countryCode: string;
  iso2: string;
  [key: string]: any;
}

export default defineComponent({
  name: "AuthPhoneNumber",
  props: {
    phoneCodes: {
      type: Array as () => ApiCountryCode[],
      required: true,
    },
  },
  components: {
    CountryCodeInput,
    TextNumberPhone,
  },
  setup(props) {
    const textNumberPhoneRef = ref<InstanceType<typeof TextNumberPhone> | null>(null);
    // countryListStore
    const selectedCountry = ref<Country | null>(null);

    const phoneNumber = ref("");

    const fullNumber = ref("");

    const handleChangeSelectedCountry = (value: ApiCountryCode) => {
      phoneNumber.value = "";
      nextTick(() => {
        if (textNumberPhoneRef.value && textNumberPhoneRef.value.$el) {
          const input = textNumberPhoneRef.value.$el.querySelector("input");
          if (input) {
            input.focus();
          }
        }
      });
    };
    // Full phone number
    const countryCode = computed(() => {
      return selectedCountry.value ? `+${selectedCountry.value.countryCode}` : "";
    });

    watch(selectedCountry, (newValue) => {
      console.log("Selected country changed:", newValue);
      if (newValue) {
        fullNumber.value = `${countryCode.value} ${phoneNumber.value}`;
      } else {
        fullNumber.value = "";
      }
    });

    const handleUpdateFullNumber = (newFullNumber: string) => {
      if (!newFullNumber.length) {
        phoneNumber.value = "";
      }
      const suggestedCountry =
        props.phoneCodes && getCountryFromPhoneNumber(props.phoneCodes, newFullNumber);

      console.log("Suggested country from phone number:", suggestedCountry);
      // // Any phone numbers should be allowed, in some cases ignoring formatting
      const newCountry =
        !selectedCountry.value ||
        (suggestedCountry && suggestedCountry.iso2 !== selectedCountry.value.iso2) ||
        (!suggestedCountry && newFullNumber.length)
          ? suggestedCountry
          : selectedCountry.value;
      console.log("New country after update:", newCountry);
      if (
        !newCountry ||
        !selectedCountry.value ||
        (newCountry && newCountry.iso2 !== selectedCountry.value.iso2)
      ) {

        selectedCountry.value = newCountry;
      }
    };

    return {
      selectedCountry,
      handleChangeSelectedCountry,
      fullNumber,
      handleUpdateFullNumber,
      textNumberPhoneRef,
      countryCode,
      phoneNumber,
    };
  },
});
</script>
