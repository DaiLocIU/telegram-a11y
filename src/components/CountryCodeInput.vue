<template lang="pug">
    v-autocomplete(
        label="Country"
        v-model="selectedCountry"
        :items="countries"
        variant="outlined"
        item-value="code"
        item-title="name"
        color="primary"
    )
        template(v-slot:item="{ item, props }")
          v-list-item(v-bind="props")
            template(v-slot:title)
              span {{ item.raw.flag }} {{ item.raw.name }} ({{ item.raw.phone || 'N/A' }})
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useTelegram } from '../composables/useTelegram';
export default defineComponent({
  name: "CountryCodeInput",
  setup() {
    const selectedCountry = ref(null);
    const countries = [
      { name: "United States", code: "US", flag: "🇺🇸", phone: '+01' },
      { name: "Canada", code: "CA", flag: "🇨🇦", phone: '+01' },
      { name: "United Kingdom", code: "GB", flag: "🇬🇧", phone: '+01' },
      { name: "Australia", code: "AU", flag: "🇦🇺", phone: '+01' },
      { name: "Germany", code: "DE", flag: "🇩🇪", phone: '+01' },
      { name: "France", code: "FR", flag: "🇫🇷", phone: '+01' },
      { name: "Japan", code: "JP", flag: "🇯🇵", phone: '+01'},
      { name: "China", code: "CN", flag: "🇨🇳" },
      { name: "India", code: "IN", flag: "🇮🇳" },
      { name: "Brazil", code: "BR", flag: "🇧🇷" },
    ];


    const { initClient, getClient } = useTelegram()

    onMounted(async () => {
      await initClient()

      const client = getClient()
      console.log('Telegram client initialized:', client)
      // const me = await client.getMe()
      // console.log('Logged in as:', me.username)
    })

    return {
      selectedCountry,
      countries,
    };
  },
});
</script>
