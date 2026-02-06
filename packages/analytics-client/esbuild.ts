import { build } from '@vektopay/build-tooling/esbuild'

await build({
  platform: 'shared',
  entries: ['./src/index.ts'],
})
