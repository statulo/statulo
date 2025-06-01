<script setup lang="ts">
const emit = defineEmits<{
  (_event: "submit"): void;
}>();
</script>

<template>
  <form @submit.prevent="emit('submit')">
    <slot />
  </form>
</template>
