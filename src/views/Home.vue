<template>
  <div class="column col-12">
    <SuspenseTemplate>
      <template #default>
        <NodeInfo />
      </template>
    </SuspenseTemplate>
  </div>
  <div class="column col-12">
    <SuspenseTemplate>
      <template #default>
        <Blocks />
      </template>
    </SuspenseTemplate>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import SuspenseTemplate from "@/components/SuspenseLoadErrorTemplate.vue";

export default {
  name: "Home",
  components: {
    SuspenseTemplate,
    NodeInfo: defineAsyncComponent(() =>
      import("@/components/NodeInfo.vue" /* webpackChunkName: "nodeInfo" */)
    ),
    Blocks: defineAsyncComponent(() =>
      import("@/components/Blocks.vue" /* webpackChunkName: "blocks" */)
    ),
  },
};
</script>
