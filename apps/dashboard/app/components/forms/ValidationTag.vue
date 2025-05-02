<template>
  <div :class="classes" />
</template>

<script setup lang="ts">
const props = defineProps<{
  formId: string;
  errorId: string;
}>();

const classes = computed(() => [
  `__FORM_VALIDATION_TAG_NAME::${props.formId}`,
  `__FORM_VALIDATION_TAG::${props.errorId}`,
]);
</script>
