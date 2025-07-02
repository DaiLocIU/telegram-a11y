
<template lang="pug">
  v-app
    v-main
      AuthPhoneNumber
</template>


<script lang="ts">
import { onMounted } from 'vue';
import AuthPhoneNumber from './components/auth/AuthPhoneNumber.vue';
import { useTelegram } from './composables/useTelegram';
import useCountryListStore from './stores/countryList';
export default {
  name: 'App',
  components: {
    AuthPhoneNumber
  },
  setup() {
    // You can initialize any global state or perform setup tasks here
    const { initClient } = useTelegram();
    const countryListStore = useCountryListStore();
    onMounted(async () => {
      // Initialize the Telegram client when the app is mounted
      await initClient();
      countryListStore.loadCountryList();
    });
  }
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
