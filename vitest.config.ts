import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'
import pugPlugin from "vite-plugin-pug"

export default defineConfig({
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
  test: {
    projects: [
      {
        test: {
          environment: 'jsdom',
          // an example of file based convention,
          // you don't have to follow it
          setupFiles: ['./vitest.setup.ts'],
          include: ['**/*.test.ts', '**/*.test.tsx'],
          name: 'unit',
          css: false,
        },
      },
      {
        test: {
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['**/*.test.browser.ts', '**/*.test.browser.tsx'],
          name: 'browser',
          browser: {
            enabled: true,
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  }
})