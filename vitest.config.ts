
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'
import pugPlugin from "vite-plugin-pug"

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    browser: {
        enabled: true,
        instances: [
          { browser: 'chromium' },
        ],
        headless: false,
      },
    include: ['**/*.test.browser.ts', '**/*.test.ts']
  },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    tailwindcss(),
    pugPlugin()
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});