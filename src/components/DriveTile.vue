<template>
  <div class="tile tile-centered">
    <div class="tile-icon p-2">
      <figure class="avatar">
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" class="m-1" />
        <i
          v-if="drive.state == 1"
          class="avatar-presence away tooltip"
          data-tooltip="Pending"
        ></i>
        <i
          v-else-if="drive.state == 2"
          class="avatar-presence online tooltip"
          data-tooltip="Active"
        ></i>
        <i
          v-else-if="drive.state == 3"
          class="avatar-presence busy tooltip"
          data-tooltip="Completed"
        ></i>
        <i v-else class="avatar-presence tooltip" data-tooltip="Not Active"></i>
      </figure>
    </div>
    <div class="tile-content">
      <div class="tile-title h5">
        <router-link :to="{ name: 'Drive', params: { cid: [drive.Id] } }">
          {{ drive.Id.substr(0, 15) }}...
        </router-link>
      </div>
      <div class="tile-subtitle text-small">
        Owner:
        <b>{{ drive.owner.substr(0, 15) }}...</b>
      </div>
    </div>
    <div class="tile-content hide-lg">
      <div class="tile-title">
        Created:
        <b>Block {{ $filters.numberArrayToCompact(drive.start) }}</b>
      </div>
      <div class="tile=subtitle">
        Duration:
        <b>{{ $filters.numberArrayToCompact(drive.duration) }} Block(s)</b>
      </div>
    </div>
    <div class="tile-content hide-md">
      <div class="tile-title">
        Storage Used:
        <b>{{
          $filters.bytesToSize(
            $filters.numberArrayToCompact(drive.occupiedSpace)
          )
        }}</b>
      </div>
      <div class="tile=subtitle">
        Storage:
        <b>{{
          $filters.bytesToSize($filters.numberArrayToCompact(drive.size))
        }}</b>
      </div>
    </div>
    <div class="tile-content hide-lg">
      <div class="tile-title">
        Billing Price:
        <b>{{ $filters.numberArrayToCompact(drive.billingPrice) }} SO</b>
      </div>
      <div class="tile=subtitle">
        Billing Period:
        <b>
          {{ $filters.numberArrayToCompact(drive.billingPeriod) }}
          Block(s)
        </b>
      </div>
    </div>
    <div class="tile-content hide-xl">
      <div class="tile-title">
        Replicas:
        <b>{{ drive.replicas }}</b>
      </div>
      <div class="tile-subtitle">
        Approvers:
        <b>{{ drive.percentApprovers }} %</b>
      </div>
    </div>
    <div class="tile-action text-center mx-2">
      <div class="tile-title h5">{{ drive.count.folders }}</div>
      <div class="tile-subtitle text-small">Folder(s)</div>
    </div>
    <div class="tile-action text-center mx-2">
      <div class="tile-title h5">{{ drive.count.files }}</div>
      <div class="tile-subtitle text-small">File(s)</div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "DriveTile",
  components: {
    FontAwesomeIcon,
  },
  props: {
    drive: {
      type: Object,
      default: null,
    },
  },
  setup() {
    library.add(faHdd);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/mixins/shadow";
@import "spectre.css/src/mixins/text";
@import "spectre.css/src/mixins/avatar";
@import "spectre.css/src/tiles";
@import "spectre.css/src/avatars";
@import "spectre.css/src/tooltips";

.tile {
  @include shadow-variant($unit-o);
  padding: $unit-2;
  margin: $unit-4 0;
  border: $border-width solid $border-color;
}
</style>
