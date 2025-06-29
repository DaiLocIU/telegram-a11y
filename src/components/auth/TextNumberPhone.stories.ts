import {expect, userEvent, fn} from '@storybook/test';
import type {Meta, StoryObj}from '@storybook/vue3';
import TextNumberPhone from './TextNumberPhone.vue';
import {flushPromises} from '@vue/test-utils';

const onUpdateFullNumber = 'onUpdate:fullNumber'

const meta = {
    title: 'Auth/TextNumberPhone',
    component: TextNumberPhone,
    args: {
        value: '',
        [onUpdateFullNumber]: fn()
    },
    render: (args: any) => ({
        components: {
            TextNumberPhone
        },
        setup: () => ({args}),
        template: `<TextNumberPhone v-bind="args" @update:fullNumber="args[onUpdateFullNumber]" />`
    })
} satisfies Meta < typeof TextNumberPhone >;

export default meta;

type Story = StoryObj < typeof meta >;

export const MainFlow : Story = {
    play: async({canvas, step, args} : any) => {
        await step('renders the label correctly', () => {
            const label = canvas.getByLabelText('Your phone number');
            expect(label).toBeDefined();
        })

        await step('clicks the input to focus', async() => {
            const input = canvas.getByRole('textbox');
            console.log('input', input);
            await userEvent.click(input);
            expect(input).toHaveFocus();
        })
        await step('show right value when input', async() => {
            const input = canvas.getByRole('textbox');
            await userEvent.type(input, '+84');
            await flushPromises();
            expect(input.value).toBe('+84');
            expect(args[onUpdateFullNumber]).toHaveBeenCalledTimes(3);
            expect(args[onUpdateFullNumber]).toHaveBeenNthCalledWith(1, '+');
            expect(args[onUpdateFullNumber]).toHaveBeenNthCalledWith(2, '+8');
            expect(args[onUpdateFullNumber]).toHaveBeenLastCalledWith('+84');
        })
    }
};
