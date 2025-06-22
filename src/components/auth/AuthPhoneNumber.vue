<template lang="pug">
    v-form.w-full.max-w-sm.mx-auto.pt-24.px-4
        CountryCodeInput(
            v-model="selectedCountry"
            :phone-codes="phoneCodes"
        )
        TextNumberPhone
</template>
<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { storeToRefs } from 'pinia';
import { useTelegram } from '@/composables/useTelegram';
import useCountryListStore  from '@/stores/countryList';
import CountryCodeInput from "@/components/auth/CountryCodeInput.vue";
import TextNumberPhone from "@/components/auth/TextNumberPhone.vue";

export default defineComponent({
  name: "AuthPhoneNumber",
  components: {
    CountryCodeInput,
    TextNumberPhone
  },
  setup() {
    const { initClient } = useTelegram();
    const countryListStore = useCountryListStore();
    const selectedCountry = ref(null);
    const { countryList } = storeToRefs(countryListStore);
    const phoneCodes = computed(() =>
      (countryList.value.phoneCodes || []).map((item) => ({
        ...item,
        id: `${item.countryCode}_${item.iso2}`, // Unique ID for each country code
      }))
    );

    onMounted(async () => {
      await initClient();
      countryListStore.loadCountryList();
    });

    return {
      selectedCountry,
      phoneCodes: phoneCodes,
    };
  },
});
</script>
