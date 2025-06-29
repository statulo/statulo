<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import { z } from "zod";
import { deleteMonitor, editMonitor, getMonitor, monitorTypes, type MonitorEditRequest } from "~/api/monitors";
import { queryKeys } from "~/api/queryKeys";

definePageMeta({
  auth: "org-scoped",
});
const params = useRoute().params;
const id = computed(() => params.id?.toString() ?? "");

const { isPending, data, refetch, isFetched } = useQuery({
  queryKey: queryKeys.monitors.one(id.value),
  queryFn: async () => {
    return await getMonitor(id.value);
  },
});
watch(isFetched, () => {
  form.reset();
});

const { mutate: deleteMonitorReq, isPending: isDeletePending } = useMutation({
  mutationFn: async () => {
    return await deleteMonitor(id.value);
  },
  async onSuccess() {
    navigateTo("/");
  },
});

const { mutate, isPending: mutateIsPending } = useMutation({
  mutationFn: async (body: MonitorEditRequest) => {
    return await editMonitor(id.value, body);
  },
});

const form = useForm({
  id: "monitor-edit",
  init: () => ({
    name: data.value?.name ?? "",
    url: data.value?.http?.url ?? "",
  }),
  schema: z.object({
    name: zNullString(z.string().trim()),
    url: z.string().trim().url(),
  }),
});

function submit() {
  const res = form.validate();
  if (!res.success) return;
  if (!data.value) return;

  mutate({
    type: data.value.type,
    name: form.changed("name") ? res.data.name : undefined,
    data: data.value.type === monitorTypes.http
      ? {
          url: form.changed("url") ? res.data.url : undefined,
        }
      : {},
  }, {
    onError(error) {
      form.errors.insert(error);
    },
    onSuccess() {
      refetch();
    },
  });
}
</script>

<template>
  <div v-if="isPending">
    Loading...
  </div>
  <div v-else-if="data">
    <BigTitle class="mt-12 mb-4">
      {{ data.name ?? data.computedName }}
    </BigTitle>
    <Panel>
      <Text>Name: {{ data.name }}</Text>
      <Text v-if="data.primaryInterval">
        Interval: {{ data.primaryInterval.amount }}{{ data.primaryInterval.unit }}
      </Text>

      <div v-if="data.http">
        <Text>Allowed status codes: {{ JSON.stringify(data.http.allowedStatusCodes) }}</Text>
        <Text>keywords: {{ JSON.stringify(data.http.expectedKeywords) }}</Text>
        <Text>url: {{ data.http.url }}</Text>
      </div>
    </Panel>
    <Panel>
      <Form
        @submit="submit()"
      >
        <Bold>Edit your monitor!</Bold>

        <div v-if="data.type === monitorTypes.http">
          <p>Your monitor will be named: <Tag>{{ !!form.data.name ? form.data.name : form.data.url }}</Tag></p>
          <Label
            text="URL"
            class="mb-5"
          >
            <TextInput
              v-model="form.data.url"
              placeholder="https://example.com"
              :error="form.error('url')"
            />
          </Label>
          <Label
            text="Display name"
            class="mb-5"
          >
            <TextInput
              v-model="form.data.name"
              placeholder="The best monitor"
              :error="form.error('name')"
            />
          </Label>
        </div>

        <div
          class="flex gap-2 mt-6"
        >
          <Button
            type="primary"
            :loading="mutateIsPending"
            submit
          >
            Update
          </Button>
        </div>
        <div
          v-if="form.errors.formErrors()"
          class="mt-4 text-status-danger"
        >
          {{ form.errors.formErrors() }}
        </div>
      </Form>
    </Panel>

    <BigTitle class="mt-12 mb-4">
      Manage monitor
    </BigTitle>
    <Panel>
      <div class="my-4 flex items-center gap-3">
        <div class="flex-1">
          <SubHeading>Delete monitor</SubHeading>
          <p>This cannot be undone</p>
        </div>
        <Button
          :loading="isDeletePending"
          @click="deleteMonitorReq()"
        >
          Delete
        </Button>
      </div>
    </Panel>
  </div>
</template>
