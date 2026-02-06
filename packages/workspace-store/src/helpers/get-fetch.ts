import { redirectToProxy } from '@vektopay/helpers/url/redirect-to-proxy'
import type { ApiReferenceConfigurationRaw } from '@vektopay/types/api-reference'
import type { UrlDoc } from '@vektopay/workspace-store/client'

/**
 * Get the fetch function from the configuration
 *
 * @param config - The API reference configuration.
 * @returns The fetch function.
 */
export const getFetch = (
  config: Partial<Pick<ApiReferenceConfigurationRaw, 'fetch' | 'proxyUrl'>>,
): NonNullable<UrlDoc['fetch']> => {
  if (config.fetch) {
    return config.fetch
  }

  return ((input, init) => fetch(redirectToProxy(config.proxyUrl, input.toString()), init)) satisfies UrlDoc['fetch']
}
