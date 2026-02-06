<script setup lang="ts">
import { Chat } from '@vektopay/agent-chat'
import type { ApiReferenceConfigurationWithSource } from '@vektopay/types/api-reference'
import type { WorkspaceStore } from '@vektopay/workspace-store/client'
import { computed, type Ref } from 'vue'

import { API_BASE_URL, DASHBOARD_URL, REGISTRY_URL } from '@/consts/urls'

const props = defineProps<{
  agentScalarConfiguration: ApiReferenceConfigurationWithSource['agent']
  workspaceStore: WorkspaceStore
  prefilledMessage?: Ref<string>
}>()

const agentMode = computed(() =>
  props.agentScalarConfiguration?.key ? 'full' : 'preview',
)

const registryDocuments = computed((): { namespace: string; slug: string }[] => [])

const getActiveDocumentJson = () =>
  props.workspaceStore.exportActiveDocument('json') ?? ''

const getAgentKey = props.agentScalarConfiguration?.key
  ? () => props.agentScalarConfiguration?.key as string
  : undefined
</script>

<template>
  <Chat
    :baseUrl="API_BASE_URL"
    :dashboardUrl="DASHBOARD_URL"
    :getActiveDocumentJson
    :getAgentKey
    :mode="agentMode"
    :prefilledMessage
    :registryDocuments="registryDocuments"
    :registryUrl="REGISTRY_URL" />
</template>
