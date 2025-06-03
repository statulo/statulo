<template>
  <div>
    <div class="flex mb-8">
      <div class="flex-1">
        <BigTitle>Welcome {{ authStore.user?.email }}</BigTitle>
        <Text>This is the main page of the dashboard application.</Text>
      </div>
      <div>
        <button @click="authStore.logout()">
          Logout
        </button>
      </div>
    </div>

    <TextInput
      v-model="form.data.text"
    />
    <button @click="submit">
      Submit
    </button>
    <p>{{ form.errors.formErrors() }}</p>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const authStore = useAuthStore();

const form = useForm({
  id: "edit",
  init: () => ({
    text: "",
  }),
  schema: z.object({
    text: z.string().min(5, "Text must be at least 5 characters long"),
  }),
});

function submit() {
  const res = form.validate();
  if (!res.success) return;
  console.log(res.data);
}
</script>
