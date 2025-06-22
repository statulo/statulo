<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { z } from "zod";
import { submitPasswordReset, type SubmitPasswordResetRequest } from "~/api/auth";

definePageMeta({
  auth: "guest",
  layout: "auth",
});

const authStore = useAuthStore();
const query = useRoute().query;

const form = useForm({
  id: "password-reset",
  init: () => ({
    newPassword: "",
    confirmPassword: "",
  }),
  schema: z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] }),
});

const { mutate, isPending } = useMutation({
  async mutationFn(data: SubmitPasswordResetRequest) {
    const res = await submitPasswordReset(data);
    await authStore.setAuth(res);
  },
});

async function submit() {
  const res = form.validate();
  if (!res.success) return;
  mutate({
    newPassword: res.data.newPassword,
    token: query.token?.toString() ?? "",
  }, {
    onError(err) {
      form.errors.insert(err);
    },
    onSuccess() {
      if (authStore.isLoggedIn) {
        navigateTo("/");
      }
    },
  });
}
</script>

<template>
  <Form @submit="submit()">
    <AuthHeading>Change password</AuthHeading>
    <Label
      text="New password"
      class="mb-5"
    >
      <TextInput
        v-model="form.data.newPassword"
        type="password"
        placeholder="Password"
        :error="form.error('newPassword')"
      />
    </Label>
    <Label
      text="Confirm Password"
      class="mb-8"
    >
      <TextInput
        v-model="form.data.confirmPassword"
        type="password"
        placeholder="Confirm Password"
        :error="form.error('confirmPassword')"
      />
    </Label>
    <Button
      submit
      stretch
      :loading="isPending"
    >
      Change password
    </Button>
    <p>{{ form.errors.formErrors() }}</p>
  </Form>
</template>
