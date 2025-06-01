<script setup lang="ts">
import type { ClickableProps } from "~/components/misc/Clickable.vue";

const props = defineProps<ClickableProps>();
</script>

<template>
  <Clickable
    v-bind="props"
    class="text-neutral-200 hover:text-neutral-100 active:text-white transition duration-100"
  >
    <slot />
  </Clickable>
</template>
