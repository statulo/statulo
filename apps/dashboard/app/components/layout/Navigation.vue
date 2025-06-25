<script setup lang="ts">
const authStore = useAuthStore();
const self = computed(() => authStore.user);
const org = computed(() => authStore.org);
</script>

<template>
  <NavigationBar class="-mt-2">
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
        <SubtleLink :to="urls.feedback">
          Feedback
        </SubtleLink>
        <SubtleLink :to="urls.documentation">
          Docs
        </SubtleLink>
        <UserMenu
          v-slot="{ open }"
        >
          <div
            class="bg-neutral-900/0 p-2 active:scale-95 rounded-full transition duration-100 hover:bg-neutral-900/100"
            :class="{
              '!bg-neutral-900/100': open,
            }"
          >
            <Avatar
              v-if="self"
              :name="self.email"
              :chars="1"
            />
          </div>
        </UserMenu>
      </div>
    </template>

    <div class="flex items-center gap-7">
      <NavigationItem
        to="/org/members"
        exact
        icon="basil:fire-solid"
      >
        Manage
      </NavigationItem>
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
