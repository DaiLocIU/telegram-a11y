import { mount } from "@vue/test-utils";
import { describe, test, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";

import CountryCodeInput from "./CountryCodeInput.vue";
import { createVuetify } from "vuetify";

describe("CountryCodeInput", () => {
  test("renders with default value", () => {
    const wrapper = mount(CountryCodeInput, {
      global: {
        plugins: [
          createVuetify(),
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              countryList: {
                phoneCodes: [
                  { countryCode: "1", iso2: "US", defaultName: "United States" },
                ],
              },
            },
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain("Hello, Vue!");
  });
});
