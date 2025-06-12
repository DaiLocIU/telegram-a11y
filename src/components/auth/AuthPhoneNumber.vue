<template lang="pug">
    div(class="max-w-[400px] flex mt-4 mx-auto")
        CountryCodeInput()
</template>
<script>
import { defineComponent } from 'vue';
import CountryCodeInput from '../CountryCodeInput.vue';
export default defineComponent({
    name: 'AuthPhoneNumber',
    components: {
        CountryCodeInput
    }
});
</script>