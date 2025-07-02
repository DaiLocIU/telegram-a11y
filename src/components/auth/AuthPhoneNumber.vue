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
import { storeToRefs } from "pinia";
import useCountryListStore from "../../stores/countryList";
import CountryCodeInput from "../../components/auth/CountryCodeInput.vue";
import TextNumberPhone from "../../components/auth/TextNumberPhone.vue";
import type { ApiCountryCode } from '../../api/types';

interface Country {
  countryCode: string;
  iso2: string;
  [key: string]: any;
}

export default defineComponent({
  name: "AuthPhoneNumber",
  components: {
    CountryCodeInput,
    TextNumberPhone,
  },
  setup() {
    const textNumberPhoneRef = ref<InstanceType<typeof TextNumberPhone> | null>(null);
    // countryListStore
    const countryListStore = useCountryListStore();
    const { countryList } = storeToRefs(countryListStore);

    const phoneCodes = computed(() =>
      (countryList.value.phoneCodes || []).map((item) => ({
        ...item,
        id: `${item.countryCode}_${item.iso2}`, // Unique ID for each country code
      }))
    );

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

    const handleUpdateFullNumber = (e: EventTarget) => {
      console.log("Full number updated:", e);
    };

    return {
      selectedCountry,
      handleChangeSelectedCountry,
      fullNumber,
      handleUpdateFullNumber,
      textNumberPhoneRef,
      phoneCodes: phoneCodes,
      countryCode,
      phoneNumber,
    };
  },
});
</script>
