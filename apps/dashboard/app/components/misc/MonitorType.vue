<script setup lang="ts">
import { monitorTypes } from "~/api/monitors";

const props = defineProps<{
  type: string;
}>();

const text = computed(() => {
  if (props.type === monitorTypes.http) return "HTTP";
  return null;
});
</script>

<template>
  <Tag>{{ text }}</Tag>
</template>
