<script setup lang="ts">
import {
  DropdownMenu,
} from "reka-ui/namespaced";
</script>

<template>
  <DropdownMenu.Root v-slot="{ open }">
    <slot :open="open" />
  </DropdownMenu.Root>
</template>
