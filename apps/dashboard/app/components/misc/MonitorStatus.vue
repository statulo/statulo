<script setup lang="ts">
const props = defineProps<{
  status: "up" | "down";
  withText?: boolean;
}>();

const text = computed(() => {
  if (props.status === "up") return "Nominal";
  if (props.status === "down") return "Disrupted";
  return "";
});
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <div
      class="h-[0.7em] w-[0.7em] rounded-full border-[3px]"
      :class="{
        'border-status-success': props.status === 'up',
        'border-status-danger': props.status === 'down',
      }"
    />
    <div
      v-if="props.withText"
      :class="{
        'text-status-success': props.status === 'up',
        'text-status-danger': props.status === 'down',
      }"
    >
      <p class="font-medium">
        {{ text }}
      </p>
    </div>
  </div>
</template>
