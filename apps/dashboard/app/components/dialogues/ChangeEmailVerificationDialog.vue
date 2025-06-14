<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";

const open = defineModel<boolean>("open");
const heading = resolveComponent("Heading");
</script>

<template>
  <DialogRoot
    v-model:open="open"
  >
    <DialogTrigger />
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-10 bg-neutral-700 bg-opacity-40"
      />
      <DialogContent
        class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-40 bg-neutral-500 p-6 rounded-lg max-w-md w-full"
        @pointer-down-outside.prevent
      >
        <DialogTitle
          :as="heading"
          class="mb-2"
        >
          Verify Email Change
        </DialogTitle>
        <DialogDescription>Please confirm your email change by entering the code sent to your new email address.</DialogDescription>
        <Form class="flex flex-col items-center mt-4">
          <PinInput
            :count="6"
            type="number"
          />
          <div class="flex gap-2 mt-6">
            <Button
              type="primary"
            >
              Verify Email
            </Button>
            <Button
              type="secondary"
              @click="open = false"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
