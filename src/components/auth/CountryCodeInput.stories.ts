import { expect, userEvent, within, fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/vue3';

import CountryCodeInput from './CountryCodeInput.vue';
import { flushPromises } from '@vue/test-utils';

const onUpdateModelValue = 'onUpdate:modelValue';

const meta = {
  title: 'Auth/CountryCodeInput',
  component: CountryCodeInput,
  args: {
    phoneCodes: [
      { id: 1, countryCode: "1", iso2: "US", defaultName: "United States" },
      { id: 2, countryCode: "84", iso2: "VN", defaultName: "Vietnam" },
    ],
    [onUpdateModelValue]: fn(),
  },
  render: (args: any) => ({
        components: {
            CountryCodeInput
        },
        setup: () => ({args}),
        template: `
            <CountryCodeInput 
                v-bind="args" 
                @update:modelValue="args[onUpdateModelValue]" 
            />
        `
    })
} satisfies Meta<typeof CountryCodeInput>;

export default meta;

type Story = StoryObj<typeof meta>;



function getListItems(menu: HTMLElement) {
  console.log('menu', menu);
  return menu.querySelectorAll(".v-list-item");
}

async function openDropdown(canvas: ReturnType<typeof within>) {
  const input = canvas.getByRole('textbox');
  await userEvent.click(input);
  await flushPromises();
}

export const MainFlow: Story = {
    play: async ({ canvasElement, canvas, step, args }: any) => {
        await step('renders the label correctly', () => {
            const label = canvas.getByLabelText('Country');
            expect(label).toBeDefined();
        })
        await step('does not show a selection when no default value is provided', () => {
            const selectionText = canvasElement.querySelector(".v-autocomplete__selection-text");
            console.log('selectionText', selectionText);
            expect(selectionText).toBeNull();
        });

        await step('clicks the input to open the dropdown', async () => {
            await openDropdown(canvas);
            const listbox = document.querySelector('[role="listbox"]');
            const items = getListItems(listbox as HTMLElement);
            expect(items.length).toBe(2);            
        });
        
        await step('selects the first country from the dropdown', async () => {
            await openDropdown(canvas);

            const listbox = document.querySelector('[role="listbox"]');
            const items = getListItems(listbox as HTMLElement);
            await userEvent.click(items[0]);
            await flushPromises();

            expect(canvas.getByRole('textbox').value).toBe("United States");

            expect(args[onUpdateModelValue]).toHaveBeenCalledTimes(1);
            expect(args[onUpdateModelValue]).toHaveBeenCalledWith({ id: 1, countryCode: "1", iso2: "US", defaultName: "United States" });
            
            step('checks that the dropdown is closed after selection', () => {
                expect(document.querySelector('[role="listbox"]')).toBeNull();
            });            
        });

        await step('click the input', async () => {
            await openDropdown(canvas);
        })

        await step('chooses a different country', async () => {
            await   openDropdown(canvas);
            const listbox = document.querySelector('[role="listbox"]');
            const items = getListItems(listbox as HTMLElement);
            await userEvent.click(items[1]);
            
            await flushPromises();
            
            expect(canvas.getByRole('textbox').value).toBe("Vietnam");
            expect(args[onUpdateModelValue]).toHaveBeenCalledTimes(2);
            expect(args[onUpdateModelValue]).toHaveBeenNthCalledWith(2, { id: 2, countryCode: "84", iso2: "VN", defaultName: "Vietnam" });

            step('checks that the dropdown is closed after selection', () => {
                expect(document.querySelector('[role="listbox"]')).toBeNull();
            });
        })
    },
};


export const DefaultValue: Story = {
  args: {
    modelValue: { id: 1, countryCode: "1", iso2: "US", defaultName: "United States" },

  },
  play: async ({step, canvas, canvasElement, args}: any) => {
    await step('show a selection when default value is provided', () => {
        const selectionText = canvasElement.querySelector(".v-autocomplete__selection-text");
        expect(selectionText).not.toBeNull();
        expect(selectionText?.textContent).toBe("United States");
    });

    await step('click the input', async () => {
            await openDropdown(canvas);
    })

    await step('chooses a different country', async () => {
        await  openDropdown(canvas);
        const listbox = document.querySelector('[role="listbox"]');
        const items = getListItems(listbox as HTMLElement);
        await userEvent.click(items[1]);
        
        await flushPromises();
        
        expect(canvas.getByRole('textbox').value).toBe("Vietnam");

        expect(args[onUpdateModelValue]).toHaveBeenCalledTimes(1);
        expect(args[onUpdateModelValue]).toHaveBeenNthCalledWith(1, { id: 2, countryCode: "84", iso2: "VN", defaultName: "Vietnam" });

        step('checks that the dropdown is closed after selection', () => {
            expect(document.querySelector('[role="listbox"]')).toBeNull();
        });
    })
    // const canvas = within(canvasElement);
    // console.log('canvasElement', canvasElement);
    // const loginButton = canvas.getByRole('button', { name: /Log in/i });
    // await expect(loginButton).toBeInTheDocument();
    // await userEvent.click(loginButton);
    // await expect(loginButton).not.toBeInTheDocument();

    // const logoutButton = canvas.getByRole('button', { name: /Log out/i });
    // await expect(logoutButton).toBeInTheDocument();
  },
};

// export const LoggedOut: Story = {};