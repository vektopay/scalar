import { build } from '@vektopay/build-tooling/esbuild'

await build({
  platform: 'node',
  entries: ['src/index.ts'],
})
