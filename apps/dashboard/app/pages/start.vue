<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { z } from "zod";
import { createOrganisation, type CreateOrgansationRequest } from "~/api/orgs";
import { zNullString } from "~/utils/zod";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();

const form = useForm({
  id: "create-org",
  init: () => ({
    name: "",
    description: "",
  }),
  schema: z.object({
    name: z.string().min(1, "Enter a name").trim(),
    description: zNullString(z.string().trim()),
  }),
});

const { mutate, isPending } = useMutation({
  async mutationFn(data: CreateOrgansationRequest) {
    const org = await createOrganisation(data);
    await authStore.fetchUser();
    return org;
  },
});

async function submit() {
  const res = form.validate();
  if (!res.success) return;
  console.log(res.data);
  mutate(res.data, {
    onError(err) {
      form.errors.insert(err);
    },
    onSuccess(data) {
      authStore.switchOrg(data.id);
      navigateTo("/");
    },
  });
}
</script>

<template>
  <Form @submit="submit()">
    <AuthHeading>Let's create an organisation!</AuthHeading>
    <Label
      text="Name"
      class="mb-5"
    >
      <TextInput
        v-model="form.data.name"
        placeholder="John's neighbourhood SAAS"
        :error="form.error('name')"
      />
    </Label>
    <Label
      text="Description"
      class="mb-5"
    >
      <TextInput
        v-model="form.data.description"
        placeholder="Your friendly neighbourhood software"
        :error="form.error('description')"
      />
    </Label>
    <Button
      submit
      stretch
      :loading="isPending"
    >
      Create
    </Button>
    <p>{{ form.errors.formErrors() }}</p>
  </Form>
</template>
