<template>
  <NavigationBar>
    <template #left>
      <div class="flex items-center gap-3">
        <Avatar name="Pretendo" />
        <div>
          <Bold>Pretendo</Bold>
          <Small>Remaking Nintendo</Small>
        </div>
      </div>
    </template>
    <template #right>
      <div class="flex gap-8 items-center text-sm">
        <SubtleLink to="#">
          Feedback
        </SubtleLink>
        <SubtleLink to="#">
          Docs
        </SubtleLink>
        <Avatar
          name="Jvs"
          :chars="1"
        />
      </div>
    </template>

    <p>Items</p>
  </NavigationBar>
</template>
