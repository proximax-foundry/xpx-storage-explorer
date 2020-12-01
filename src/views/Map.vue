<template>
  <SuspenseTemplate>
    <template #default>
      <MapNodes />
    </template>
  </SuspenseTemplate>
</template>

<script>
import { defineAsyncComponent } from "vue";
import SuspenseTemplate from "@/components/SuspenseLoadErrorTemplate.vue";

export default {
  name: "Map",
  components: {
    SuspenseTemplate,
    MapNodes: defineAsyncComponent(() =>
      import("@/components/MapNodes.vue" /* webpackChunkName: "mapNodes" */)
    ),
  },
};
</script>
