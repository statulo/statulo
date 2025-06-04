<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  auth: "org-scoped",
});
const authStore = useAuthStore();
const orgMembers = computed(() => authStore.user?.orgMembers ?? []);
const org = computed(() => authStore.org);

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

<template>
  <div>
    <div class="flex mb-8">
      <div class="flex-1">
        <BigTitle>Welcome {{ authStore.user?.email }}</BigTitle>
        <Text>This is the main page of the dashboard application.</Text>
      </div>
      <div>
        <Button
          type="primary"
          @click="authStore.logout()"
        >
          Logout
        </Button>
      </div>
    </div>

    <Panel
      titled
      class="mb-8"
    >
      <template #title>
        <Bold>Organisations for user</Bold>
      </template>
      <div
        v-for="member of orgMembers"
        :key="member.id"
      >
        <Divider />
        <div class="p-2 flex items-center">
          <div class="flex-1">
            <Bold>
              {{ member.org.name }}
              <span v-if="org?.id === member.org.id"> - SELECTED</span>
            </Bold>
            <Small>{{ member.org.description ?? "" }}</Small>
          </div>
          <Button
            v-if="org?.id !== member.org.id"
            type="secondary"
            @click="authStore.switchOrg(member.org.id)"
          >
            Switch
          </Button>
        </div>
      </div>
    </Panel>

    <SubHeading>Form test</SubHeading>
    <TextInput
      v-model="form.data.text"
    />
    <button @click="submit">
      Submit
    </button>
    <p>{{ form.errors.formErrors() }}</p>
  </div>
</template>
