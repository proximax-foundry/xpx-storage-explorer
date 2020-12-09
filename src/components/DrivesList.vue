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
      <div class="tile-title h5">
        <router-link
          :to="{ name: 'Drive Details', params: { cid: item.drive } }"
        >
          {{ item.drive.substr(0, 15) }}...
        </router-link>
      </div>
      <div class="tile-subtitle text-small">
        Owner:
        <b>{{ item.owner.substr(0, 15) }}...</b>
      </div>
    </div>
    <div class="tile-content">
      <div class="tile-title">
        Storage Used:
        <b>{{ $filters.bytesToSize(item.spaceUsed) }}</b>
      </div>
      <div class="tile=subtitle">
        Expiry:
        <b>{{
          item.duration > 0 ? item.created + item.duration : "No Expiry"
        }}</b>
      </div>
    </div>
    <div class="tile-content">
      <div class="tile-title">
        Billing Price:
        <b>{{ item.billingPrice }} SO</b>
      </div>
      <div class="tile=subtitle">
        Billing Period:
        <b>{{ item.billingPeriod }} Block(s)</b>
      </div>
    </div>
    <div class="tile-content">
      <div class="tile-title">
        Replicas:
        <b>{{ item.replicas }}</b>
      </div>
      <div class="tile-subtitle">
        Approvers:
        <b>{{ item.percentApprovers }} %</b>
      </div>
    </div>
    <div class="tile-action text-center mx-2">
      <div class="tile-title h5">{{ item.folders }}</div>
      <div class="tile-subtitle text-small">Folder(s)</div>
    </div>
    <div class="tile-action text-center mx-2">
      <div class="tile-title h5">{{ item.files }}</div>
      <div class="tile-subtitle text-small">File(s)</div>
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

      driveDetail.data.Contract.spaceUsed = 0;
      driveDetail.data.Contract.files = 0;
      driveDetail.data.Contract.folders = 0;
      if (driveDetail.data.List) {
        driveDetail.data.List.forEach((item) => {
          if (item.Type == "dir") {
            driveDetail.data.Contract.folders++;
          } else {
            driveDetail.data.Contract.files++;
          }

          if (item.Size != 0) {
            driveDetail.data.Contract.spaceUsed += item.Size;
          }
        });
      }

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
