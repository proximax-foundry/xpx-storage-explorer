<template>
  <SuspenseTemplate>
    <template #default>
      <NodesMap />
    </template>
  </SuspenseTemplate>
</template>

<script>
import { defineAsyncComponent } from "vue";
import SuspenseTemplate from "@/components/SuspenseLoadErrorTemplate.vue";

export default {
  name: "NodesOverview",
  components: {
    SuspenseTemplate,
    NodesMap: defineAsyncComponent(() =>
      import("@/components/NodesMap.vue" /* webpackChunkName: "nodesMap" */)
    ),
  },
};
</script>
