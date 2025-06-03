<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
</script>

<template>
  <label class="block">
    <span class="font-semibold text-neutral-100 leading-tight text-sm mb-1.5 block">{{ props.text }}</span>
    <slot />
  </label>
</template>
