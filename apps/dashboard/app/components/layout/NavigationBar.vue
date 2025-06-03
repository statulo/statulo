<template>
  <Container>
    <div class="grid h-9 my-6 grid-cols-2">
      <div class="flex col-span-1 col-end-2 row-span-1 row-end-1 items-center pointer-events-none">
        <div class="pointer-events-auto">
          <slot name="left" />
        </div>
      </div>
      <div class="flex col-span-2 col-end-3 row-span-1 row-end-1 items-center justify-end pointer-events-none">
        <div class="pointer-events-auto">
          <slot name="right" />
        </div>
      </div>
      <div class="col-span-full row-span-1 row-end-1 flex justify-center items-center pointer-events-none">
        <div class="pointer-events-auto">
          <slot />
        </div>
      </div>
    </div>
  </Container>
</template>
