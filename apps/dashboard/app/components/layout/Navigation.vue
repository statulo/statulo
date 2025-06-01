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

    <div class="flex items-center gap-7">
      <NavigationItem
        to="/monitors"
        icon="basil:fire-solid"
      >
        Monitors
      </NavigationItem>
      <NavigationItem
        to="/incidents"
        icon="basil:lightning-alt-solid"
      >
        Incidents
      </NavigationItem>
      <NavigationItem
        to="/pages"
        icon="basil:globe-solid"
      >
        Pages
      </NavigationItem>
    </div>
  </NavigationBar>
</template>
