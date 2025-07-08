<template lang="pug">
    v-text-field(
      color="primary"
      label="Code"
      variant="outlined"
      v-model="code"
      type="tel"
    )
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

import { useTelegram } from "@/composables/useTelegram";
import useAuthStore from "@/stores/auth";


export default defineComponent({
  name: "AuthCode",
  setup() {
    const code = ref("");

    const { signIn } = useTelegram();
    const authStore = useAuthStore();
    const { phoneHashCode, phoneNumber } = storeToRefs(authStore);


    // Watch for changes in the code input
    watch(code, (newValue) => {
        if (newValue.length  === 5) {
            console.log("Code entered:", newValue);
            console.log("Phone hash code:", phoneHashCode.value);
            console.log("Phone number:", phoneNumber.value);
            signIn({
                phoneCode: newValue,
                phoneCodeHash: phoneHashCode.value,
                phoneNumber: phoneNumber.value,
            })
        }

    });

    return {    
      code,
    };
  },
});
</script>