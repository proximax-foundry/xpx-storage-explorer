<template>
  <div class="column col-12">
    <Susp>
      <template #default>
        <Node />
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
  components: {
    Susp,
    Node: defineAsyncComponent(() =>
      import("@/components/Node.vue" /* webpackChunkName: "node" */)
    ),
    Blocks: defineAsyncComponent(() =>
      import("@/components/Blocks.vue" /* webpackChunkName: "blocks" */)
    ),
  },
};
</script>
