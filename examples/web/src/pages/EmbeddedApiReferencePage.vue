<script setup lang="ts">
import { ApiReference } from '@vektopay/api-reference'
import content from '@vektopay/galaxy/latest.yaml?raw'
import { apiReferenceConfigurationWithSourceSchema } from '@vektopay/types/api-reference'
import { reactive } from 'vue'

import SlotPlaceholder from '../components/SlotPlaceholder.vue'

const configuration = reactive(
  apiReferenceConfigurationWithSourceSchema.parse({
    proxyUrl: import.meta.env.VITE_REQUEST_PROXY_URL,
    isEditable: false,
    content,
  }),
)
</script>
<template>
  <div class="main">
    <h1>This is my super duper web application</h1>
    <div class="container">
      <ApiReference :configuration="configuration">
        <template #footer><SlotPlaceholder>footer</SlotPlaceholder></template>
      </ApiReference>
    </div>
  </div>
</template>
<style scoped>
.main {
  display: flex;
  flex-direction: column;

  font-family: sans-serif;
  box-sizing: border-box;

  padding: 2rem;
  width: 100vw;
  height: 100vh;
}
.container {
  flex: 1;
  overflow: auto;
  border: 1px solid #000;
  border-radius: 3px;
}
</style>
