<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getMonitor } from "~/api/monitors";
import { queryKeys } from "~/api/queryKeys";

definePageMeta({
  auth: "org-scoped",
});
const params = useRoute().params;

const { isPending, data } = useQuery({
  queryKey: queryKeys.monitors.one(params.id?.toString() ?? ""),
  queryFn: async () => {
    return await getMonitor(params.id?.toString() ?? "");
  },
});
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
  </div>
</template>
