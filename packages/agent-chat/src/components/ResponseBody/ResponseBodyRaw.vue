<script lang="ts" setup>
import { ScalarCodeBlock } from '@vektopay/components'

const props = defineProps<{
  content: any
  language: string
}>()
</script>

<template>
  <ScalarCodeBlock
    class="codeBlock"
    :content="props.content"
    :lang="language" />
</template>
