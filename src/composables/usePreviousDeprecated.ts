import { ref, watch } from 'vue';

export function usePreviousDeprecated<T>(value: T, shouldSkipUndefined = false) {
  const previous = ref<T | undefined>(undefined);

  watch(
    () => value,
    (newValue) => {
      if (!shouldSkipUndefined || newValue !== undefined) {
        previous.value = newValue;
      }
    },
    { immediate: false }
  );

  return previous;
}