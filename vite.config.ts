import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'
import pugPlugin from "vite-plugin-pug"
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/assets/settings.scss',
      },
    }),
    tailwindcss(),
    pugPlugin()
  ],
})
