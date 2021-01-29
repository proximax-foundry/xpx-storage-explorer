<template>
  <div class="hero my-2">
    <div class="hero-body">
      <h4 v-if="driveInfo.state == 1" class="label label-rounded label-warning">
        Pending
      </h4>
      <h4
        v-else-if="driveInfo.state == 2"
        class="label label-rounded label-success"
      >
        Active
      </h4>
      <h4
        v-else-if="driveInfo.state == 3"
        class="label label-rounded label-error"
      >
        Completed
      </h4>
      <h4 v-else class="label label-rounded">Not Active</h4>
      <h2 class="text-break">{{ $route.params.cid[0] }}</h2>
      <div class="bar">
        <div
          class="bar-item"
          :style="`width:${Math.round(
            ($filters.numberArrayToCompact(driveInfo.occupiedSpace) /
              $filters.numberArrayToCompact(driveInfo.size)) *
              100
          )}%`"
        ></div>
      </div>
      <p>
        Storage:
        <b>
          {{
            $filters.bytesToSize(
              $filters.numberArrayToCompact(driveInfo.occupiedSpace)
            )
          }}
          of
          {{
            $filters.bytesToSize($filters.numberArrayToCompact(driveInfo.size))
          }}
        </b>
      </p>
      <div class="columns">
        <div class="column col-3 col-md-4">
          <div>Public Key:</div>
          <div class="text-bold text-ellipsis">
            <a
              :href="explorerPublicKeyHttp(driveInfo.multisig)"
              target="_blank"
            >
              {{ driveInfo.multisig }}
            </a>
          </div>
          <div>Owner:</div>
          <div class="text-bold text-ellipsis">
            <a :href="explorerPublicKeyHttp(driveInfo.owner)" target="_blank">
              {{ driveInfo.owner }}
            </a>
          </div>
        </div>
        <div class="column col-md-4">
          <div>Created:</div>
          <div class="text-bold">
            Block
            <a
              :href="
                explorerBlockHttp(
                  $filters.numberArrayToCompact(driveInfo.start)
                )
              "
              target="_blank"
            >
              {{ $filters.numberArrayToCompact(driveInfo.start) }}
            </a>
          </div>
          <div>Duration:</div>
          <div class="text-bold">
            {{ $filters.numberArrayToCompact(driveInfo.duration) }}
            Block(s) ({{
              $filters.blocksToDays(
                $filters.numberArrayToCompact(driveInfo.duration)
              )
            }})
          </div>
        </div>
        <div class="column col-md-4">
          <div>Billing Price:</div>
          <div class="text-bold">
            {{ $filters.numberArrayToCompact(driveInfo.billingPrice) }}
            SO
          </div>
          <div>Billing Period:</div>
          <div class="text-bold">
            {{ $filters.numberArrayToCompact(driveInfo.billingPeriod) }}
            Block(s) ({{
              $filters.blocksToDays(
                $filters.numberArrayToCompact(driveInfo.billingPeriod)
              )
            }})
          </div>
        </div>
        <div class="column col-md-4">
          <div>Min Replicators:</div>
          <div class="text-bold">{{ driveInfo.minReplicators }}</div>
          <div>Number of Replicators:</div>
          <div class="text-bold">{{ driveInfo.replicators.length }}</div>
        </div>
        <div class="column col-md-4">
          <div>Current Replicas:</div>
          <div class="text-bold">{{ driveInfo.replicas }}</div>
          <div>Percent Approvers:</div>
          <div class="text-bold">{{ driveInfo.percentApprovers }} %</div>
        </div>
        <div v-if="driveInfo.replicators.length > 0" class="column col-12">
          <div class="mt-2">Replicators:</div>
          <div class="columns text-bold">
            <div
              v-for="replicator in driveInfo.replicators"
              :key="replicator.replicator"
              class="column text-ellipsis"
            >
              <a
                :href="explorerPublicKeyHttp(replicator.replicator)"
                target="_blank"
              >
                {{ replicator.replicator }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  name: "DriveHero",
  props: {
    driveInfo: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const appStore = inject("appStore");

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
@import "spectre.css/src/hero";
@import "spectre.css/src/bars";

.hero {
  @include shadow-variant($unit-1);
  border-radius: $border-radius;
  background: $gray-color-light;
}

.bar {
  border-radius: 0;
  background: $gray-color;

  .bar-item {
    &:first-child,
    &:last-child {
      border-radius: 0;
    }
  }
}
</style>
