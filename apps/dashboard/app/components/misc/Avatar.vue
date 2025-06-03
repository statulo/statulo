<script setup lang="ts">
const props = defineProps<{
  name: string;
  src?: string;
  chars?: number;
}>();

const initials = computed(() => {
  // TODO Make it so it displays more significant characters instead of just the first N chars
  const charCount = props.chars ?? 2;
  const trimmed = props.name.trim();
  if (trimmed.length === 0 || !trimmed[0]) return null;
  const partOne = trimmed[0] ?? "";
  const partTwo = trimmed.slice(1, 1 + (charCount - 1)) ?? ""; // subtracted one of charCount cuz partOne has it
  return partOne.toUpperCase() + partTwo.toLowerCase();
});
</script>

<template>
  <div
    class="h-8 w-8 min-w-8 min-h-8 pointer-events-none select-none flex"
  >
    <div
      v-if="props.src"
      class="h-full w-full bg-cover bg-center rounded-full"
      :style="{
        backgroundImage: `url('${props.src}')`
      }"
    />
    <div
      v-else
      class="border border-neutral-400 bg-neutral-500 rounded-full text-neutral-100 font-semibold flex-1 flex items-center justify-center"
    >
      <p class="text-lg">
        {{ initials }}
      </p>
    </div>
  </div>
</template>
