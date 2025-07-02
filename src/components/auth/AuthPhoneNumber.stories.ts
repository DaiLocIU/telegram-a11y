import { expect, userEvent, within, fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/vue3';

import AuthPhoneNumber from './AuthPhoneNumber.vue';
import { flushPromises } from '@vue/test-utils';


const meta = {
  title: 'Auth/AuthPhoneNumber',
  component: AuthPhoneNumber,
  args: {
  },
  render: (args: any) => ({
        components: {
            AuthPhoneNumber
        },
        setup: () => ({args}),
        template: `
            <AuthPhoneNumber 
                v-bind="args" 
                @update:modelValue="args[onUpdateModelValue]" 
            />
        `
    })
} satisfies Meta<typeof AuthPhoneNumber>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MainFlow: Story = {}