<template lang="pug">
    div(class="max-w-[400px] flex mt-4 mx-auto")
        CountryCodeInput(
            v-model="selectedCountry"
            :phone-codes="phoneCodes"
        )
</template>
<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { storeToRefs } from 'pinia';
import { useTelegram } from '@/composables/useTelegram';
import useCountryListStore  from '@/stores/countryList';
import CountryCodeInput from "@/components/CountryCodeInput.vue";

export default defineComponent({
  name: "AuthPhoneNumber",
  components: {
    CountryCodeInput,
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
