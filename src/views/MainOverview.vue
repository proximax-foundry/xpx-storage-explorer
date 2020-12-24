<template>
  <div class="columns">
    <div class="column col-4">
      <SuspenseTemplate>
        <template #default>
          <BlockSummary />
        </template>
      </SuspenseTemplate>
    </div>
    <div class="column col-4">
      <SuspenseTemplate>
        <template #default>
          <StorageSummary />
        </template>
      </SuspenseTemplate>
    </div>
    <div class="column col-4">
      <SuspenseTemplate>
        <template #default>
          <ContractSummary />
        </template>
      </SuspenseTemplate>
    </div>
    <div class="column col-12">
      <SuspenseTemplate>
        <template #default>
          <NodeSummary />
        </template>
      </SuspenseTemplate>
    </div>
    <div class="column col-12">
      <SuspenseTemplate>
        <template #default>
          <DriveSummary />
        </template>
      </SuspenseTemplate>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import SuspenseTemplate from "@/components/SuspenseLoadErrorTemplate.vue";

export default {
  name: "MainOverview",
  components: {
    SuspenseTemplate,
    BlockSummary: defineAsyncComponent(() =>
      import(
        "@/components/BlockSummary.vue" /* webpackChunkName: "blockSummary" */
      )
    ),
    ContractSummary: defineAsyncComponent(() =>
      import(
        "@/components/ContractSummary.vue" /* webpackChunkName: "contractSummary" */
      )
    ),
    DriveSummary: defineAsyncComponent(() =>
      import(
        "@/components/DriveSummary.vue" /* webpackChunkName: "driveSummary" */
      )
    ),
    NodeSummary: defineAsyncComponent(() =>
      import(
        "@/components/NodeSummary.vue" /* webpackChunkName: "nodeSummary" */
      )
    ),
    StorageSummary: defineAsyncComponent(() =>
      import(
        "@/components/StorageSummary.vue" /* webpackChunkName: "storageSummary" */
      )
    ),
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";

.column {
  margin: $unit-6 0;
}
</style>
