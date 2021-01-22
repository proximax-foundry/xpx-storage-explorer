<template>
  <div class="tile">
    <div class="tile-icon p-2">
      <figure
        v-if="drive.state == 1"
        class="avatar tooltip"
        data-tooltip="Pending"
      >
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" class="m-1" />
        <i class="avatar-presence away"></i>
      </figure>
      <figure
        v-else-if="drive.state == 2"
        class="avatar tooltip"
        data-tooltip="Active"
      >
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" class="m-1" />
        <i class="avatar-presence online"></i>
      </figure>
      <figure
        v-else-if="drive.state == 3"
        class="avatar tooltip"
        data-tooltip="Completed"
      >
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" class="m-1" />
        <i class="avatar-presence busy"></i>
      </figure>
      <figure v-else class="avatar tooltip" data-tooltip="Not Active">
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" class="m-1" />
        <i class="avatar-presence"></i>
      </figure>
    </div>
    <div class="tile-content text-ellipsis">
      <div class="tile-title h5 text-ellipsis">
        <router-link
          :to="{
            name: 'Drive',
            params: { cid: [$filters.publicKeyToCID(drive.multisig)] },
          }"
        >
          {{ $filters.publicKeyToCID(drive.multisig) }}
        </router-link>
        <div class="bar my-2">
          <div
            class="bar-item"
            :class="{
              'bg-warning':
                Math.round(
                  ($filters.numberArrayToCompact(drive.occupiedSpace) /
                    $filters.numberArrayToCompact(drive.size)) *
                    100
                ) > 50 &&
                Math.round(
                  ($filters.numberArrayToCompact(drive.occupiedSpace) /
                    $filters.numberArrayToCompact(drive.size)) *
                    100
                ) < 75,
              'bg-error':
                Math.round(
                  ($filters.numberArrayToCompact(drive.occupiedSpace) /
                    $filters.numberArrayToCompact(drive.size)) *
                    100
                ) >= 75,
            }"
            :style="`width:${Math.round(
              ($filters.numberArrayToCompact(drive.occupiedSpace) /
                $filters.numberArrayToCompact(drive.size)) *
                100
            )}%`"
          >
            {{
              $filters.bytesToSize(
                $filters.numberArrayToCompact(drive.occupiedSpace)
              )
            }}
            of
            {{
              $filters.bytesToSize($filters.numberArrayToCompact(drive.size))
            }}
          </div>
        </div>
      </div>
      <div class="tile-subtitle text-small">
        <div class="text-ellipsis">
          Owner:
          <a
            :href="explorerPublicKeyHttp(drive.owner)"
            class="text-bold"
            target="_blank"
          >
            {{ drive.owner }}
          </a>
        </div>
        <div>
          Created:
          <b>
            Block
            <a
              :href="
                explorerBlockHttp($filters.numberArrayToCompact(drive.start))
              "
              target="_blank"
            >
              {{ $filters.numberArrayToCompact(drive.start) }}
            </a>
          </b>
        </div>
        <div>
          Duration:
          <b>
            {{ $filters.numberArrayToCompact(drive.duration) }} Block(s) ({{
              $filters.blocksToDays(
                $filters.numberArrayToCompact(drive.duration)
              )
            }})
          </b>
        </div>
        <div>
          Billing Price:
          <b>{{ $filters.numberArrayToCompact(drive.billingPrice) }} SO</b>
        </div>
        <div>
          Billing Period:
          <b>
            {{ $filters.numberArrayToCompact(drive.billingPeriod) }}
            Block(s) ({{
              $filters.blocksToDays(
                $filters.numberArrayToCompact(drive.billingPeriod)
              )
            }})
          </b>
        </div>
        <div>
          Replicas:
          <b>{{ drive.replicas }}</b>
        </div>
        <div>
          Approvers:
          <b>{{ drive.percentApprovers }} %</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { inject } from "vue";

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
    const appStore = inject("appStore");
    library.add(faHdd);

    return {
      explorerBlockHttp: appStore.explorerBlockHttp,
      explorerPublicKeyHttp: appStore.explorerPublicKeyHttp,
    };
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
@import "spectre.css/src/bars";
@import "spectre.css/src/tooltips";

.tile {
  @include shadow-variant($unit-o);
  padding: $unit-2;
  margin: $unit-2 0;
  border: $border-width solid $border-color;
}

.bar {
  background: $gray-color;
}
</style>
