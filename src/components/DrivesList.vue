<template>
  <div
    v-for="item in driveDetails"
    :key="item.drive"
    class="tile tile-centered"
  >
    <div class="tile-icon p-2">
      <span v-if="item.replicas == 0" class="label label-rounded label-error">
        &nbsp;
      </span>
      <span
        v-else-if="item.replicas < item.minReplicators"
        class="label label-rounded label-warning"
      >
        &nbsp;
      </span>
      <span v-else class="label label-rounded label-success">&nbsp;</span>
    </div>
    <div class="tile-content">
      <div class="tile-title h5">{{ item.drive.substr(0, 15) }}...</div>
      <div class="tile-subtitle text-gray">
        Owner
        {{ item.owner.substr(0, 15) }}...
      </div>
    </div>
    <div class="tile-content">
      <div class="tile-title">
        Billing Price
        {{ item.billingPrice }} SO
      </div>
      <div class="tile=subtitle">
        Billing Period
        {{ item.billingPeriod }}
        {{ item.billingPeriod > 1 ? "Blocks" : "Block" }}
      </div>
    </div>
    <div class="tile-content">
      <div class="tile-title">
        Replicas
        {{ item.replicas }}
      </div>
      <div class="tile-subtitle">
        Percent Approvers
        {{ item.percentApprovers }} %
      </div>
    </div>
    <div class="tile-action">
      Storage<br />
      {{ item.space }} MB
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "DrivesList",
  async setup() {
    const driveDetails = ref([]);

    const drives = await axios.get("mock/testnet1.dfms.io.json");
    drives.data.drives.forEach(async (contractKey) => {
      const driveDetail = await axios.get(
        `mock/testnet1.dfms.io/${contractKey}.json`
      );
      driveDetails.value.push(driveDetail.data.Contract);
    });

    return {
      driveDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";
@import "spectre.css/src/mixins/shadow";
@import "spectre.css/src/mixins/text";
@import "spectre.css/src/tiles";

.tile {
  @include shadow-variant($unit-o);
  padding: $unit-2;
  margin: $unit-4 0;
  border: $border-width solid $border-color;
}
</style>
