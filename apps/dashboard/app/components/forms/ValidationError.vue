<template>
  <div>
    <ValidationTag
      :form-id="props.err.formId"
      :error-id="props.err.id"
    />
    <div
      v-if="props.err.content"
      class="text-red-500 text-xs flex items-center font-bold py-2 my-2"
    >
      <p>
        {{ props.err.content.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from "~/composables/forms/formCreator";

const props = defineProps<{
  err: FormError;
}>();
</script>
