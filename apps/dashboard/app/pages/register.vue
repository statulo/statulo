<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { z } from "zod";
import type { RegisterRequest } from "~/api/auth";

definePageMeta({
  auth: "guest",
  layout: "auth",
});

const authStore = useAuthStore();

const form = useForm({
  id: "register",
  init: () => ({
    email: "",
    password: "",
    confirmPassword: "",
  }),
  schema: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] }),
});

const { mutate, isPending } = useMutation({
  async mutationFn(data: RegisterRequest) {
    await authStore.register(data);
  },
});

async function submit() {
  const res = form.validate();
  if (!res.success) return;
  mutate(res.data, {
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
    <AuthHeading>Let's create a new Statulo account!</AuthHeading>
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
    <Label
      text="Password"
      class="mb-5"
    >
      <TextInput
        v-model="form.data.password"
        type="password"
        placeholder="Password"
        :error="form.error('password')"
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
      Create account
    </Button>
    <Text class="text-sm text-center mt-10">
      Already have an account?
      <TextLink to="/login">
        Go to login
      </TextLink><br>
      or
      <TextLink to="#">
        learn more
      </TextLink>
    </Text>
    <p>{{ form.errors.formErrors() }}</p>
  </Form>
</template>
