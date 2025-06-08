<script setup lang="ts">
import type { FormError } from "~/composables/forms/formCreator";

const model = defineModel<string>();
const props = defineProps<{
  error?: FormError;
  type?: "password" | "email" | "text";
  placeholder?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <div>
    <input
      v-bind="$attrs"
      v-model="model"
      :disabled="props.disabled"
      :class="[
        'transition duration-75 rounded-lg text-base py-2 w-full px-5 focus:outline-none',
        'bg-neutral-950 border border-neutral-600 placeholder:text-neutral-200 ',
        'focus:border-primary-500',
        props.disabled ? '' : 'hover:border-neutral-300',
        props.disabled ? 'text-neutral-200' : 'text-white'
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
