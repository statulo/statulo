<script setup lang="ts" generic="T extends string = string">
import { RadioGroup } from "reka-ui/namespaced";
import type { FormError } from "~/composables/forms/formCreator";

const value = defineModel<T | null>();

const props = defineProps<{
  default?: any;
  label: string;
  items: {
    value: T;
    icon: string;
    label: string;
    description: string;
  }[];
  error?: FormError;
}>();
</script>

<template>
  <div>
    <RadioGroup.Root
      v-model="value"
      class="grid grid-cols-2"
      :default-value="props.default"
      :aria-label="props.label"
    >
      <template
        v-for="item of items"
        :key="item.value"
      >
        <RadioCard
          :value="item.value"
          :icon="item.icon"
          :label="item.label"
        >
          <p>{{ item.description }}</p>
        </RadioCard>
      </template>
    </RadioGroup.Root>
    <ValidationError
      v-if="props.error"
      :err="props.error"
    />
  </div>
</template>
