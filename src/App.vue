<template lang="pug">
  v-app
    v-main
      component(:is="componentProps.is" v-bind="componentProps.props")
</template>

<script lang="ts">
import { onMounted, computed, watch, ref } from "vue";
import { storeToRefs } from "pinia";
import AuthPhoneNumber from "./components/auth/AuthPhoneNumber.vue";
import { useTelegram } from "./composables/useTelegram";
import useCountryListStore from "./stores/countryList";
import useConnectionStore from "./stores/connection";
import useAuthStore from "./stores/auth";
import Auth from "./components/auth/Auth.vue";
import Main from "./components/main/Main.vue";

enum AppScreens {
  auth,
  main,
  lock,
  inactive,
}

export default {
  name: "App",
  components: {
    AuthPhoneNumber,
  },
  setup() {
    // You can initialize any global state or perform setup tasks here
    const { initClient } = useTelegram();

    const countryListStore = useCountryListStore();

    const connectionStore = useConnectionStore();
    const { connectionState } = storeToRefs(connectionStore);

    const authStore = useAuthStore();
    const { authState } = storeToRefs(authStore);

    const activeKey = ref<AppScreens>(AppScreens.auth);

    watch(authState, (newState) => {
        console.log("Auth state changed:", newState);
        if (newState === "authorizationStateWaitPhoneNumber") {
          activeKey.value = AppScreens.auth;
        } else if (newState === "authorizationStateWaitCode") {
          activeKey.value = AppScreens.auth;
        } else if (newState === "authorizationStateReady") {
          activeKey.value = AppScreens.main;
        } else {
          activeKey.value = AppScreens.inactive;
        }
      },
      { immediate: true }
    );

    const componentProps = computed(() => {
      switch (activeKey.value) {
        case AppScreens.auth:
          return { is: Auth };
        case AppScreens.main:
          return { is: Main };
        case AppScreens.lock:
        case AppScreens.inactive:
        default:
          return { is: null };
      }
    });

    
    watch(connectionState, (newState) => {
      console.log("Connection state changed:", newState);
      countryListStore.loadCountryList();
    });
    onMounted(async () => {
      // Initialize the Telegram client when the app is mounted
      await initClient();
    });
    return {
      componentProps,
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
