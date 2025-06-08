<script setup lang="ts">
import z from "zod";
import { editUserSecuritySettings } from "~/api/users";

const authStore = useAuthStore();

const changeEmailForm = useForm({
  id: "change-email",
  init: () => ({
    email: authStore.user?.email || "",
  }),
  schema: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

const changePasswordForm = useForm({
  id: "change-password",
  init: () => ({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }),
  schema: z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters long"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  }),
});

async function changePasswordSubmit() {
  const res = changePasswordForm.validate();
  if (!res.success || !authStore.user) return;
  try {
    await editUserSecuritySettings(authStore.user.id, {
      password: {
        oldPassword: res.data.currentPassword,
        newPassword: res.data.newPassword,
      },
    });
    changePasswordForm.reset();
  } catch (error) {
    if (error instanceof Error) {
      changePasswordForm.errors.insert(error);
      return;
    }
    throw error;
  }
}

function changeEmailSubmit() {
  const res = changeEmailForm.validate();
  if (!res.success) return;

  console.log("Email changed successfully", res.data);
  changeEmailForm.reset();
}

</script>

<template>
  <div>
    <div class="flex-1 mb-8">
      <BigTitle>User Settings</BigTitle>
      <p>Manage your account settings and preferences here.</p>
    </div>

    <div class="flex flex-col gap-8 lg:flex-row">
      <div class="flex-1 space-y-4">
        <SubHeading class="mb-4">
          Account Information
        </SubHeading>
        <Label text="Name">
          <p>{{ authStore.user?.name }}</p>
        </Label>
        <Form
          class="flex items-end gap-2"
          @submit="changeEmailSubmit"
        >
          <Label
            text="Email"
            class="flex-1"
          >
            <div class="flex items-start gap-2">
              <TextInput
                v-model="changeEmailForm.data.email"
                type="email"
                placeholder="Email"
                autocomplete="email"
                class="flex-1"
                :error="changeEmailForm.error('email')"
              />
              <Button submit>
                Change
              </Button>
            </div>
          </Label>
        </Form>
      </div>
      <div class="flex-1">
        <SubHeading class="mb-4">
          Change Password
        </SubHeading>

        <Form
          class="space-y-4"
          @submit="changePasswordSubmit"
        >
          <Label text="Current Password">
            <TextInput
              v-model="changePasswordForm.data.currentPassword"
              type="password"
              placeholder="Current Password"
              autocomplete="current-password"
              :error="changePasswordForm.error('currentPassword')"
            />
          </Label>
          <Label text="New Password">
            <TextInput
              v-model="changePasswordForm.data.newPassword"
              type="password"
              placeholder="New Password"
              autocomplete="new-password"
              :error="changePasswordForm.error('newPassword')"
            />
          </Label>
          <Label text="Confirm New Password">
            <TextInput
              v-model="changePasswordForm.data.confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              autocomplete="new-password"
              :error="changePasswordForm.error('confirmPassword')"
            />
          </Label>
          <Button submit>
            Change Password
          </Button>
          <p>{{ changePasswordForm.errors.formErrors() }}</p>
        </Form>
      </div>
    </div>
  </div>
</template>
