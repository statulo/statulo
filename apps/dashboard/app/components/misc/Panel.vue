<script setup lang="ts">
const props = defineProps<{
  titled?: boolean;
}>();
</script>

<template>
  <div
    class="bg-neutral-700 border border-neutral-500 rounded-2xl p-5"
  >
    <div v-if="props.titled">
      <slot name="title" />
      <Divider class="mt-4" />
    </div>
    <slot />
  </div>
</template>
