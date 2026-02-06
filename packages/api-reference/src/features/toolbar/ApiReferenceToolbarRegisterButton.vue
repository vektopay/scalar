<script lang="ts" setup>
import { ScalarButton, useLoadingState } from '@vektopay/components'
import { useToasts } from '@vektopay/use-toasts'
import type { WorkspaceStore } from '@vektopay/workspace-store/client'
import { nextTick } from 'vue'

import { uploadTempDocument } from '@/helpers/upload-temp-document'

const { sdks = [], workspace } = defineProps<{
  workspace: WorkspaceStore
  sdks?: string[]
}>()

const tempDocUrl = defineModel<string>('url')

const { toast } = useToasts()
const loader = useLoadingState()

async function generateSdkArchive(docUrl: string) {
  const response = await fetch(`${docUrl}?sdks=${sdks.join(',')}`)
  if (!response.ok) {
    throw new Error('Failed to generate SDKs')
  }

  const blob = await response.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'sdks.zip'
  link.click()
  URL.revokeObjectURL(link.href)
}

/** Generate and download the SDK archive */
async function generateRegisterLink() {
  if (loader.isLoading || !workspace) {
    return
  }

  loader.start()

  const document = workspace.exportActiveDocument('json')

  if (!document) {
    toast('Unable to export active document', 'error')
    await loader.invalidate()
    return
  }

  try {
    if (!tempDocUrl.value) {
      tempDocUrl.value = await uploadTempDocument(document)
    }

    await loader.validate()
    await generateSdkArchive(tempDocUrl.value)

    await nextTick()

    await loader.clear()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred'
    toast(message, 'error')
    await loader.invalidate()
  }
}
</script>
<template>
  <ScalarButton
    class="h-auto p-2.5"
    :loader
    @click="generateRegisterLink">
    <slot>Generate</slot>
  </ScalarButton>
</template>
