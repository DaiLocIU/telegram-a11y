export const DEFAULT_THEME = "myCustomTheme";

import {VApp} from 'vuetify/components'

export const withVuetifyTheme = (story, context) => {
  const globalTheme = context.globals.theme || DEFAULT_THEME;
  return {
    components: {story, VApp},
    template: `
      <v-app theme="${globalTheme}">
        <div class="d-flex justify-center align-center" style="padding: 48px">
            <story/>
        </div>
      </v-app>
    `,
  }
}