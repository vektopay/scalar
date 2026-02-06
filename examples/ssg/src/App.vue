<script setup lang="ts">
import { ApiReference } from '@vektopay/api-reference'

import '@vektopay/api-reference/style.css'
</script>

<template>
  <div>
    <ApiReference
      :configuration="{
        url: 'https://registry.vektopay.com/@vektopay/apis/galaxy?format=json',
      }" />
  </div>
</template>
