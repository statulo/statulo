<script setup lang="ts">
import { tv } from "tailwind-variants";
import type { ClickableProps } from "~/components/misc/Clickable.vue";

const props = defineProps<{
  type?: "primary" | "secondary";
  submit?: boolean;
  stretch?: boolean;
  class?: string;
} & ClickableProps>();
const emit = defineEmits<{
  (event: "click"): void;
}>();

const type = computed(() => props.type ?? "primary");

function trigger($event: MouseEvent) {
  if (props.loading) return $event.preventDefault();
  if (props.disabled) return $event.preventDefault();
  emit("click");
}

const buttonVariants = tv({
  base: "inline-block px-4 py-2 border transition duration-75 rounded-lg active:scale-95 select-none",
  variants: {
    type: {
      primary: "bg-gradient-to-b from-primary-500 to-primary-600 shadow-md border-primary-400 text-primary-100 hover:from-primary-600 hover:to-primary-600 hover:border-primary-300",
      secondary: "bg-neutral-500 border-neutral-400 shadow-md text-neutral-100 hover:bg-neutral-400 hover:border-neutral-300",
    },
    stretch: {
      true: "w-full",
      false: "",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
});

const buttonClasses = computed(() => {
  return buttonVariants({
    type: type.value,
    stretch: props.stretch,
    disabled: props.disabled,
    class: props.class,
  });
});

</script>

<template>
  <Clickable
    v-bind="props"
    :type="props.submit ? 'submit' : undefined"
    :class="buttonClasses"
    @click="trigger"
  >
    <slot />
  </Clickable>
</template>
