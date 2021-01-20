<template>
  <div
    class="hero my-2"
    :class="{
      'bg-warning': driveInfo.state == 1,
      'bg-success': driveInfo.state == 2,
      'bg-error': driveInfo.state == 3,
    }"
  >
    <div class="hero-body">
      <h4 v-if="driveInfo.state == 1">Pending</h4>
      <h4 v-else-if="driveInfo.state == 2">Active</h4>
      <h4 v-else-if="driveInfo.state == 3">Completed</h4>
      <h4 v-else>Not Active</h4>
      <h1 class="text-ellipsis">{{ $route.params.cid[0] }}</h1>
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
            {{ driveInfo.multisig }}
          </div>
          <div>Owner:</div>
          <div class="text-bold text-ellipsis">
            {{ driveInfo.owner }}
          </div>
        </div>
        <div class="column col-md-4">
          <div>Created:</div>
          <div class="text-bold">
            Block {{ $filters.numberArrayToCompact(driveInfo.start) }}
          </div>
          <div>Duration:</div>
          <div class="text-bold">
            {{ $filters.numberArrayToCompact(driveInfo.duration) }}
            Block(s)
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
            Block(s)
          </div>
        </div>
        <div class="column col-md-4">
          <div>Min Replicators:</div>
          <div class="text-bold">{{ driveInfo.minReplicators }}</div>
          <div>Replicators:</div>
          <div class="text-bold">{{ driveInfo.replicators.length }}</div>
        </div>
        <div class="column col-md-4">
          <div>Current Replicas:</div>
          <div class="text-bold">{{ driveInfo.replicas }}</div>
          <div>Percent Approvers:</div>
          <div class="text-bold">{{ driveInfo.percentApprovers }} %</div>
        </div>
        <div v-if="driveInfo.replicators.length > 0" class="column col-12">
          <div class="columns mt-2">
            <div class="column col-auto">Replicators:</div>
            <div
              v-for="replicator in driveInfo.replicators"
              :key="replicator.replicator"
              class="column text-bold text-ellipsis"
            >
              {{ replicator.replicator }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DriveHero",
  props: {
    driveInfo: {
      type: Object,
      default: null,
    },
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
  background: $gray-color;
}
</style>
