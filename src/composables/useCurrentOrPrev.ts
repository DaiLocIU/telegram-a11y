import { usePreviousDeprecated } from './usePreviousDeprecated';
export function useCurrentOrPrev<T>(
  current: T,
  shouldSkipUndefined = false,
  shouldForceCurrent = false
) {
  const prev = usePreviousDeprecated<T>(current, shouldSkipUndefined);

  return shouldForceCurrent || (current !== null && current !== undefined)
    ? current
    : prev.value;
}