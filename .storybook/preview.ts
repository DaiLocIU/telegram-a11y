import { setup } from "@storybook/vue3";
import type { Preview } from '@storybook/vue3'
import { registerPlugins } from "../src/plugins";
import { withVuetifyTheme, DEFAULT_THEME } from "./withVuetifyTheme.decorator";
import '../src/style.css';

setup((app) => {
  // Registers your app's plugins into Storybook
  registerPlugins(app);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
export const decorators = [withVuetifyTheme];