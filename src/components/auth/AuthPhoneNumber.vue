<template lang="pug">
    v-form.w-full.max-w-sm.mx-auto.pt-24.px-4(
      @submit.prevent="handleSubmit"
    )
        CountryCodeInput(
            v-model="selectedCountry"
            :phone-codes="phoneCodes"
            @update:modelValue="handleChangeSelectedCountry"
        )
        TextNumberPhone(
          :value="fullNumber"
          @update:fullNumber="handleUpdateFullNumber"
          ref="textNumberPhoneRef"
        )
        v-btn.w-full(
          v-if="canSubmit"
          type="submit"
          color="primary"
          size="large"
        ) Next


</template>
<script lang="ts">
import { defineComponent, ref, computed, nextTick, watch, watchEffect } from "vue";
import CountryCodeInput from "../../components/auth/CountryCodeInput.vue";
import TextNumberPhone from "../../components/auth/TextNumberPhone.vue";
import type { ApiCountryCode } from "../../api/types";
import { getCountryFromPhoneNumber, formatPhoneNumber } from "../../utils/phoneNumber";
import { useTelegram } from "@/composables/useTelegram";
import useAuthStore from "@/stores/auth";

const MIN_NUMBER_LENGTH = 7;

export default defineComponent({
  name: "AuthPhoneNumber",
  props: {
    phoneCodes: {
      type: Array as () => ApiCountryCode[],
      required: true,
    },
  },
  components: {
    CountryCodeInput,
    TextNumberPhone,
  },
  setup(props) {
    const { sendCode } = useTelegram();
    const authStore = useAuthStore();

    const textNumberPhoneRef = ref<InstanceType<typeof TextNumberPhone> | null>(null);
    // countryListStore
    const selectedCountry = ref<ApiCountryCode | null>(null);

    const phoneNumber = ref("");

    // const fullNumber = ref("");

    const handleChangeSelectedCountry = (value: ApiCountryCode) => {
      phoneNumber.value = "";
      nextTick(() => {
        if (textNumberPhoneRef.value && textNumberPhoneRef.value.$el) {
          const input = textNumberPhoneRef.value.$el.querySelector("input");
          if (input) {
            input.focus();
          }
        }
      });
    };
    // Full phone number
    const countryCode = computed(() => {
      return selectedCountry.value ? `+${selectedCountry.value.countryCode}` : "";
    });

    const fullNumber = computed(() => {
      if (!selectedCountry.value) {
        return phoneNumber.value;
      }
      return `${countryCode.value} ${phoneNumber.value || ""}`;
    });

    const canSubmit = computed(() => {
      return (
        fullNumber.value &&
        fullNumber.value.replace(/[^\d]+/g, "").length >= MIN_NUMBER_LENGTH
      );
    });

    const handleUpdateFullNumber = (newFullNumber: string) => {
      if (newFullNumber === fullNumber.value) {
        return;
      }
      if (!newFullNumber.length) {
        phoneNumber.value = "";
      }
      const suggestedCountry =
        props.phoneCodes && getCountryFromPhoneNumber(props.phoneCodes, newFullNumber);

      // // Any phone numbers should be allowed, in some cases ignoring formatting
      const newCountry: ApiCountryCode =
        !selectedCountry.value ||
        (suggestedCountry && suggestedCountry.iso2 !== selectedCountry.value.iso2) ||
        (!suggestedCountry && newFullNumber.length)
          ? suggestedCountry
          : selectedCountry.value;
      if (
        !newCountry ||
        !selectedCountry.value ||
        (newCountry && newCountry.iso2 !== selectedCountry.value.iso2)
      ) {
        selectedCountry.value = newCountry;
      }
      phoneNumber.value = formatPhoneNumber(newFullNumber, selectedCountry.value);
    };

    const handleSubmit = () => {
      sendCode(fullNumber.value)
        .then((res) => {
          console.log("sendCode response:", res);

          authStore.onRequestCode({
            phoneHash: res.phoneCodeHash,
            phone: res.phoneNumber,
          });
          // Handle successful code sending
          console.log("Code sent successfully");
        })
        .catch((error) => {
          // Handle error in sending code
          console.error("Error sending code:", error);
        });
    };

    return {
      selectedCountry,
      handleChangeSelectedCountry,
      fullNumber,
      canSubmit,
      handleUpdateFullNumber,
      textNumberPhoneRef,
      countryCode,
      phoneNumber,
      handleSubmit
    };
  },
});
</script>
