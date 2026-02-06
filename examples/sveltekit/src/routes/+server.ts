import { ScalarApiReference } from '@vektopay/sveltekit'

import type { RequestHandler } from './$types'

const handler = ScalarApiReference({
  url: 'https://registry.vektopay.com/@vektopay/apis/galaxy?format=json',
})

export const GET: RequestHandler = () => {
  return handler()
}
