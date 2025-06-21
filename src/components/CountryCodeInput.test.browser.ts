import { ref, nextTick } from "vue";
import { mount, flushPromises } from "@vue/test-utils";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import CountryCodeInput from "./CountryCodeInput.vue";
import { createVuetify } from "vuetify";
import { userEvent, screen } from "../test/index";
import type { VueWrapper } from "@vue/test-utils";

// Mock isoToEmoji utility
vi.mock("../utils/emoji/emoji", () => ({
  isoToEmoji: (iso2: string) => `:${iso2}:`,
}));

// Sample phone codes
const phoneCodes = ref([
  { id: 1, countryCode: "1", iso2: "US", defaultName: "United States" },
  { id: 2, countryCode: "84", iso2: "VN", defaultName: "Vietnam" },
]);

let wrapper: VueWrapper<any>;

const createComponent = () => {
  return mount(CountryCodeInput, {
    global: {
      plugins: [createVuetify()],
    },
    props: {
      phoneCodes: phoneCodes.value,
    },
  });
};

beforeEach(() => {
  wrapper = createComponent();
});
describe("CountryCodeInput", () => {
  test("renders with label", () => {
    const label = wrapper.find("label.v-field-label");

    expect(label.exists()).toBe(true);
    expect(label.text()).toBe("Country");
  });

  test("shows dropdown with country list on input click", async () => {
    const input = wrapper.find("input");
    await userEvent.click(input.element);

    await nextTick();
    await flushPromises();

    const menu = await screen.findByRole("listbox");
    const listItems = menu.querySelectorAll(".v-list-item");

    expect(listItems.length).toBe(2);

    expect(listItems[0].textContent).toContain("United States");
    expect(listItems[0].textContent).toContain("US");

    expect(listItems[1].textContent).toContain("Vietnam");
    expect(listItems[1].textContent).toContain("VN");
  });
  test("selects country and updates input value", async () => {
    const input = wrapper.find("input");
    await userEvent.click(input.element);

    await nextTick();
    await flushPromises();

    const menu = await screen.findByRole("listbox");
    const listItems = menu.querySelectorAll(".v-list-item");

    // Select the first item (United States)
    await userEvent.click(listItems[0]);

    expect(input.element.value).toBe("United States");

    const emittedValue = wrapper.emitted("update:modelValue")?.[0][0];

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(emittedValue).toEqual(phoneCodes.value[0]);

    await nextTick();
    await flushPromises();

    // Check if the dropdown is closed after selection
    const listbox = screen.queryByRole("listbox");
    expect(listbox).toBeNull();
  });

  test("emit a lot of times", async () => {
    const input = wrapper.find("input");
    await userEvent.click(input.element);

    await nextTick();
    await flushPromises();

    const menu = await screen.findByRole("listbox");
    const listItems = menu.querySelectorAll(".v-list-item");

    // Select the first item (United States)
    await userEvent.click(listItems[0]);

    expect(input.element.value).toBe("United States");

    const emittedValue = wrapper.emitted("update:modelValue")?.[0][0];

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(emittedValue).toEqual(phoneCodes.value[0]);

    await userEvent.click(input.element);
    await flushPromises();

    // Get fresh menu and list items again
    const menu2 = await screen.findByRole("listbox");
    const listItems2 = menu2.querySelectorAll(".v-list-item");

    // Select Vietnam
    await userEvent.click(listItems2[1]);
    await flushPromises();

    expect(input.element.value).toBe("Vietnam");
    expect(wrapper.emitted("update:modelValue")?.[1][0]).toEqual(phoneCodes.value[1]);

    // Assert total emits
    expect(wrapper.emitted("update:modelValue")).toHaveLength(2);
  });
});
