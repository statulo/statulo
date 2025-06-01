<script setup lang="ts">
export type ClickableProps = {
  to?: string; // vue routing
  href?: string; // browser routing
  loading?: boolean; // show a spinner, also disables interaction
  disabled?: boolean; // disabled state, also disables interaction
  // TODO unfinished
};

const props = defineProps<ClickableProps>();
const emit = defineEmits<{
  (_event: "click"): void;
}>();
</script>

<template>
  <NuxtLink
    v-if="props.to"
    :to="props.to"
  >
    <slot />
  </NuxtLink>
  <a
    v-else-if="props.href"
    :href="props.href"
  >
    <slot />
  </a>
  <button
    v-else
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
