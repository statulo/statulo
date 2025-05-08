<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  auth: "guest",
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

async function submit() {
  const res = form.validate();
  if (!res.success) return;
  try {
    await authStore.register(res.data);
  } catch (error) {
    if (error instanceof Error) {
      form.errors.insert(error);
      return;
    }
    return;
  }
  if (authStore.isLoggedIn) {
    navigateTo("/");
  }
}

</script>

<template>
  <div>
    <form @submit.prevent="submit">
      <h1>Register</h1>
      <TextInput
        v-model="form.data.email"
        type="email"
        placeholder="Email"
        :error="form.error('email')"
      />
      <TextInput
        v-model="form.data.password"
        type="password"
        placeholder="Password"
        :error="form.error('password')"
      />
      <TextInput
        v-model="form.data.confirmPassword"
        type="password"
        placeholder="Confirm Password"
        :error="form.error('confirmPassword')"
      />
      <button type="submit">
        Register
      </button>
      <p>{{ form.errors.formErrors() }}</p>
    </form>
  </div>
</template>
