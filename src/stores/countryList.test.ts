import type { ApiCountry, ApiCountryCode } from "../api/types";

import { setActivePinia, createPinia } from 'pinia';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import countryListStore from './countryList';

interface CountryListState {
  phoneCodes: ApiCountryCode[];
  general: ApiCountry[];
}

// Mock data for the API response
const mockApiData: CountryListState  = {
  phoneCodes: [
    {
      name: "United States",
      countryCode: "1",
      iso2: "US",
      defaultName: "United States",
    },
  ],
  general: [
    {
      iso2: "US",
      defaultName: "United States",
    },
  ],
};

// Mock useTelegram composable
vi.mock('../composables/useTelegram', () => ({
  useTelegram: () => ({
    fetchCountryList: vi.fn().mockResolvedValue(mockApiData),
  }),
}));

describe('countryList store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('loadCountryList loads and sets country list state', async () => {
    const store = countryListStore();

    // Initially empty
    expect(store.countryList.phoneCodes).toEqual([]);
    expect(store.countryList.general).toEqual([]);

    await store.loadCountryList();

    // After loading, should match mockApiData
    expect(store.countryList.phoneCodes).toEqual(mockApiData.phoneCodes);
    expect(store.countryList.general).toEqual(mockApiData.general);
  });
});