<script setup lang="ts">
export type ClickableProps = {
  to?: string; // vue routing
  href?: string; // browser routing
  loading?: boolean; // show a spinner, also disables interaction
  disabled?: boolean; // disabled state, also disables interaction
  // TODO unfinished
};

const classes = computed(() => {
  return {
    "relative": true,
    "[&>*]:invisible": props.loading,
  };
});

const props = defineProps<ClickableProps>();
const emit = defineEmits<{
  (event: "click"): void;
}>();

function handleClick(event: MouseEvent) {
  if (props.loading || props.disabled) {
    event.preventDefault();
    return;
  }
  emit("click");
}

</script>

<template>
  <NuxtLink
    v-if="props.to"
    :class="classes"
    :to="props.to"
  >
    <span
      v-if="props.loading"
      class="absolute !visible inset-0 flex items-center justify-center"
    >
      Loading...
    </span>
    <span><slot /></span>
  </NuxtLink>
  <a
    v-else-if="props.href"
    :class="classes"
    :href="props.href"
  >
    <span
      v-if="props.loading"
      class="absolute !visible inset-0 flex items-center justify-center"
    >
      Loading...
    </span>
    <span><slot /></span>
  </a>
  <button
    v-else
    :class="classes"
    @click="handleClick($event)"
  >
    <span
      v-if="props.loading"
      class="absolute !visible inset-0 flex items-center justify-center"
    >
      Loading...
    </span>
    <span><slot /></span>
  </button>
</template>
