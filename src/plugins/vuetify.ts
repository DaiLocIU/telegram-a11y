import { createVuetify } from "vuetify";
import { type ThemeDefinition } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import '../assets/vuetify.scss'
import 'vuetify/styles'


export default createVuetify({
  theme: {
    defaultTheme: "myCustomTheme",

    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          primary: "#ff8144",
        },
        variables: {
          'field-border-radius': '0.75rem',
        },
      } as ThemeDefinition,
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
  defaults: {
    VAutocomplete: {
      menuIcon: 'mdi-chevron-down'
    },
    VList: {
      class: 'custom-scroll'
    }
  }
});
