<script setup lang="ts">
import { ApiReference } from '@vektopay/api-reference'
</script>

<template>
  <ApiReference
    :configuration="{
      url: 'https://registry.vektopay.com/@vektopay/apis/galaxy?format=json',
    }" />
</template>
