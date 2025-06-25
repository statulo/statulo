<template>
  <div class="relative flex flex-col h-full">
    <div class="absolute top-0 left-0 right-0 max-h-screen overflow-hidden pointer-events-none">
      <div class="w-full h-[500px] bg-gradient-to-b from-neutral-gradientTop/10 to-neutral-900/0" />
    </div>
    <div class="flex flex-col flex-1">
      <div class="flex flex-col flex-1 min-h-0 relative">
        <slot />
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>
