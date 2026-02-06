import { build } from '@vektopay/build-tooling/esbuild'

build({
  entries: ['src/index.ts'],
  platform: 'shared',
})
