<template>
  <ul class="breadcrumb my-2">
    <li
      v-for="(item, index) in $route.params.cid"
      :key="item"
      class="breadcrumb-item"
    >
      <FontAwesomeIcon
        v-if="index == 0"
        :icon="['fas', 'hdd']"
        size="lg"
        class="mr-2"
      />
      <router-link
        :to="{
          name: 'Drive Details',
          params: { cid: $route.params.cid.slice(0, index + 1) },
        }"
      >
        {{ item.substr(0, 15) }}
      </router-link>
    </li>
  </ul>
  <div
    class="hero my-2"
    :class="{
      'bg-gray': driveDetails.state == 0,
      'bg-warning': driveDetails.state == 1,
      'bg-success': driveDetails.state == 2,
      'bg-error': driveDetails.state == 3,
    }"
  >
    <div class="hero-body">
      <div v-if="driveDetails.state == 1">Pending</div>
      <div v-else-if="driveDetails.state == 2">Active</div>
      <div v-else-if="driveDetails.state == 3">Completed</div>
      <div v-else>Not Active</div>
      <h1 class="text-ellipsis">{{ $route.params.cid[0] }}</h1>
      <ul>
        <li class="text-ellipsis">
          Public Key: <b>{{ driveDetails.multisig }}</b>
        </li>
        <li class="text-ellipsis">
          Owner: <b>{{ driveDetails.owner }}</b>
        </li>
        <li>
          Created: Block
          <b>{{ $filters.numberArrayToCompact(driveDetails.start) }}</b>
        </li>
        <li>
          Duration:
          <b>{{ $filters.numberArrayToCompact(driveDetails.duration) }}</b>
          Block(s)
        </li>
        <li>
          Storage Used:
          <b>{{
            $filters.bytesToSize(
              $filters.numberArrayToCompact(driveDetails.occupiedSpace)
            )
          }}</b>
        </li>
        <li>
          Storage:
          <b>{{
            $filters.bytesToSize(
              $filters.numberArrayToCompact(driveDetails.size)
            )
          }}</b>
        </li>
        <li>
          Billing Price:
          <b>{{ $filters.numberArrayToCompact(driveDetails.billingPrice) }}</b>
          SO
        </li>
        <li>
          Billing Period:
          <b>{{ $filters.numberArrayToCompact(driveDetails.billingPeriod) }}</b>
          Block(s)
        </li>
        <li>
          Min Replicators: <b>{{ driveDetails.minReplicators }}</b>
        </li>
        <li>
          Replicators: <b>{{ driveDetails.replicators.length }}</b>
        </li>
        <li>
          Current Replicas: <b>{{ driveDetails.replicas }}</b>
        </li>
        <li>
          Percent Approvers: <b>{{ driveDetails.percentApprovers }} %</b>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="driveDetails.Folders.length > 0" class="columns mx-2">
    <div class="column col-12 p-2 text-bold">Folders</div>
    <div
      v-for="item in driveDetails.Folders"
      :key="item.Cid"
      class="column card mb-2 mr-2 p-0"
    >
      <div class="card-header">
        <div class="card-title h5">
          <router-link
            :to="{
              name: 'Drive Details',
              params: { cid: $route.params.cid.concat(item.Name) },
            }"
          >
            {{ item.Name }}
          </router-link>
        </div>
      </div>
      <div class="card-body">
        <div>Cid:</div>
        <div class="text-bold">{{ item.Cid["/"] }}</div>
      </div>
    </div>
  </div>
  <div v-if="driveDetails.Files.length > 0" class="columns mx-2">
    <div class="column col-12 p-2 text-bold">Files</div>
    <div
      v-for="item in driveDetails.Files"
      :key="item.Cid"
      class="column card mb-2 mr-2 p-0"
    >
      <div class="card-header">
        <div class="card-title h5">
          <router-link
            :to="{
              name: 'Drive Details',
              params: { cid: $route.params.cid.concat(item.Name) },
            }"
          >
            {{ item.Name }}
          </router-link>
        </div>
      </div>
      <div class="card-body">
        <div>Cid:</div>
        <div class="text-bold">{{ item.Cid["/"] }}</div>
      </div>
    </div>
  </div>
  <div
    v-if="driveDetails.Files.length == 0 && driveDetails.Folders.length == 0"
    class="columns mx-2"
  >
    <div class="column empty">
      <div class="empty-title h5">No Folders or Files</div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

library.add(faHdd);

export default {
  name: "DriveState",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const route = useRoute();
    const driveDetails = ref(null);
    const removeDrivePath = (accumulator, currentValue, currentIndex) =>
      currentIndex == 1 ? currentValue : accumulator + `/${currentValue}`;

    const contractDetails = await axios.get(
      `${
        siriusStore.state.selectedNode
      }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
        route.params.cid[0]
      )}`
    );

    const files = new Array();
    const folders = new Array();

    const driveData = await axios.get(
      `http://testnet1.dfms.io:6366/api/v1/drive/ls?arg=${route.params.cid[0]}${
        route.params.cid.length > 1
          ? "&arg=" + route.params.cid.reduce(removeDrivePath)
          : ""
      }`
    );

    if (driveData.data.List) {
      driveData.data.List.forEach((item) => {
        if (item.Type == "file") {
          files.push(item);
        } else {
          folders.push(item);
        }
      });
    }

    driveDetails.value = contractDetails.data.drive;
    driveDetails.value.Files = files;
    driveDetails.value.Folders = folders;

    return {
      driveDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";
@import "spectre.css/src/mixins/shadow";
@import "spectre.css/src/hero";
@import "spectre.css/src/breadcrumbs";

.hero {
  @include shadow-variant($unit-1);
}

ul {
  list-style-type: none;
}
</style>
