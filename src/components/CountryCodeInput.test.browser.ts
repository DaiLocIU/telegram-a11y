import { ref, nextTick } from "vue";
import { mount, flushPromises } from "@vue/test-utils";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import CountryCodeInput from "./CountryCodeInput.vue";
import { createVuetify } from "vuetify";
import { userEvent, screen } from "../test/index";
import { waitFor } from "@testing-library/vue";
import type { VueWrapper } from "@vue/test-utils";


// Mock isoToEmoji utility
vi.mock("../utils/emoji/emoji", () => ({
  isoToEmoji: (iso2: string) => `:${iso2}:`,
}));

const phoneCodes = ref([
  { id: 1, countryCode: "1", iso2: "US", defaultName: "United States" },
  { id: 2, countryCode: "84", iso2: "VN", defaultName: "Vietnam" },
]);

let wrapper: VueWrapper<any>;

function setupComponent(props: Record<string, any> = {}) {
  return mount(CountryCodeInput, {
    global: { plugins: [createVuetify()] },
    props: { phoneCodes: phoneCodes.value, ...props },
  });
}

async function openDropdown(wrapper: VueWrapper<any>) {
  const input = wrapper.find("input");
  await userEvent.click(input.element);
  await flushPromises();
  return screen.findByRole("listbox");
}

function getListItems(menu: HTMLElement) {
  return menu.querySelectorAll(".v-list-item");
}

describe("CountryCodeInput", () => {
  beforeEach(() => {
    wrapper = setupComponent()
  })
  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  test("renders the label correctly", () => {
    const label = wrapper.find("label.v-field-label");
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe("Country");
  });

  test("does not show a selection when no default value is provided", () => {
    const selectionText = wrapper.find(".v-autocomplete__selection-text");
    expect(selectionText.exists()).toBe(false);
  });

  test("shows the selected country when a default value is provided", () => {
    wrapper = setupComponent({
      modelValue: phoneCodes.value[0],
    });
    const selectionText = wrapper.find(".v-autocomplete__selection-text");
    expect(selectionText.exists()).toBe(true);
    expect(selectionText.text()).toBe("United States");
  });

  test("displays country list dropdown when input is clicked", async () => {
    const menu = await openDropdown(wrapper);
    const listItems = getListItems(menu);

    expect(listItems.length).toBe(2);

    expect(listItems[0].textContent).toContain("United States");
    expect(listItems[0].textContent).toContain(":US:");
    expect(listItems[0].textContent).toContain("+1");

    expect(listItems[1].textContent).toContain("Vietnam");
    expect(listItems[1].textContent).toContain(":VN:");
    expect(listItems[1].textContent).toContain("+84");
  });

  test("emits update:modelValue and updates input when a country is selected", async () => {
    const menu = await openDropdown(wrapper);
    const listItems = getListItems(menu);

    await userEvent.click(listItems[0]);

    await nextTick();
    flushPromises();

    expect(wrapper.find("input").element.value).toBe("United States");
    expect(wrapper.emitted("update:modelValue")?.[0][0]).toEqual(phoneCodes.value[0]);

    
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull()
    });
  });

  test("emits update:modelValue multiple times when selecting different countries", async () => {

    // Select first country
    let menu = await openDropdown(wrapper);
    let listItems = getListItems(menu);
    await userEvent.click(listItems[0]);
    await nextTick();

    expect(wrapper.find("input").element.value).toBe("United States");
    expect(wrapper.emitted("update:modelValue")?.[0][0]).toEqual(phoneCodes.value[0]);

    // Select second country
    menu = await openDropdown(wrapper);
    listItems = getListItems(menu);
    await userEvent.click(listItems[1]);
    await nextTick();

    expect(wrapper.find("input").element.value).toBe("Vietnam");
    expect(wrapper.emitted("update:modelValue")?.[1][0]).toEqual(phoneCodes.value[1]);
    expect(wrapper.emitted("update:modelValue")).toHaveLength(2);
  });
});
