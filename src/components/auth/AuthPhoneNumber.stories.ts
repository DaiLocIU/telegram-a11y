import { expect, userEvent, within, fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/vue3';
import AuthPhoneNumber from './AuthPhoneNumber.vue';
import { flushPromises } from '@vue/test-utils';

const meta = {
  title: 'Auth/AuthPhoneNumber',
  component: AuthPhoneNumber,
  args: {
    phoneCodes: [
      { countryCode: "1", iso2: "US", defaultName: "United States", patterns: ['XXX XXX XXXX'] },
      { countryCode: "84", iso2: "VN", defaultName: "Vietnam", patterns: undefined },
    ],
  },
  render: (args: any) => ({
    components: { AuthPhoneNumber },
    setup: () => ({ args }),
    template: `<AuthPhoneNumber v-bind="args" />`
  })
} satisfies Meta<typeof AuthPhoneNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Helper functions ---
async function getCountryInput(canvasEl: ReturnType<typeof within>) {
  return await canvasEl.getByLabelText(/country/i);
}
async function getPhoneInput(canvasEl: ReturnType<typeof within>) {
  return await canvasEl.getByLabelText(/your phone number/i);
}
function getListItems() {
  const listbox = document.querySelector('[role="listbox"]');
  return listbox ? listbox.querySelectorAll('.v-list-item') : [];
}

function backSpaceAllInput(count: number) {
  return Array.from({ length: count }, () => '{backspace}').join('');
}

export const MainFlow: Story = {
  play: async ({
    canvasElement,
    step,
  }: any) => {
    const canvasEl = within(canvasElement);

    await step('renders both inputs with correct labels', async () => {
      expect(await getCountryInput(canvasEl)).toBeInTheDocument();
      expect(await getPhoneInput(canvasEl)).toBeInTheDocument();
    });

    await step('shows country dropdown on country input click', async () => {
      const countryInput = await getCountryInput(canvasEl);
      await userEvent.click(countryInput);
      await flushPromises();
      expect(countryInput).toHaveFocus();
      expect(getListItems().length).toBe(2);
    });

    await step('selects a country and autofills phone input', async () => {
      const countryInput = await getCountryInput(canvasEl);
      await userEvent.click(countryInput);
      await flushPromises();
      const items = getListItems();
      await userEvent.click(items[0]);
      await flushPromises();
      console.log('countryInput', countryInput);
      expect(countryInput.value).toBe('United States');
      const phoneInput = await getPhoneInput(canvasEl);
      expect(phoneInput).toHaveFocus();
      expect(phoneInput.value).toBe('+1 ');
    });
    

    await step('clears phone input and country resets', async () => {
      const countryInput = await getCountryInput(canvasEl);
      const phoneInput = await getPhoneInput(canvasEl);
      await userEvent.type(phoneInput, '{backspace}{backspace}{backspace}{backspace}');
      await flushPromises();
      expect(countryInput.value).toBe('');
      expect(phoneInput.value).toBe('');
      const selectionText = canvasElement.querySelector(".v-autocomplete__selection-text");
      console.log('selectionText', selectionText);
      expect(selectionText).toBeNull();
    });

    await step('types new country code and country autofills', async () => {
      const countryInput = await getCountryInput(canvasEl);
      const phoneInput = await getPhoneInput(canvasEl);
      await userEvent.type(phoneInput, '+84');
      await flushPromises();
      expect(phoneInput.value).toBe('+84 ');
      console.log('countryInput', countryInput);
      expect(countryInput.value).toBe('Vietnam');
    });

    
    await step('removes country code digits and resets country selection', async () => {  
        const countryInput = await getCountryInput(canvasEl);
        const phoneInput = await getPhoneInput(canvasEl);
        await userEvent.type(phoneInput, '{backspace}{backspace}');
        await flushPromises();
        expect(phoneInput.value).toBe('+8');
        expect(countryInput.value).toBe('');
    })

    await step('type country code and auto fills country selection', async () => {
      const countryInput = await getCountryInput(canvasEl);
      const phoneInput = await getPhoneInput(canvasEl);
      await userEvent.type(phoneInput, '4');
      await flushPromises();
      expect(phoneInput.value).toBe('+84 ');
      expect(countryInput.value).toBe('Vietnam');
    })

    await step('types Vietnam phone number and applies default pattern', async () => {
      const phoneInput = await getPhoneInput(canvasEl);
      await userEvent.type(phoneInput, '123456789');
      await flushPromises();
      expect(phoneInput.value).toBe('+84 123 456 789');
    })

    await step('clears phone input and type USA phone number and applies USA pattern', async () => {
      const phoneInput = await getPhoneInput(canvasEl);
      await userEvent.type(phoneInput, backSpaceAllInput(phoneInput.value.length));

      await userEvent.type(phoneInput, '+1 1234567890');
      await flushPromises();
      expect(phoneInput.value).toBe('+1 123 456 7890');
    });
  }
};