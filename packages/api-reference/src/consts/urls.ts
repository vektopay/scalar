const env = (key: string, fallback: string) =>
  (import.meta as { env?: Record<string, string | undefined> }).env?.[key] ??
  fallback

/** Registry base url */
export const REGISTRY_URL = env(
  'VITE_VEKTOPAY_REGISTRY_URL',
  'https://registry.vektopay.com',
)

/** Registry URL where shared documents can be accessed */
export const REGISTRY_SHARE_URL = `${REGISTRY_URL}/share`

/** Core API base URL */
export const API_BASE_URL = env(
  'VITE_VEKTOPAY_API_BASE_URL',
  'https://api.vektopay.com',
)

/** Dashboard URL for agent upsell/info links */
export const DASHBOARD_URL = env(
  'VITE_VEKTOPAY_DASHBOARD_URL',
  'https://dashboard.vektopay.com',
)

/** Share upload API URL */
export const UPLOAD_TEMP_API_URL = `${API_BASE_URL}/core/share/upload/apis`

/** Proxy service */
export const PROXY_URL = env(
  'VITE_VEKTOPAY_PROXY_URL',
  'https://proxy.vektopay.com',
)
