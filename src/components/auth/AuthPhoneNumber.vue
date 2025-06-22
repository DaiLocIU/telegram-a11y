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
<script>
import { defineComponent, ref, computed, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useTelegram } from "@/composables/useTelegram";
import useCountryListStore from "@/stores/countryList";
import CountryCodeInput from "@/components/auth/CountryCodeInput.vue";
import TextNumberPhone from "@/components/auth/TextNumberPhone.vue";

export default defineComponent({
  name: "AuthPhoneNumber",
  components: {
    CountryCodeInput,
    TextNumberPhone,
  },
  setup() {
    const textNumberPhoneRef = ref(null);
    const { initClient } = useTelegram();
    // countryListStore
    const countryListStore = useCountryListStore();
    const { countryList } = storeToRefs(countryListStore);
    const phoneCodes = computed(() =>
      (countryList.value.phoneCodes || []).map((item) => ({
        ...item,
        id: `${item.countryCode}_${item.iso2}`, // Unique ID for each country code
      }))
    );

    const selectedCountry = ref(null);
    const handleChangeSelectedCountry = () => {
      phoneNumber.value = "";
      nextTick(() => {
        const input = textNumberPhoneRef.value.$el.querySelector("input");
        if (input) {
          input.focus();
        }
      });
    };
    // Full phone number
    const countryCode = computed(() => {
      return selectedCountry.value ? `+${selectedCountry.value.countryCode}` : "";
    });
    const phoneNumber = ref("");

    const fullNumber = computed(() => {
      console.log("Computing full number:", countryCode.value, phoneNumber.value);
      if (!countryCode.value || !phoneNumber.value) {
        return "";
      }
      return `${countryCode.value} ${phoneNumber.value}`;
    });
    const handleUpdateFullNumber = (e) => {
      console.log("Full number updated:", e);
    };

    onMounted(async () => {
      await initClient();
      countryListStore.loadCountryList();
    });

    return {
      selectedCountry,
      handleChangeSelectedCountry,
      fullNumber,
      handleUpdateFullNumber,
      textNumberPhoneRef,
      phoneCodes: phoneCodes,
    };
  },
});
</script>
