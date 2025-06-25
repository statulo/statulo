<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import { z } from "zod";
import { cancelInvite, listInvites, listMembers, removeMember } from "~/api/members";
import { deleteOrg, editOrg, type OrgEditRequest } from "~/api/orgs";
import { queryKeys } from "~/api/queryKeys";

definePageMeta({
  auth: "org-scoped",
});
const auth = useAuthStore();
const org = computed(() => auth.org?.id ?? "");

const inviteOpen = ref(false);

function inviteSuccess() {
  refetchInvites();
  inviteOpen.value = false;
}

const { mutate: remove, isPending: isRemovePending } = useMutation({
  mutationFn: async (id: string) => {
    return await removeMember(org.value, id);
  },
  onSuccess() {
    refetch();
  },
});

const { mutate: removeInvite, isPending: isCancelPending } = useMutation({
  mutationFn: async (id: string) => {
    return await cancelInvite(org.value, id);
  },
  onSuccess() {
    refetchInvites();
  },
});

const { mutate: deleteOrganisation, isPending: isDeletePending } = useMutation({
  mutationFn: async () => {
    return await deleteOrg(org.value);
  },
  async onSuccess() {
    await auth.fetchUser();
    navigateTo("/");
  },
});

const { isPending, data, refetch } = useQuery({
  queryKey: computed(() => queryKeys.orgs.members.all(org.value)),
  queryFn: async () => {
    // TODO temp
    return await listMembers(org.value, {
      limit: 25,
      offset: 0,
    });
  },
});

const { isPending: isInvitesPending, data: invites, refetch: refetchInvites } = useQuery({
  queryKey: computed(() => queryKeys.orgs.invites.all(org.value)),
  queryFn: async () => {
    // TODO temp
    return await listInvites(org.value, {
      limit: 25,
      offset: 0,
    });
  },
});

const { mutate: editOrgDetails, isPending: isOrgEditPending } = useMutation({
  mutationFn: async (body: OrgEditRequest) => {
    return await editOrg(org.value, body);
  },
  async onSuccess() {
    await auth.fetchUser();
  },
});

const orgEditForm = useForm({
  id: "org-edit",
  init: () => ({
    name: auth.org?.name ?? "",
    description: auth.org?.description ?? "",
  }),
  schema: z.object({
    name: z.string().trim().min(1),
    description: zNullString(z.string().trim()),
  }),
});

function submit() {
  const res = orgEditForm.validate();
  if (!res.success) return;

  editOrgDetails(res.data, {
    onError(error) {
      if (error instanceof Error) {
        orgEditForm.errors.insert(error);
      }
    },
  });
}

</script>

<template>
  <div>
    <div class="flex items-end mb-8">
      <div class="flex-1">
        <BigTitle>Organisation members</BigTitle>
      </div>
      <Button
        type="secondary"
        @click="inviteOpen = true"
      >
        Add member
      </Button>
    </div>

    <InviteMemberDialog
      :open="inviteOpen"
      @cancel="inviteOpen = false"
      @success="inviteSuccess()"
    />

    <Panel titled>
      <template #title>
        <Bold>{{ data?.total ?? 0 }} Members</Bold>
      </template>

      <p
        v-if="isPending || !data"
        class="text-center pt-5"
      >
        Loading...
      </p>
      <div v-else>
        <div
          v-for="(item, ind) of data.data"
          :key="item.id"
        >
          <Divider v-if="ind !== 0" />
          <div class="my-4 flex items-center gap-3">
            <div class="flex-1">
              <SubHeading>{{ item.user.name }}</SubHeading>
              <div class="flex items-center mt-1">
                <p>{{ item.user.email }}</p>
              </div>
            </div>
            <p>{{ item.roles.join(", ") }}</p>
            <Button
              :loading="isRemovePending"
              @click="remove(item.id)"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Panel>

    <Panel
      class="mt-4"
      titled
    >
      <template #title>
        <Bold>{{ invites?.total ?? 0 }} Invites</Bold>
      </template>

      <p
        v-if="isInvitesPending || !invites"
        class="text-center pt-5"
      >
        Loading...
      </p>
      <div v-else>
        <div
          v-for="(item, ind) of invites.data"
          :key="item.id"
        >
          <Divider v-if="ind !== 0" />
          <div class="my-4 flex items-center gap-3">
            <div class="flex-1">
              <div class="flex items-center mt-1">
                <p>{{ item.email }}</p>
              </div>
            </div>
            <p>{{ item.roles.join(", ") }}</p>
            <Button
              :loading="isCancelPending"
              @click="removeInvite(item.id)"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Panel>

    <BigTitle class="mt-12 mb-4">
      Organisation details
    </BigTitle>
    <Panel>
      <Form
        class="space-y-8"
        @submit="submit()"
      >
        <Label text="Name">
          <TextInput
            v-model="orgEditForm.data.name"
            :error="orgEditForm.error('name')"
          />
        </Label>
        <Label text="Description">
          <TextInput
            v-model="orgEditForm.data.description"
            :error="orgEditForm.error('description')"
          />
        </Label>
        <div class="flex gap-2 mt-6">
          <Button
            type="primary"
            :loading="isOrgEditPending"
            submit
          >
            Invite
          </Button>
        </div>
        <div
          v-if="orgEditForm.errors.formErrors()"
          class="mt-4 text-status-danger"
        >
          {{ orgEditForm.errors.formErrors() }}
        </div>
      </Form>
    </Panel>

    <BigTitle class="mt-12 mb-4">
      Manage organisation
    </BigTitle>
    <Panel>
      <div class="my-4 flex items-center gap-3">
        <div class="flex-1">
          <SubHeading>Delete organisation</SubHeading>
          <p>This cannot be undone</p>
        </div>
        <Button
          :loading="isDeletePending"
          @click="deleteOrganisation()"
        >
          Delete
        </Button>
      </div>
    </Panel>
  </div>
</template>
