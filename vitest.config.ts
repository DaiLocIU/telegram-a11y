
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'
import pugPlugin from "vite-plugin-pug"
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'browser',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          browser: {
              enabled: true,
              instances: [
                { browser: 'chromium' },
              ],
              headless: false,
            },
          include: ['**/*.test.browser.ts']
        }
      },
      {
        extends: true,
        test: {
          environment: 'jsdom',
          name: 'unit',
          setupFiles: ['./vitest.setup.ts'],
          include: ['**/*.test.ts']
        }
      }
    ]
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
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});