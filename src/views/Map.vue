<template>
  <Susp>
    <template #default>
      <MapNodes />
    </template>
  </Susp>
</template>

<script>
import { defineAsyncComponent } from "vue";
import Susp from "@/components/SuspenseLoadError.vue";

export default {
  name: "Map",
  components: {
    Susp,
    MapNodes: defineAsyncComponent(() =>
      import("@/components/MapNodes.vue" /* webpackChunkName: "mapNodes" */)
    ),
  },
};
</script>
