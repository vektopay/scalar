<script setup lang="ts">
import { ScalarMarkdown } from '@vektopay/components'
import type { WorkspaceEventBus } from '@vektopay/workspace-store/events'
import type { TraversedTag } from '@vektopay/workspace-store/schemas/navigation'

import { Anchor } from '@/components/Anchor'
import {
  SectionContainerAccordion,
  SectionHeader,
  SectionHeaderTag,
} from '@/components/Section'

const { tag, isCollapsed } = defineProps<{
  tag: TraversedTag
  isCollapsed: boolean
  eventBus: WorkspaceEventBus | null
}>()
</script>

<template>
  <SectionContainerAccordion
    :aria-label="tag.title"
    class="tag-section"
    :modelValue="!isCollapsed"
    @update:modelValue="
      (value) => eventBus?.emit('toggle:nav-item', { id: tag.id, open: value })
    ">
    <template #title>
      <SectionHeader class="tag-name">
        <Anchor
          @copyAnchorUrl="
            () => eventBus?.emit('copy-url:nav-item', { id: tag.id })
          ">
          <SectionHeaderTag :level="2">
            {{ tag.title }}
          </SectionHeaderTag>
        </Anchor>
      </SectionHeader>
      <ScalarMarkdown
        class="tag-description"
        :value="tag?.description"
        withImages />
    </template>
    <slot />
  </SectionContainerAccordion>
</template>

<style scoped>
.tag-section {
  margin-bottom: 48px;
}
.tag-name {
  text-transform: capitalize;
}
.tag-description {
  padding-bottom: 4px;
  text-align: left;
}
</style>
