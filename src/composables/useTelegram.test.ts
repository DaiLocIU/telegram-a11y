import { describe, test, expect, vi, beforeEach } from "vitest";
import { useTelegram } from "./useTelegram";
import type { ApiCountry, ApiCountryCode } from "../api/types";

interface CountryListState {
  phoneCodes: ApiCountryCode[];
  general: ApiCountry[];
}

const mockData: CountryListState = {
  phoneCodes: [
    {
      name: "United States",
      countryCode: "1",
      iso2: "US",
      defaultName: "United States",
    },
  ],
  general: [{ iso2: "US", defaultName: "United States" }],
};

// Mock buildApiCountryList
vi.mock("../api/gramjs/apiBuilders", () => ({
  buildApiCountryList: vi.fn(
    (): CountryListState => {
      return mockData;
    }
  ),
}));

let mockInvoke: any;
let Api: any;
let fetchCountryList: any;
let initClient: any;

beforeEach(async () => {
  Api = {
    help: {
      GetCountriesList: vi.fn().mockImplementation(({ langCode }) => ({ langCode })),
      CountriesList: function (data: any) {
        Object.assign(this, data);
      },
    },
  };
  mockInvoke = vi.fn();

  (window as any).telegram = {
    Api,
    TelegramClient: vi.fn().mockImplementation(() => ({
      start: vi.fn(),
      session: { save: vi.fn(() => "session") },
      invoke: mockInvoke,
    })),
    sessions: { StringSession: vi.fn() },
  };

  ({ initClient, fetchCountryList } = useTelegram());
  await initClient();
});

test("fetchCountryList returns built country list when response is CountriesList", async () => {
  const countriesList = new Api.help.CountriesList({});

  mockInvoke.mockResolvedValueOnce(countriesList); // for check ínstanceof Api.help.CountriesList
  // Act
  const result = await fetchCountryList({ langCode: "en" });
  // Assert
  expect(result).toEqual(mockData);
});

test("fetchCountryList returns undefined if not CountriesList", async () => {
  mockInvoke.mockResolvedValueOnce();

  const result = await fetchCountryList({ langCode: "en" });
  expect(result).toBeUndefined();
});
