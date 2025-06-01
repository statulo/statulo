<template>
  <div>
    <ValidationTag
      :form-id="props.err.formId"
      :error-id="props.err.id"
    />
    <div
      v-if="props.err.content"
      class="text-status-danger text-xs flex items-start font-semibold py-0.5 my-2"
    >
      <Icon
        name="streamline:warning-triangle-solid"
        class="mr-2 mt-0.5"
      />
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
