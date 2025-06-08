<script setup lang="ts">
import {
  DropdownMenu,
} from "reka-ui/namespaced";
import type { ClickableProps } from "~/components/misc/Clickable.vue";

const props = defineProps<{
  icon?: string;
  danger?: boolean;
} & ClickableProps>();
</script>

<template>
  <DropdownMenu.Item
    as-child
  >
    <div class="p-1">
      <Clickable
        v-bind="props"
        class="p-1 px-2 flex w-full items-center transition active:bg-neutral-800 rounded bg-neutral-800/0 hover:bg-neutral-700/100 duration-100 gap-2"
        :class="{
          'hover:text-neutral-150': !props.danger,
          'hover:text-status-danger': props.danger,
        }"
      >
        <Icon
          v-if="props.icon"
          :name="props.icon"
          class="text-neutral-300 text-lg"
        />
        <span>
          <slot />
        </span>
      </Clickable>
    </div>
  </DropdownMenu.Item>
</template>
