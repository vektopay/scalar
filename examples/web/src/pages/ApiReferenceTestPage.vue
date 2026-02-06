<script setup lang="ts">
import { ApiReference } from '@vektopay/api-reference'
import content from '@vektopay/galaxy/latest.yaml?raw'
import { apiReferenceConfigurationWithSourceSchema } from '@vektopay/types/api-reference'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const configuration = reactive(
  apiReferenceConfigurationWithSourceSchema.parse({
    theme: `${route.params['theme']}`,
    isEditable: false,
    layout: `${route.params['layout']}`,
    darkMode: !!route.query['darkMode'],
    content,
  }),
)
</script>
<template>
  <ApiReference :configuration="configuration" />
</template>
