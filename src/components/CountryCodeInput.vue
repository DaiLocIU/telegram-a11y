<template lang="pug">
    v-autocomplete(
        label="Country"
        v-model="selectedCountry"
        :items="phoneCodes"
        variant="outlined"
        item-value="code"
        item-title="defaultName"
        color="primary"
    )
        template(v-slot:item="{ item, props }")
          v-list-item(v-bind="props")
            template(v-slot:title)
              .d-flex.justify-space-between
                .d-flex.align-center
                  span {{ item.raw.defaultName || item.name }}
                span {{ `+${item.raw.countryCode}` }}
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTelegram } from '../composables/useTelegram';
import useCountryListStore  from '../stores/countryList';
export default defineComponent({
  name: "CountryCodeInput",
  setup() {
    const { initClient } = useTelegram()
    const countryListStore = useCountryListStore()
    const selectedCountry = ref(null);
    const { countryList } = storeToRefs(countryListStore)
    const phoneCodes = computed(() => countryList.value.phoneCodes || [])
    onMounted(async () => {
      await initClient()
      countryListStore.loadCountryList()
    })

    return {
      selectedCountry,
      countryList,
      phoneCodes,
    };
  },
  mounted() {
      window.__countryCodeInput = this;
  },
});
</script>
