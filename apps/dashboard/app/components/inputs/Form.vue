<script setup lang="ts">
const emit = defineEmits<{
  (event: "submit"): void;
}>();
</script>

<template>
  <form @submit.prevent="emit('submit')">
    <slot />
  </form>
</template>
