import type { Meta, StoryObj } from '@storybook/vue3';
import CountryCodeInput from './CountryCodeInput.vue';

const countryCodeInputMeta = {
    title: 'Components/CountryCodeInput',
    component: CountryCodeInput,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof CountryCodeInput>;

export default countryCodeInputMeta;

export const Default: StoryObj<typeof CountryCodeInput> = {
  render: () => ({
    components: { CountryCodeInput },
    template: '<CountryCodeInput />',
  }),
};