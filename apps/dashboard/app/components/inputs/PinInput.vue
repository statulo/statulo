<script setup lang="ts">
import { PinInputInput, PinInputRoot } from "reka-ui";

const props = defineProps<{
  disabled?: boolean;
  mask?: boolean;
  otp?: boolean;
  required?: boolean;
  type?: "text" | "number";
  count: number;
}>();

const type = computed(() => {
  return props.type ?? "number";
});

const value = defineModel<number[] | string[]>();
</script>

<template>
  <PinInputRoot
    v-model="value"
    :disabled="props.disabled"
    :mask="props.mask"
    :otp="props.otp"
    :required="props.required"
    :type="type"
    placeholder="0"
    class="flex items-center gap-2"
  >
    <PinInputInput
      v-for="(id, index) in props.count"
      :key="id"
      :index="index"
      class="w-10 h-10 text-center border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-500 bg-neutral-950 border-neutral-600 placeholder:text-neutral-200 text-neutral-100 disabled:bg-neutral-500 disabled:cursor-not-allowed"
    />
  </PinInputRoot>
</template>
