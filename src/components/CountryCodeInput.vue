<template lang="pug">
    v-autocomplete(
        label="Country"
        v-model="selectedCountry"
        :items="phoneCodes"
        variant="outlined"
        return-object
        item-title="defaultName"
        item-value="id"
        color="primary"
    )
        template(v-slot:item="{ item, props }")
          v-list-item(v-bind="props")
            template(v-slot:title)
              .d-flex.justify-space-between.align-center
                .d-flex.align-center.gap-4
                  span.text-3xl {{ isoToEmoji(item.raw.iso2) }}
                  span.text-sm.font-medium {{ item.raw.defaultName || item.name }}
                span.text-sm.font-medium.opacity-50 {{ `+${item.raw.countryCode}` }}
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { isoToEmoji } from '../utils/emoji/emoji'
import { useTelegram } from '../composables/useTelegram';
import useCountryListStore  from '../stores/countryList';

export default defineComponent({
  name: "CountryCodeInput",
  setup() {
    const { initClient } = useTelegram()
    const countryListStore = useCountryListStore()
    const selectedCountry = ref(null);
    const { countryList } = storeToRefs(countryListStore)
    const phoneCodes = computed(() => (countryList.value.phoneCodes || []).map((item) => ({
      ...item,
      id: `${item.countryCode}_${item.iso2}`, // Unique ID for each country code
    })));

    onMounted(async () => {
      await initClient()
      countryListStore.loadCountryList()
    })

    return {
      selectedCountry,
      countryList,
      phoneCodes,
      isoToEmoji
    };
  },
  mounted() {
      window.__countryCodeInput = this;
  },
});
</script>
