import { analyticsFactory } from '@vektopay/analytics-client'

export const analytics = analyticsFactory(
  'https://api.scalar.com',
  () => null, // There is no auth to return.
)
