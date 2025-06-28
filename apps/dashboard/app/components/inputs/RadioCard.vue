<script setup lang="ts">
import { RadioGroup } from "reka-ui/namespaced";

const props = defineProps<{
  value: string;
  icon: string;
  label: string;
}>();
</script>

<template>
  <RadioGroup.Item
    v-slot="{ checked }"
    :value="props.value"
  >
    <div
      class="border text-left select-none rounded-lg bg-neutral-950 hover:bg-neutral-900 transition duration-75 p-4 relative"
      :class="{
        'border-primary-300 text-primary-500': checked,
        'border-neutral-600 text-neutral-200': !checked
      }"
    >
      <div
        class="bg-primary-600/0 absolute inset-0"
        :class="{ 'bg-primary-600/5': checked }"
      />
      <div
        class="opacity-0 transition duration-75 absolute top-3 right-3 pointer-events-none"
        :class="{
          'opacity-100': checked,
        }"
      >
        <RadioGroup.Indicator class="h-4 w-4 rounded bg-primary-500 flex justify-center items-center text-white">
          <Icon
            name="basil:check-outline"
            class="text-current"
          />
        </RadioGroup.Indicator>
      </div>
      <Icon
        :name="props.icon"
        class="block mb-12 text-2xl text-current transition duration-75"
      />
      <Bold class="mb-1">
        {{ props.label }}
      </Bold>
      <div
        class="text-neutral-200 text-sm"
      >
        <slot />
      </div>
    </div>
  </RadioGroup.Item>
</template>
