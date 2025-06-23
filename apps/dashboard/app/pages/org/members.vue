<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import { listMembers, removeMember } from "~/api/members";
import { deleteOrg } from "~/api/orgs";
import { queryKeys } from "~/api/queryKeys";

definePageMeta({
  auth: "org-scoped",
});
const auth = useAuthStore();
const org = computed(() => auth.org?.id ?? "");

const { mutate: remove, isPending: isRemovePending } = useMutation({
  mutationFn: async (id: string) => {
    return await removeMember(org.value, id);
  },
  onSuccess() {
    refetch();
  },
});

const { mutate: deleteOrganisation, isPending: isDeletePending } = useMutation({
  mutationFn: async () => {
    return await deleteOrg(org.value);
  },
  onSuccess() {
    auth.fetchUser();
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
</script>

<template>
  <div>
    <div class="flex items-end mb-8">
      <div class="flex-1">
        <BigTitle>Organisation members</BigTitle>
      </div>
      <Button type="secondary">
        Add member
      </Button>
    </div>

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

    <BigTitle class="mt-12">
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
