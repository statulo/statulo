<script setup lang="ts">
const props = defineProps<{
  to: string;
  icon?: string;
  exact?: boolean;
}>();

</script>

<template>
  <NuxtLink
    v-slot="{ isActive, isExactActive }"
    class="group"
    :to="props.to"
  >
    <span
      class="flex items-center gap-1.5 active:scale-95 rounded-full py-[5px] px-2.5 border border-neutral-300/0 bg-neutral-500/0 transition duration-75"
      :class="{
        'shadow-md border-neutral-300/100 bg-neutral-500/100 group-hover:border-neutral-250 group-hover:bg-neutral-400': props.exact ? isExactActive : isActive,
      }"
    >
      <Icon
        v-if="props.icon"
        :name="props.icon"
        class="text-neutral-300 text-[21px] transition group-hover:text-neutral-200"
        :class="{
          '!text-primary-600 group-hover:!text-primary-400': props.exact ? isExactActive : isActive
        }"
      />
      <span
        class="text-neutral-200 pr-2 text-base font-medium transition group-hover:text-neutral-100"
        :class="{
          '!text-primary-300 group-hover:!text-primary-100': props.exact ? isExactActive : isActive
        }"
      >
        <slot />
      </span>
    </span>
  </NuxtLink>
</template>
