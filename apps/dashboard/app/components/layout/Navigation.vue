<script setup lang="ts">
const authStore = useAuthStore();
const self = computed(() => authStore.user);
const org = computed(() => authStore.org);
</script>

<template>
  <NavigationBar>
    <template #left>
      <div
        v-if="org"
        class="flex items-center gap-3"
      >
        <Avatar :name="org.name" />
        <div>
          <Bold>{{ org.name }}</Bold>
          <Small>{{ org.description }}</Small>
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
          v-if="self"
          :name="self.email"
          :chars="1"
        />
      </div>
    </template>

    <div class="flex items-center gap-7">
      <NavigationItem
        to="/"
        exact
        icon="basil:fire-solid"
      >
        Monitors
      </NavigationItem>
      <NavigationItem
        to="/test"
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
