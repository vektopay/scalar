<script setup lang="ts">
import {
  AuthSelector,
  mergeSecurity,
} from '@vektopay/api-client/v2/blocks/scalar-auth-selector-block'
import {
  getSecurityRequirements,
  getSelectedSecurity,
} from '@vektopay/api-client/v2/features/operation'
import type { ApiReferenceConfigurationRaw } from '@vektopay/types/api-reference'
import type { AuthStore } from '@vektopay/workspace-store/entities/auth'
import type { WorkspaceEventBus } from '@vektopay/workspace-store/events'
import type { XScalarEnvironment } from '@vektopay/workspace-store/schemas/extensions/document/x-scalar-environments'
import type { ServerObject } from '@vektopay/workspace-store/schemas/v3.1/strict/openapi-document'
import type { WorkspaceDocument } from '@vektopay/workspace-store/schemas/workspace'
import { useFocusWithin } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'

import { useState } from '@/state/state'

const { document, name, environment, eventBus, options, authStore } =
  defineProps<{
    options: Pick<
      ApiReferenceConfigurationRaw,
      'authentication' | 'persistAuth' | 'proxyUrl'
    >
    name: string
    authStore: AuthStore
    document: WorkspaceDocument | undefined
    eventBus: WorkspaceEventBus
    selectedServer: ServerObject | null
    environment: XScalarEnvironment
  }>()

const { workspaceStore } = useState()

/** Compute what the security requirements should be for the document */
const securityRequirements = computed(() =>
  getSecurityRequirements(document?.security),
)

/** The selected security keys for the document */
const selectedSecurity = computed(() =>
  getSelectedSecurity(
    authStore.getAuthSelectedSchemas({
      type: 'document',
      documentName: name,
    }),
    undefined,
    securityRequirements.value,
  ),
)

const focusRef = shallowRef()
const { focused } = useFocusWithin(focusRef)

/** Merge the security schemes with the authentication config and the auth store */
const securitySchemes = computed(() =>
  mergeSecurity(
    document?.components?.securitySchemes ?? {},
    options.authentication?.securitySchemes,
    authStore,
    name,
  ),
)

watch(focused, (isFocused) => {
  if (!isFocused) {
    return
  }

  workspaceStore.update('x-scalar-active-document', name)
})
</script>
<template>
  <div
    ref="focusRef"
    tabindex="0">
    <AuthSelector
      v-if="Object.keys(securitySchemes).length"
      :authStore
      :documentSlug="name"
      :environment
      :eventBus
      isReadOnly
      isStatic
      layout="reference"
      :meta="{ type: 'document' }"
      :persistAuth="options.persistAuth"
      :proxyUrl="options.proxyUrl ?? ''"
      :securityRequirements
      :securitySchemes
      :selectedSecurity
      :server="selectedServer"
      title="Authentication" />
  </div>
</template>
