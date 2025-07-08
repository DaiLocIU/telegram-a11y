<template lang="pug">
    pre {{ userInfo }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from "@/stores/auth";
import { storeToRefs } from "pinia";
export default defineComponent ({
    name: "Main",
    setup() {
        const authStore = useAuthStore();
        const { userInfo } = storeToRefs(authStore);
        return {
            userInfo
        };
    },
})
</script>