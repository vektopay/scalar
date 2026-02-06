<script lang="ts" setup>
import { ScalarFormSection, ScalarTextInput } from '@vektopay/components'
import type { WorkspaceStore } from '@vektopay/workspace-store/client'

import ApiReferenceToolbarBlurb from '@/features/toolbar/ApiReferenceToolbarBlurb.vue'
import ApiReferenceToolbarRegisterButton from '@/features/toolbar/ApiReferenceToolbarRegisterButton.vue'

const { workspace } = defineProps<{
  workspace: WorkspaceStore
}>()

const tempDocUrl = defineModel<string>('url')
</script>
<template>
  <ScalarFormSection>
    <template #label>Generate SDKs</template>
    <ScalarTextInput
      :modelValue="tempDocUrl"
      placeholder="SDKs are generated from your shared spec"
      readonly />
    <ApiReferenceToolbarRegisterButton
      v-model:url="tempDocUrl"
      :workspace="workspace">
      Generate SDKs
    </ApiReferenceToolbarRegisterButton>
    <ApiReferenceToolbarBlurb>
      SDKs are generated on-demand from your active document.
    </ApiReferenceToolbarBlurb>
  </ScalarFormSection>
</template>
