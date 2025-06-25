<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";
import z from "zod";
import { requestEmailVerificationCode } from "~/api/auth";
import { editUserSecuritySettings } from "~/api/users";

const props = defineProps<{
  email: string;
  open: boolean;
}>();

const emit = defineEmits<{
  (event: "cancel"): void;
  (event: "success"): void;
}>();

const authStore = useAuthStore();

const { mutateAsync: requestCode, isPending: requestPending, isSuccess: requestSuccess, error } = useMutation({
  mutationFn: async (email: string) => {
    return await requestEmailVerificationCode(email);
  },
});

const { mutateAsync: requestEditEmail, isPending: editEmailPending } = useMutation({
  mutationFn: async (code: string) => {
    if (!authStore.user) throw new Error("User not authenticated");
    return await editUserSecuritySettings(authStore.user.id, {
      email: {
        code,
        newEmail: props.email,
      },
    });
  },
  retry: false,
  onSuccess: () => {
    emit("success");
  },
});

const editEmailForm = useForm({
  id: "edit-email",
  init: () => ({
    code: [],
  }),
  schema: z.object({
    code: z
      .custom<string[] | number[]>((val) => {
        if (!Array.isArray(val)) return false;

        // Required to convert a spare array to an array with undefined values in the "empty" slots
        const normalisedArray = Array.from(val);

        return (
          normalisedArray.length === 6 &&
          normalisedArray.every((el) => {
            const str = String(el);
            return /^\d$/.test(str); // Matches a single digit 0–9
          })
        );
      }, {
        message: "Code must be 6 digits",
      })
      .transform(val => val.join("")),
  }),
});

watch(() => props.open, (newValue) => {
  if (newValue) {
    requestCode(props.email);
  }
}, { immediate: true });

function onOpenUpdate(open: boolean) {
  if (!open) {
    emit("cancel");
  }
}

function editEmail() {
  const res = editEmailForm.validate();
  if (!res.success) return;

  requestEditEmail(res.data.code, {
    onError: (error) => {
      if (error instanceof Error) {
        editEmailForm.errors.insert(error);
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
          Verify Email Change
        </DialogTitle>
        <DialogDescription>Please confirm your email change by entering the code sent to your new email address.</DialogDescription>
        <Form
          v-if="requestSuccess"
          class="flex flex-col items-center mt-4"
          @submit="editEmail()"
        >
          <PinInput
            v-model="editEmailForm.data.code"
            :count="6"
            type="number"
          />
          <ValidationError :err="editEmailForm.error('code')" />
          <div class="flex gap-2 mt-6">
            <Button
              type="primary"
              :loading="editEmailPending"
              submit
            >
              Verify Email
            </Button>
            <Button
              type="secondary"
              @click="emit('cancel')"
            >
              Cancel
            </Button>
          </div>
          <div
            v-if="editEmailForm.errors.formErrors()"
            class="mt-4 text-status-danger"
          >
            {{ editEmailForm.errors.formErrors() }}
          </div>
        </Form>
        <div v-else-if="requestPending">
          Loading...
        </div>
        <div v-else>
          <p>{{ error?.message ?? "There was an error requesting a verification code" }}</p>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
