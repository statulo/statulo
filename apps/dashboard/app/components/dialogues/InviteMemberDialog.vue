<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";
import z from "zod";
import { orgRoles, type OrgRoles } from "~/api/enums";
import { inviteMember, type InviteMemberInput } from "~/api/members";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (event: "cancel"): void;
  (event: "success"): void;
}>();

const authStore = useAuthStore();

const { mutate, isPending } = useMutation({
  mutationFn: async (body: InviteMemberInput) => {
    return await inviteMember(authStore.org?.id ?? "", body);
  },
  onSuccess: () => {
    emit("success");
  },
});

const form = useForm({
  id: "invite-member",
  init: () => ({
    email: "",
    role: orgRoles.viewer as OrgRoles,
  }),
  schema: z.object({
    email: z.string().email().trim(),
    role: z.nativeEnum(orgRoles),
  }),
});

function onOpenUpdate(open: boolean) {
  if (!open) {
    emit("cancel");
  }
}

function submit() {
  const res = form.validate();
  if (!res.success) return;

  mutate({
    email: res.data.email,
    roles: [res.data.role],
  }, {
    onError: (error) => {
      if (error instanceof Error) {
        form.errors.insert(error);
      }
    },
  });
}

const heading = resolveComponent("Heading");
</script>

<template>
  <DialogRoot
    :open="props.open"
    @update:open="onOpenUpdate"
  >
    <DialogTrigger />
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-10 bg-neutral-700 bg-opacity-40"
      />
      <DialogContent
        class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-40 bg-neutral-700 border border-neutral-500 p-6 rounded-lg max-w-md w-full"
        @pointer-down-outside.prevent
      >
        <DialogTitle
          :as="heading"
          class="mb-2"
        >
          Invite member to team
        </DialogTitle>
        <Form
          class="flex flex-col items-center mt-4"
          @submit="submit()"
        >
          <TextInput
            v-model="form.data.email"
            type="email"
            :error="form.error('email')"
          />
          <div class="flex gap-2 mt-6">
            <Button
              type="primary"
              :loading="isPending"
              submit
            >
              Invite
            </Button>
            <Button
              type="secondary"
              @click="emit('cancel')"
            >
              Cancel
            </Button>
          </div>
          <div
            v-if="form.errors.formErrors()"
            class="mt-4 text-status-danger"
          >
            {{ form.errors.formErrors() }}
          </div>
        </Form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
