<template>
  <div
    v-for="item in driveDetails"
    :key="item.contract.drive"
    class="tile tile-centered"
  >
    <div class="tile-icon p-2">
      <figure class="avatar">
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" class="m-1" />
        <i v-if="item.contract.replicas == 0" class="avatar-presence busy"></i>
        <i
          v-else-if="item.contract.replicas < item.contract.minReplicators"
          class="avatar-presence away"
        ></i>
        <i v-else class="avatar-presence online"></i>
      </figure>
    </div>
    <div class="tile-content">
      <div class="tile-title h5">
        <router-link
          :to="{ name: 'Drive Details', params: { cid: [item.contract.drive] } }"
        >
          {{ item.contract.drive.substr(0, 15) }}...
        </router-link>
      </div>
      <div class="tile-subtitle text-small">
        Owner:
        <b>{{ item.contract.owner.substr(0, 15) }}...</b>
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
          item.contract.duration > 0 ? item.contract.created + item.contract.duration : "No Expiry"
        }}</b>
      </div>
    </div>
    <div class="tile-content">
      <div class="tile-title">
        Billing Price:
        <b>{{ item.contract.billingPrice }} SO</b>
      </div>
      <div class="tile=subtitle">
        Billing Period:
        <b>{{ item.contract.billingPeriod }} Block(s)</b>
      </div>
    </div>
    <div class="tile-content">
      <div class="tile-title">
        Replicas:
        <b>{{ item.contract.replicas }}</b>
      </div>
      <div class="tile-subtitle">
        Approvers:
        <b>{{ item.contract.percentApprovers }} %</b>
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
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import axios from "axios";

library.add(faHdd);

export default {
  name: "DrivesList",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const driveDetails = ref([]);

    const drives = await axios.get(
      "http://testnet1.dfms.io:6366/api/v1/contract/ls"
    );
    drives.data.Ids.forEach(async (id) => {
      const contractDetail = axios.get(
        `http://testnet1.dfms.io:6366/api/v1/contract/get?arg=${id}`
      );
      const driveDetail = axios.get(
        `http://testnet1.dfms.io:6366/api/v1/drive/ls?arg=${id}`
      );

      const details = await Promise.all([contractDetail, driveDetail]);
      const result = {
        contract: details[0].data.Contract,
        spaceUsed: 0,
        folders: 0,
        files: 0,
      };
      if (details[1].data.List) {
        details[1].data.List.forEach((item) => {
          if (item.Type == "dir") {
            result.folders++;
          } else {
            result.files++;
          }

          if (item.Size != 0) {
            result.spaceUsed += item.Size;
          }
        });
      }

      driveDetails.value.push(result);
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
@import "spectre.css/src/mixins/avatar";
@import "spectre.css/src/tiles";
@import "spectre.css/src/avatars";

.tile {
  @include shadow-variant($unit-o);
  padding: $unit-2;
  margin: $unit-4 0;
  border: $border-width solid $border-color;
}
</style>
