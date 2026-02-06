import { build } from '@vektopay/build-tooling/esbuild'

const entries = ['src/index.ts']

build({
  entries,
  platform: 'node',
})
