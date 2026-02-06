import { computed, onBeforeUnmount, ref, toValue, type MaybeRefOrGetter } from 'vue'

export const useScrollLock = (element: MaybeRefOrGetter<HTMLElement | null | undefined>) => {
  const initialValue = ref('')
  const isLocked = ref(false)

  const lock = () => {
    const el = toValue(element)

    if (!el) {
      return
    }

    initialValue.value = el.style.overflow
    el.style.overflow = 'hidden'
  }

  const unlock = () => {
    const el = toValue(element)

    if (!el) {
      return
    }

    if (initialValue.value !== '') {
      el.style.overflow = initialValue.value
    } else {
      el.style.removeProperty('overflow')
    }
  }

  const state = computed({
    get: () => isLocked.value,
    set: (value: boolean) => {
      isLocked.value = value
      value ? lock() : unlock()
    },
  })

  onBeforeUnmount(() => {
    if (isLocked.value) {
      unlock()
    }
  })

  return state
}
