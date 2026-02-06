import { URL, fileURLToPath } from 'node:url'

import { createViteBuildOptions } from '@vektopay/build-tooling/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { version } from './package.json'

const entries = [
  'src/index.ts',
  'src/components/index.ts',
  'src/blocks/index.ts',
  'src/hooks/index.ts',
  'src/plugins/index.ts',
  'src/features/index.ts',
  'src/helpers/index.ts',
]

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.SCALAR_API_REFERENCE_VERSION': `"${version}"`,
  },
  server: {
    // Enable host binding in dev containers for proper port forwarding
    // See: https://vite.dev/guide/troubleshooting.html#dev-containers-vs-code-port-forwarding
    ...(process.env.REMOTE_CONTAINERS && { host: '127.0.0.1' }),
    allowedHosts: ['localhost', 'host.docker.internal'],
  },
  resolve: {
    alias: [
      {
        find: '@vektopay/themes/style.css',
        replacement: fileURLToPath(
          new URL('../themes/dist/style.css', import.meta.url),
        ),
      },
      {
        find: '@vektopay/themes/tailwind.css',
        replacement: fileURLToPath(
          new URL('../themes/dist/tailwind.css', import.meta.url),
        ),
      },
      {
        find: '@scalar/themes/style.css',
        replacement: fileURLToPath(
          new URL('../themes/dist/style.css', import.meta.url),
        ),
      },
      {
        find: '@scalar/themes/tailwind.css',
        replacement: fileURLToPath(
          new URL('../themes/dist/tailwind.css', import.meta.url),
        ),
      },
      {
        find: '@vektopay/api-client/style.css',
        replacement: fileURLToPath(
          new URL('../api-client/dist/style.css', import.meta.url),
        ),
      },
      {
        find: '@scalar/api-client/style.css',
        replacement: fileURLToPath(
          new URL('../api-client/dist/style.css', import.meta.url),
        ),
      },
      {
        find: '@vektopay/sidebar/style.css',
        replacement: fileURLToPath(
          new URL('../sidebar/dist/style.css', import.meta.url),
        ),
      },
      {
        find: '@scalar/sidebar/style.css',
        replacement: fileURLToPath(
          new URL('../sidebar/dist/style.css', import.meta.url),
        ),
      },
      {
        find: '@vektopay/components/style.css',
        replacement: fileURLToPath(
          new URL('../components/dist/style.css', import.meta.url),
        ),
      },
      {
        find: '@scalar/components/style.css',
        replacement: fileURLToPath(
          new URL('../components/dist/style.css', import.meta.url),
        ),
      },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@test', replacement: fileURLToPath(new URL('./test', import.meta.url)) },
      { find: /^@scalar\//, replacement: '@vektopay/' },
    ],
    dedupe: ['vue'],
  },
  build: createViteBuildOptions({
    entry: entries,
    options: {
      minify: false,
      emptyOutDir: true,
      cssCodeSplit: false,
      rollupOptions: {
        plugins: [],
      },
    },
  }),
})
