<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { z } from "zod";
import { requestPasswordReset, type PasswordResetRequest } from "~/api/auth";

definePageMeta({
  auth: "guest",
  layout: "auth",
});

const form = useForm({
  id: "password-request",
  init: () => ({
    email: "",
    password: "",
  }),
  schema: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

const { mutate, isPending } = useMutation({
  async mutationFn(data: PasswordResetRequest) {
    await requestPasswordReset(data);
  },
});

async function submit() {
  const res = form.validate();
  if (!res.success) return;
  mutate(res.data, {
    onError(err) {
      form.errors.insert(err);
    },
  });
  // TODO tell user it's a success
}
</script>

<template>
  <Form @submit="submit()">
    <AuthHeading>Request password reset</AuthHeading>
    <Label
      text="Email"
      class="mb-5"
    >
      <TextInput
        v-model="form.data.email"
        type="email"
        placeholder="Email"
        :error="form.error('email')"
      />
    </Label>
    <Button
      submit
      stretch
      :loading="isPending"
    >
      Request reset
    </Button>
    <Text class="text-sm text-center mt-10">
      Back <TextLink to="/login">
        to login
      </TextLink>
    </Text>
    <p>{{ form.errors.formErrors() }}</p>
  </Form>
</template>
