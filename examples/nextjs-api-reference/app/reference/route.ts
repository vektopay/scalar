import { ApiReference } from '@vektopay/nextjs-api-reference'

const config = {
  url: 'https://registry.vektopay.com/@vektopay/apis/galaxy?format=json',
}

export const GET = ApiReference(config)
