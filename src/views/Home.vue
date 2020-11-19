<template>
  <div class="column col-12">
    <Susp>
      <template #default>
        <NodeInfo />
      </template>
    </Susp>
  </div>
  <div class="column col-12">
    <Susp>
      <template #default>
        <Blocks />
      </template>
    </Susp>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import Susp from "@/components/SuspenseLoadError.vue";

export default {
  name: "Home",
  components: {
    Susp,
    NodeInfo: defineAsyncComponent(() =>
      import("@/components/NodeInfo.vue" /* webpackChunkName: "nodeInfo" */)
    ),
    Blocks: defineAsyncComponent(() =>
      import("@/components/Blocks.vue" /* webpackChunkName: "blocks" */)
    ),
  },
};
</script>
