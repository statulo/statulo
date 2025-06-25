<script setup lang="ts">
const authStore = useAuthStore();
const self = computed(() => authStore.user);

function logout() {
  authStore.logout();
}
</script>

<template>
  <MenuRoot v-slot="{ open }">
    <MenuTrigger>
      <slot :open="open" />
    </MenuTrigger>
    <MenuBody>
      <div
        v-if="self"
        class="px-2 py-2 flex items-center gap-2.5"
      >
        <Avatar
          :name="self.email"
          :chars="1"
        />
        <div>
          <Bold>{{ self.email }}</Bold>
          <Small>{{ self.email }}</Small>
        </div>
      </div>
      <MenuDivider v-if="self" />
      <MenuPart
        icon="basil:settings-alt-solid"
        to="/user/settings"
      >
        User settings
      </MenuPart>
      <MenuPart
        icon="basil:settings-alt-solid"
        to="/user/invites"
      >
        Invitations
      </MenuPart>
      <MenuPart
        icon="basil:notification-solid"
        to="/user/settings"
      >
        Notification controls
      </MenuPart>
      <MenuDivider />
      <MenuPart
        icon="basil:info-circle-solid"
        :to="urls.help"
      >
        Help
      </MenuPart>
      <MenuPart
        icon="basil:logout-solid"
        danger
        @click="logout"
      >
        Log out
      </MenuPart>
    </MenuBody>
  </MenuRoot>
</template>
