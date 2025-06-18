import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'
import pugPlugin from "vite-plugin-pug"

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      'node_modules',
      'dist',
      '**/public/telegram.js',
      'public/telegram.js',
      '**/script.js',
      '**/script.*.js',
      '**/*.d.ts',
      '**/coverage/**',
      '**/.storybook/**',
    ],
    pool: "vmThreads",
    css: false,
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