<script setup lang="ts">
import { ApiReference } from '@vektopay/api-reference'
import content from '@vektopay/galaxy/latest.yaml?raw'
import { apiReferenceConfigurationWithSourceSchema } from '@vektopay/types/api-reference'
import { reactive } from 'vue'

const configuration = reactive(
  apiReferenceConfigurationWithSourceSchema.parse({
    theme: 'default',
    proxyUrl: import.meta.env.VITE_REQUEST_PROXY_URL,
    isEditable: false,
    layout: 'classic',
    content,
  }),
)
</script>
<template>
  <ApiReference :configuration="configuration" />
</template>
