<template lang="pug">
    transition(name="fade")
       component(:is="componentProps.is" v-bind="componentProps.props")
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { storeToRefs } from "pinia";
import useAuthStore from "@/stores/auth";
import AuthPhoneNumber from "./AuthPhoneNumber.vue";
import AuthCode from "./AuthCode.vue";
import useCountryListStore from "@/stores/countryList";

export default defineComponent({
  name: "Auth",
  components: {},
  setup() {
    const authStore = useAuthStore();
    const { authState } = storeToRefs(authStore);

    const countryListStore = useCountryListStore();
    const { countryList } = storeToRefs(countryListStore);

    const phoneCodes = computed(() =>
      (countryList.value.phoneCodes || []).map((item) => ({
        ...item,
        id: `${item.countryCode}_${item.iso2}`, // Unique ID for each country code
      }))
    );

    const componentProps = computed(() => ({
        is:
            authState.value === "authorizationStateWaitPhoneNumber"
                ? AuthPhoneNumber
                : AuthCode,
        props:
            authState.value === "authorizationStateWaitPhoneNumber"
                ? {
                        phoneCodes: phoneCodes.value,
                    }
                : {},
    }));

    return {
      componentProps,
    };
    // This component is a placeholder for the AuthPhoneNumber component
    // It can be used to wrap the AuthPhoneNumber component or any other authentication-related components
  },
});
</script>
