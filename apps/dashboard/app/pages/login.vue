<script setup lang="ts">
import { z } from "zod";
import { getNextPage } from "~/utils/urls";

definePageMeta({
  auth: "guest",
  layout: "auth",
});

const authStore = useAuthStore();
const query = useRoute().query;

const form = useForm({
  id: "login",
  init: () => ({
    email: "",
    password: "",
  }),
  schema: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

async function submit() {
  const res = form.validate();
  if (!res.success) return;
  try {
    await authStore.login(res.data);
  } catch (error) {
    if (error instanceof Error) {
      form.errors.insert(error);
      return;
    }
    return;
  }
  if (authStore.isLoggedIn) {
    const nextPage = getNextPage(query);
    navigateTo(nextPage);
  }
}

</script>

<template>
  <Form @submit="submit()">
    <AuthHeading>What's your email?</AuthHeading>
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
      class="mb-8"
    >
      <TextInput
        v-model="form.data.password"
        type="password"
        placeholder="Password"
        :error="form.error('password')"
      />
    </Label>
    <Button
      submit
      stretch
    >
      Log in
    </Button>
    <Text class="text-sm text-center mt-10">
      New to Statulo?
      <TextLink to="/register">
        Create an account
      </TextLink><br>
      or
      <TextLink to="#">
        learn more
      </TextLink>
    </Text>
    <p>{{ form.errors.formErrors() }}</p>
  </Form>
</template>
