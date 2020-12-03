<template>
  <SuspenseTemplate>
    <template #default>
      <DrivesList />
    </template>
  </SuspenseTemplate>
</template>

<script>
import { defineAsyncComponent } from "vue";
import SuspenseTemplate from "@/components/SuspenseLoadErrorTemplate.vue";

export default {
  name: "DrivesOverview",
  components: {
    SuspenseTemplate,
    DrivesList: defineAsyncComponent(() =>
      import("@/components/DrivesList.vue" /* webpackChunkName: "drivesList" */)
    ),
  },
};
</script>
