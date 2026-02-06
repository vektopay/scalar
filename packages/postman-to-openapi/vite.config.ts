import { alias } from '@vektopay/build-tooling/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  resolve: {
    alias: alias(import.meta.url),
  },
})
