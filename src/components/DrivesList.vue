<template>
  <div
    v-for="item in drives.data.data"
    :key="item.drive.Id"
    class="tile tile-centered"
  >
    <div class="tile-icon p-2">
      <figure class="avatar">
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" class="m-1" />
        <i v-if="item.drive.state == 1" class="avatar-presence away"></i>
        <i v-else-if="item.drive.state == 2" class="avatar-presence online"></i>
        <i v-else-if="item.drive.state == 3" class="avatar-presence busy"></i>
        <i v-else class="avatar-presence"></i>
      </figure>
    </div>
    <div class="tile-content">
      <div class="tile-title h5">
        <router-link
          :to="{ name: 'Drive Details', params: { cid: [item.drive.Id] } }"
        >
          {{ item.drive.Id.substr(0, 15) }}...
        </router-link>
      </div>
      <div class="tile-subtitle text-small">
        Owner:
        <b>{{ item.drive.owner.substr(0, 15) }}...</b>
      </div>
    </div>
    <div class="tile-content hide-lg">
      <div class="tile-title">
        Created:
        <b>Block {{ $filters.numberArrayToCompact(item.drive.start) }}</b>
      </div>
      <div class="tile=subtitle">
        Duration:
        <b>{{ $filters.numberArrayToCompact(item.drive.duration) }} Block(s)</b>
      </div>
    </div>
    <div class="tile-content hide-md">
      <div class="tile-title">
        Storage Used:
        <b>{{
          $filters.bytesToSize(
            $filters.numberArrayToCompact(item.drive.occupiedSpace)
          )
        }}</b>
      </div>
      <div class="tile=subtitle">
        Storage:
        <b>{{
          $filters.bytesToSize($filters.numberArrayToCompact(item.drive.size))
        }}</b>
      </div>
    </div>
    <div class="tile-content hide-lg">
      <div class="tile-title">
        Billing Price:
        <b>{{ $filters.numberArrayToCompact(item.drive.billingPrice) }} SO</b>
      </div>
      <div class="tile=subtitle">
        Billing Period:
        <b>
          {{ $filters.numberArrayToCompact(item.drive.billingPeriod) }}
          Block(s)
        </b>
      </div>
    </div>
    <div class="tile-content hide-xl">
      <div class="tile-title">
        Replicas:
        <b>{{ item.drive.replicas }}</b>
      </div>
      <div class="tile-subtitle">
        Approvers:
        <b>{{ item.drive.percentApprovers }} %</b>
      </div>
    </div>
    <div class="tile-action text-center mx-2">
      <div class="tile-title h5">{{ item.drive.count.folders }}</div>
      <div class="tile-subtitle text-small">Folder(s)</div>
    </div>
    <div class="tile-action text-center mx-2">
      <div class="tile-title h5">{{ item.drive.count.files }}</div>
      <div class="tile-subtitle text-small">File(s)</div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, ref } from "vue";
import axios from "axios";

library.add(faHdd);

export default {
  name: "DrivesList",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const drives = ref(null);

    drives.value = await axios.get(`${siriusStore.state.selectedNode}/drives`);
    drives.value.data.data.forEach(async (drive) => {
      drive.drive.Id = internalInstance.appContext.config.globalProperties.$filters.publicKeyToCID(
        drive.drive.multisig
      );
      drive.drive.count = {
        folders: 0,
        files: 0,
      };

      if (drive.drive.state == 1 || drive.drive.state == 2) {
        const resp = await axios.get(
          `http://testnet1.dfms.io:6466/api/v1/drive/ls?arg=${drive.drive.Id}`
        );

        if (resp.data.List) {
          resp.data.List.forEach((item) => {
            if (item.Type == "dir") {
              drive.drive.count.folders++;
            } else {
              drive.drive.count.files++;
            }
          });
        }
      }
    });

    return {
      drives,
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
