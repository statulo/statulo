<script setup lang="ts">
import type { ClickableProps } from "~/components/misc/Clickable.vue";

const props = defineProps<ClickableProps>();
</script>

<template>
  <Clickable
    v-bind="props"
    class="text-neutral-100 border-b font-medium py-[1px] px-0.5 inline border-b-primary-500 hover:border-b-2 transition duration-75"
  >
    <slot />
  </Clickable>
</template>
