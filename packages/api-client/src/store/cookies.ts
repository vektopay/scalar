import { LS_KEYS } from '@vektopay/helpers/object/local-storage'
import type { Cookie } from '@vektopay/oas-utils/entities/cookie'
import { mutationFactory } from '@vektopay/object-utils/mutator-record'
import { reactive } from 'vue'

/** Create cookie mutators for the workspace */
export function createStoreCookies(useLocalStorage: boolean) {
  const cookies = reactive<Record<string, Cookie>>({})

  const cookieMutators = mutationFactory(cookies, reactive({}), useLocalStorage && LS_KEYS.COOKIE)

  return {
    cookies,
    cookieMutators,
  }
}
