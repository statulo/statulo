<script setup lang="ts">
import type { ClickableProps } from "~/components/misc/Clickable.vue";

const props = defineProps<{
  type?: "primary" | "secondary";
  submit?: boolean;
  stretch?: boolean;
} & ClickableProps>();
const emit = defineEmits<{
  (_event: "click"): void;
}>();

const type = computed(() => props.type ?? "primary");

function trigger() {
  if (props.loading) return;
  if (props.disabled) return;
  emit("click");
}
</script>

<template>
  <Clickable
    v-bind="props"
    class="py-2 px-4 rounded-lg active:scale-95 inline-block transition duration-75"
    :type="props.submit ? 'submit' : undefined"
    :class="{
      'bg-gradient-to-b from-primary-500 to-primary-600 shadow-md border border-primary-400 text-primary-100': type === 'primary',
      'hover:from-primary-600 hover:to-primary-600 border hover:border-primary-300': type === 'primary',
      'bg-neutral-500 border border-neutral-400 shadow-md text-neutral-100': type === 'secondary',
      'hover:bg-neutral-400 hover:border-neutral-300': type === 'secondary',
      'w-full': props.stretch,
    }"
    @click="trigger()"
  >
    <slot />
  </Clickable>
</template>
