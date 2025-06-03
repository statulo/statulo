<template>
  <div>
    <div class="flex items-end mb-8">
      <div class="flex-1">
        <BigTitle>Status pages</BigTitle>
        <Text>Publicize the status of your system.</Text>
      </div>
      <Button type="secondary">
        New status page
      </Button>
    </div>

    <Panel titled>
      <template #title>
        <Bold>24 pages</Bold>
      </template>

      <p class="text-center pt-5">
        No status pages yet :(
      </p>
    </Panel>
  </div>
</template>
