<template>
  <div>
    <input
      v-model="model"
      type="text"
    >
    <ValidationError
      v-if="props.error"
      :err="props.error"
    />
  </div>
</template>

<script setup lang="ts">
import type { FormError } from "~/composables/forms/formCreator";

const model = defineModel<string>();
const props = defineProps<{
  error?: FormError;
}>();
</script>
