<script setup lang="ts">
import {
  DropdownMenu,
} from "reka-ui/namespaced";
</script>

<template>
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      class="min-w-[250px] mt-3 bg-neutral-600 rounded-lg p-[5px] shadow-md border border-neutral-500"
      align="end"
    >
      <slot />
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</template>
