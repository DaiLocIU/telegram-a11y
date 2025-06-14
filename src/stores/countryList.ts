import type { ApiCountry, ApiCountryCode } from "../api/types";

import { reactive } from "vue";
import { defineStore } from "pinia";
import { useTelegram } from "../composables/useTelegram";

interface CountryListState {
  phoneCodes: ApiCountryCode[];
  general: ApiCountry[];
}

export default defineStore("countryList", () => {
  // a function that returns a fresh state
  const {
    fetchCountryList
  } = useTelegram();
  const countryList = reactive<CountryListState>({
    phoneCodes: [],
    general: [],
  });
  const loadCountryList = async (): Promise<void> => {
    const countryListApi = await fetchCountryList({ langCode: "en" });
    console.log('countryListApi', countryListApi);
    if (!countryList) {
      console.error("Failed to load country list");
      return;
    }
    console.log('setValue countryList', countryListApi);
    Object.assign(countryList, countryListApi);
    // TODO: implement loading logic here
  }
  return {
    countryList,
    loadCountryList,
  }
});
