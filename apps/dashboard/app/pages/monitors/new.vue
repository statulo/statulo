<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { z } from "zod";
import { createMonitor, monitorTypes, type MonitorCreateRequest, type MonitorTypes } from "~/api/monitors";

const auth = useAuthStore();
const { mutate, isPending } = useMutation({
  mutationFn: async (body: MonitorCreateRequest) => {
    return await createMonitor(auth.org?.id ?? "", body);
  },
});

const form = useForm({
  id: "monitor-create",
  init: () => ({
    type: null as MonitorTypes | null,
    name: "",
    url: "",
  }),
  schema: z.object({
    type: z.string().nullable().pipe(z.nativeEnum(monitorTypes)),
    name: zNullString(z.string().trim()),
    url: z.string().trim().url(),
  }),
});

function submit() {
  const res = form.validate();
  if (!res.success) return;

  mutate({
    type: res.data.type,
    contactPointIds: [],
    name: res.data.name,
    data: {
      url: res.data.url,
      allowedStatusCodes: [{ from: 200, to: 399 }],
      expectedKeywords: [],
      interval: { amount: 5, unit: "m" },
    },
  }, {
    onError(error) {
      form.errors.insert(error);
    },
    onSuccess(data) {
      navigateTo(`/monitors/${data.id}`);
    },
  });
}
</script>

<template>
  <div>
    <BigTitle class="mt-12 mb-4">
      Create new monitor
    </BigTitle>
    <Panel>
      <Form
        @submit="submit()"
      >
        <div v-if="!form.data.type">
          <Bold>Let's create a new monitor!</Bold>
          <Small class="mb-8 mt-3">What type of system do you want observe?</Small>
          <RadioGroup
            v-model="form.data.type"
            label="Monitor type"
            :items="[{
              icon: 'basil:chrome-solid',
              value: monitorTypes.http,
              label: 'HTTP and website',
              description: 'Check SSL and website uptime',
            }]"
            :error="form.error('type')"
          />
        </div>

        <div v-if="form.data.type === monitorTypes.http">
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
          v-if="form.data.type"
          class="flex gap-2 mt-6"
        >
          <Button
            type="primary"
            :loading="isPending"
            submit
          >
            Create
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
  </div>
</template>
