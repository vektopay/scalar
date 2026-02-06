<script setup lang="ts">
import { ScalarIconSparkle } from '@vektopay/icons'

import { useAgentContext } from '@/hooks/use-agent'

const agentContext = useAgentContext()
</script>

<template>
  <button
    class="bg-sidebar-b-search text-sidebar-c-2 hover:text-sidebar-c-1 inline-flex h-8 shrink-0 items-center gap-1.5 rounded border px-2 text-base whitespace-nowrap"
    type="button"
    @click="agentContext?.toggleAgent()">
    <ScalarIconSparkle />
    Ask AI
  </button>
</template>
