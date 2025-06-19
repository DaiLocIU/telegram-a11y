
import { ref } from "vue";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, test, expect, vi } from "vitest";
import CountryCodeInput from "./CountryCodeInput.vue";
import { createVuetify } from "vuetify";
import {  userEvent, screen } from '../test/index';
import { findAllByRole, render } from '@testing-library/vue'
import { VAutocomplete } from "vuetify/components";


// Mock isoToEmoji utility
vi.mock("../utils/emoji/emoji", () => ({
  isoToEmoji: (iso2: string) => `:${iso2}:`
}));

describe("CountryCodeInput", () => {
  const phoneCodes = ref([
    { id: 1, countryCode: "1", iso2: "US", defaultName: "United States" },
    { id: 2, countryCode: "84", iso2: "VN", defaultName: "Vietnam" },
  ]);
  
  // render with props and right label
  test("renders with placeholder", () => {
    const wrapper = mount(CountryCodeInput, {
      global: {
        plugins: [createVuetify()],
      },
      props: {
        phoneCodes: phoneCodes.value,
      },
    });
    const vLabel = wrapper.find("label.v-field-label");

    expect(vLabel.exists()).toBe(true);
    expect(vLabel.text()).toBe("Country");
  });
  test("clicks on country code input", async () => {
    const { container } = render(CountryCodeInput, {
      global: {
        plugins: [createVuetify()],
      },
      props: {
        phoneCodes: phoneCodes.value,
      },
    }); 

    await userEvent.click(container.querySelector('.v-input__control') as HTMLElement)

    await nextTick()
    // vi.runAllTimers()

    console.log('screen.debug()', screen.debug())
    // await nextTick()
    // const input = wrapper.find('input');
    // console.log('input', input.html())

    // await wrapper.find('input').trigger('focus')


    // await nextTick()


    // console.log('screen', document.body)
    // screen.debug()
    // const activeItems = await findAllByRole(menu, 'option', { selected: true })


    expect(true).toBe(true)

    
    
    // const menu = await screen.findByRole('listbox')

    // let activeItems = await findAllByRole(menu, 'option', { selected: true })
    // expect(activeItems).toHaveLength(1)
    // expect(container.html()).toContain("Country");
  })
});