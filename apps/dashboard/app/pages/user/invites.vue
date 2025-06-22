<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import { queryKeys } from "~/api/queryKeys";
import { acceptInvite, listUserInvites } from "~/api/users";

const authStore = useAuthStore();
const hasVerifiedEmail = computed(() => authStore.user?.emailVerified ?? false);

const { data } = await useQuery({
  queryKey: queryKeys.users.invites.me,
  queryFn: async () => {
    if (!authStore.user) return [];
    return await listUserInvites("@me");
  },
});

const { mutate, isPending } = useMutation({
  async mutationFn(inviteId: string) {
    await acceptInvite(inviteId);
  },
});
</script>

<template>
  <div>
    <Heading>Invites</Heading>
    <div
      v-for="invite of data ?? []"
      :key="invite.id"
    >
      <p>You are invited to join {{ invite.org.name }}</p>
      <Button
        v-if="hasVerifiedEmail"
        :loading="isPending"
        @click="mutate(invite.id)"
      >
        Accept
      </button>
      <Divider />
    </div>
    <p v-if="data !== undefined && data.length === 0">
      No invites
    </p>
    <p v-if="!hasVerifiedEmail">
      You must have your email verified to accept invites
    </p>
  </div>
</template>
