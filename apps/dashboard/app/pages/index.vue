<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { listMonitors } from "~/api/monitors";
import { queryKeys } from "~/api/queryKeys";

const auth = useAuthStore();

const { isPending, data } = useQuery({
  queryKey: queryKeys.monitors.all,
  queryFn: async () => {
    // TODO temp
    return await listMonitors(auth.user?.orgMembers[0]?.org.id ?? "", {
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
        <BigTitle>Monitors</BigTitle>
        <Text>Have a peek into your monitors.</Text>
      </div>
      <Button type="secondary">
        New monitor
      </Button>
    </div>

    <Panel titled>
      <template #title>
        <Bold>{{ data?.total ?? 0 }} Monitors</Bold>
      </template>

      <p
        v-if="isPending || !data"
        class="text-center pt-5"
      >
        Loading...
      </p>
      <p
        v-else-if="data.data.length === 0"
        class="text-center pt-5"
      >
        No monitors yet :(
      </p>
      <div v-else>
        <div
          v-for="(item, ind) of data.data"
          :key="item.id"
        >
          <Divider v-if="ind !== 0" />
          <div class="my-4 flex items-center gap-3">
            <MonitorStatus
              status="up"
              class="mt-2 self-start text-lg"
            />
            <div class="flex-1">
              <SubHeading>{{ item.computedName }}</SubHeading>
              <div class="flex items-center mt-1">
                <MonitorType
                  :type="item.type"
                  class="mr-2"
                />
                <span>Checked every 30s</span>
              </div>
            </div>
            <MonitorStatus
              status="up"
              with-text
              class="text-sm"
            />
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>
