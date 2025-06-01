<template>
  <div>
    <div class="flex items-end mb-8">
      <div class="flex-1">
        <BigTitle>Monitors</BigTitle>
        <Text>Have a peek into your monitors.</Text>
      </div>
      <Button type="secondary">
        New monitor
      </Button>
    </div>

    <Panel titled>
      <template #title>
        <Bold>24 Monitors</Bold>
      </template>

      <p class="text-center pt-5">
        No monitors yet :(
      </p>
    </Panel>
  </div>
</template>
