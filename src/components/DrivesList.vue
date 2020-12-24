<template>
  <div v-for="item in driveDetails" :key="item.Id" class="tile tile-centered">
    <div class="tile-icon p-2">
      <figure class="avatar">
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" class="m-1" />
        <i v-if="item.state == 1" class="avatar-presence away"></i>
        <i v-else-if="item.state == 2" class="avatar-presence online"></i>
        <i v-else-if="item.state == 3" class="avatar-presence busy"></i>
        <i v-else class="avatar-presence"></i>
      </figure>
    </div>
    <div class="tile-content">
      <div class="tile-title h5">
        <router-link
          :to="{ name: 'Drive Details', params: { cid: [item.Id] } }"
        >
          {{ item.Id.substr(0, 15) }}...
        </router-link>
      </div>
      <div class="tile-subtitle text-small">
        Owner:
        <b>{{ item.owner.substr(0, 15) }}...</b>
      </div>
    </div>
    <div class="tile-content hide-lg">
      <div class="tile-title">
        Created:
        <b>Block {{ $filters.numberArrayToCompact(item.start) }}</b>
      </div>
      <div class="tile=subtitle">
        Duration:
        <b>{{ $filters.numberArrayToCompact(item.duration) }} Block(s)</b>
      </div>
    </div>
    <div class="tile-content hide-md">
      <div class="tile-title">
        Storage Used:
        <b>{{
          $filters.bytesToSize(
            $filters.numberArrayToCompact(item.occupiedSpace)
          )
        }}</b>
      </div>
      <div class="tile=subtitle">
        Storage:
        <b>{{
          $filters.bytesToSize($filters.numberArrayToCompact(item.size))
        }}</b>
      </div>
    </div>
    <div class="tile-content hide-lg">
      <div class="tile-title">
        Billing Price:
        <b>{{ $filters.numberArrayToCompact(item.billingPrice) }} SO</b>
      </div>
      <div class="tile=subtitle">
        Billing Period:
        <b>{{ $filters.numberArrayToCompact(item.billingPeriod) }} Block(s)</b>
      </div>
    </div>
    <div class="tile-content hide-xl">
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
    const driveDetails = ref([]);

    const drives = await axios.get(
      "http://testnet1.dfms.io:6366/api/v1/contract/ls"
    );
    drives.data.Ids.forEach(async (id) => {
      const resp = await Promise.all([
        axios.get(
          `${
            siriusStore.state.selectedNode
          }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
            id
          )}`
        ),
        axios.get(`http://testnet1.dfms.io:6366/api/v1/drive/ls?arg=${id}`),
      ]);

      resp[0].data.drive.Id = id;
      resp[0].data.drive.folders = 0;
      resp[0].data.drive.files = 0;

      if (resp[1].data.List) {
        resp[1].data.List.forEach((item) => {
          if (item.Type == "dir") {
            resp[0].data.drive.folders++;
          } else {
            resp[0].data.drive.files++;
          }
        });
      }

      driveDetails.value.push(resp[0].data.drive);
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
