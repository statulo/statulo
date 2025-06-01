<script setup lang="ts">
import type { FormError } from "~/composables/forms/formCreator";

const model = defineModel<string>();
const props = defineProps<{
  error?: FormError;
  type?: "password" | "email" | "text";
  placeholder?: string;
}>();
</script>

<template>
  <div>
    <input
      v-model="model"
      :class="[
        'transition duration-75 rounded-lg text-base py-2 w-full px-5 focus:outline-none',
        'bg-neutral-950 border border-neutral-600 placeholder:text-neutral-200 text-white',
        'focus:border-primary-500',
        'hover:border-neutral-300'
      ]"
      :placeholder="props.placeholder"
      :type="props.type ?? 'text'"
    >
    <ValidationError
      v-if="props.error"
      :err="props.error"
    />
  </div>
</template>
