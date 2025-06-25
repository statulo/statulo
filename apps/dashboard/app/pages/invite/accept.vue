<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import { acceptInviteInfoByToken, getInviteInfoByToken } from "~/api/invites";
import { queryKeys } from "~/api/queryKeys";

definePageMeta({
  auth: "guest",
  layout: "auth",
});

const authStore = useAuthStore();
const router = useRouter();
const query = useRoute().query;
const token = computed(() => query.token?.toString() ?? "");

const { data, isPending } = useQuery({
  queryKey: queryKeys.invites.token(token.value),
  async queryFn() {
    return await getInviteInfoByToken(token.value);
  },
});

const { mutate, isPending: isMutatePending } = useMutation({
  async mutationFn() {
    const newMember = await acceptInviteInfoByToken(token.value);
    await authStore.fetchUser();
    authStore.switchOrg(newMember.orgId);
    router.push("/");
  },
});
</script>

<template>
  <Form
    v-if="data"
    @submit="mutate()"
  >
    <AuthHeading>You've been invited</AuthHeading>
    <div class="border-neutral-500 mb-4 border rounded-xl p-3">
      <Bold>{{ data.org.name }}</Bold>
      <p>{{ data.org.description }}</p>
    </div>
    <Button
      submit
      stretch
      :loading="isMutatePending"
    >
      Accept invite
    </Button>
  </Form>
  <div v-else-if="!isPending">
    Invalid invite
  </div>
</template>
