<template>
  <div class="columns">
    <div class="column col-4">
      <BlockSummary />
    </div>
    <div class="column col-4">
      <StorageSummary />
    </div>
    <div class="column col-4">
      <ContractSummary />
    </div>
    <div class="column col-12">
      <PeersSummary />
    </div>
    <div class="column col-12">
      <DrivesSummary />
    </div>
  </div>
</template>

<script>
import BlockSummary from "@/components/BlockSummary.vue";
import ContractSummary from "@/components/ContractSummary.vue";
import DrivesSummary from "@/components/DrivesSummary.vue";
import PeersSummary from "@/components/PeersSummary.vue";
import StorageSummary from "@/components/StorageSummary.vue";

export default {
  name: "MainOverview",
  components: {
    BlockSummary,
    ContractSummary,
    DrivesSummary,
    PeersSummary,
    StorageSummary,
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";

.column {
  margin: $unit-6 0;
}
</style>
