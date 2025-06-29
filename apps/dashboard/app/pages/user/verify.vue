<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { verifyEmailByToken } from "~/api/users";

definePageMeta({
  auth: "guest",
  layout: "auth",
});

const authStore = useAuthStore();
const query = useRoute().query;
const token = computed(() => query.token?.toString() ?? "");

const { mutate, isPending, isError } = useMutation({
  async mutationFn() {
    await verifyEmailByToken(token.value);
    await authStore.fetchUser(); // TODO: Find a better way to handle any errors
  },
});

onMounted(() => {
  if (!import.meta.client) return;
  mutate();
});
</script>

<template>
  <Bold v-if="isPending">
    Loading...
  </Bold>
  <Bold v-else-if="isError">
    Link has expired
  </Bold>
  <div v-else>
    <AuthHeading>Your email is now verified</AuthHeading>
    <Button
      stretch
      to="/"
    >
      Continue
    </Button>
  </div>
</template>
