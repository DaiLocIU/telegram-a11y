<template lang="pug">
  v-app
    v-main
      AuthPhoneNumber(
        :phone-codes="phoneCodes"
      )
</template>

<script lang="ts">
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import AuthPhoneNumber from "./components/auth/AuthPhoneNumber.vue";
import { useTelegram } from "./composables/useTelegram";
import useCountryListStore from "./stores/countryList";
export default {
  name: "App",
  components: {
    AuthPhoneNumber,
  },
  setup() {
    // You can initialize any global state or perform setup tasks here
    const { initClient } = useTelegram();
    const countryListStore = useCountryListStore();

    const { countryList } = storeToRefs(countryListStore);

    const phoneCodes = computed(() =>
      (countryList.value.phoneCodes || []).map((item) => ({
        ...item,
        id: `${item.countryCode}_${item.iso2}`, // Unique ID for each country code
      }))
    );

    onMounted(async () => {
      // Initialize the Telegram client when the app is mounted
      await initClient();
      countryListStore.loadCountryList();
    });
    return {
      phoneCodes,
    };
  },
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
