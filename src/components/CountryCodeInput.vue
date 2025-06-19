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
import { defineComponent, ref } from 'vue';
import { isoToEmoji } from '../utils/emoji/emoji'

export default defineComponent({
  name: "CountryCodeInput",
  props: {
    value: {
      type: Object,
      default: null,
    },
    phoneCodes: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const selectedCountry = ref(props.value);

    return {
      selectedCountry,
      isoToEmoji
    };
  },
  mounted() {
      window.__countryCodeInput = this;
  },
});
</script>
