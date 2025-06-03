<template>
  <div class="flex flex-col h-full relative">
    <div class="absolute top-0 left-0 right-0 max-h-screen pointer-events-none overflow-hidden">
      <div class="w-full h-[500px] bg-gradient-to-b from-neutral-gradientTop/10 to-neutral-900/0" />
    </div>
    <div class="flex flex-col h-full">
      <div class="flex flex-col flex-1 min-h-0 relative">
        <slot />
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>
