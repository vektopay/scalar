import { build } from '@vektopay/build-tooling/esbuild'

await build({
  entries: ['./src/index.ts'],
  platform: 'node',
})
