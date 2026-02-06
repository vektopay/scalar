import { ref } from 'vue'

import { API_BASE_URL } from '@/consts/urls'

const env = (key: string, fallback?: string) =>
  (import.meta as { env?: Record<string, string | undefined> }).env?.[key] ?? fallback

const AUTH_REQUIRED = env('VITE_VEKTOPAY_AUTH_REQUIRED', 'false') === 'true'
const AUTH_CHECK_URL =
  env('VITE_VEKTOPAY_AUTH_CHECK_URL') ?? `${API_BASE_URL}/auth/session`
const AUTH_LOGIN_URL = env('VITE_VEKTOPAY_AUTH_LOGIN_URL') ?? ''
const REFRESH_INTERVAL_MS = Number(
  env('VITE_VEKTOPAY_AUTH_REFRESH_MS', '30000'),
)

export function useAuthGate() {
  const isAuthenticated = ref(!AUTH_REQUIRED)
  const isLoading = ref(AUTH_REQUIRED)
  const error = ref<string | null>(null)
  let inFlight: Promise<void> | null = null
  let lastCheckedAt = 0

  async function refresh() {
    if (!AUTH_REQUIRED) {
      isAuthenticated.value = true
      isLoading.value = false
      return
    }

    const now = Date.now()
    if (inFlight || (REFRESH_INTERVAL_MS > 0 && now - lastCheckedAt < REFRESH_INTERVAL_MS)) {
      return
    }

    lastCheckedAt = now

    isLoading.value = true
    error.value = null

    try {
      inFlight = (async () => {
        const response = await fetch(AUTH_CHECK_URL, {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          isAuthenticated.value = false
          return
        }

        const data = (await response.json().catch(() => ({}))) as {
          authenticated?: boolean
        }
        isAuthenticated.value = data.authenticated ?? true
      })()
      await inFlight
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to verify auth'
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
      inFlight = null
    }
  }

  return {
    isAuthenticated,
    isLoading,
    error,
    loginUrl: AUTH_LOGIN_URL,
    refresh,
  }
}
