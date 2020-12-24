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
      <div class="tile tile-centered">
        <div class="tile-content">
          <div class="tile-title">
            Public Key:
            <b>{{ driveDetails.multisig.substr(0, 15) }}...</b>
          </div>
          <div class="tile-subtitle">
            Owner:
            <b>{{ driveDetails.owner.substr(0, 15) }}...</b>
          </div>
        </div>
        <div class="tile-content">
          <div class="tile-title">
            Created: Block
            <b>{{ $filters.numberArrayToCompact(driveDetails.start) }}</b>
          </div>
          <div class="tile-subtitle">
            Duration:
            <b>{{ $filters.numberArrayToCompact(driveDetails.duration) }}</b>
            Block(s)
          </div>
        </div>
        <div class="tile-content">
          <div class="tile-title">
            Storage Used:
            <b>{{
              $filters.bytesToSize(
                $filters.numberArrayToCompact(driveDetails.occupiedSpace)
              )
            }}</b>
          </div>
          <div class="tile-subtitle">
            Storage:
            <b>{{
              $filters.bytesToSize(
                $filters.numberArrayToCompact(driveDetails.size)
              )
            }}</b>
          </div>
        </div>
        <div class="tile-content">
          <div class="tile-title">
            Billing Price:
            <b>{{
              $filters.numberArrayToCompact(driveDetails.billingPrice)
            }}</b>
            SO
          </div>
          <div class="tile-subtitle">
            Billing Period:
            <b>{{
              $filters.numberArrayToCompact(driveDetails.billingPeriod)
            }}</b>
            Block(s)
          </div>
        </div>
        <div class="tile-content">
          <div class="tile-title">
            Min Replicators: <b>{{ driveDetails.minReplicators }}</b>
          </div>
          <div class="tile-subtitle">
            Replicators: <b>{{ driveDetails.replicators.length }}</b>
          </div>
        </div>
        <div class="tile-content">
          <div class="tile-title">
            Current Replicas: <b>{{ driveDetails.replicas }}</b>
          </div>
          <div class="tile-subtitle">
            Percent Approvers: <b>{{ driveDetails.percentApprovers }} %</b>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="driveDetails.Files.length == 0 && driveDetails.Folders.length == 0"
    class="empty"
  >
    <div class="empty-title h5">No Folders or Files</div>
  </div>
  <div v-else class="columns my-2">
    <div class="column col-12 divider" data-content="Browse"></div>
    <div
      v-if="driveDetails.Folders.length > 0"
      class="accordion mt-2 column col-6 col-md-12"
    >
      <input
        id="accordion-folders"
        type="checkbox"
        name="accordion-checkbox"
        hidden
      />
      <label class="accordion-header" for="accordion-folders">
        <i class="icon icon-arrow-right mr-1"></i>
        <FontAwesomeIcon
          :icon="['fas', 'folder-open']"
          size="lg"
          class="mr-2"
        />
        Folder(s)
      </label>
      <div class="accordion-body">
        <ul class="menu menu-nav">
          <li
            v-for="item in driveDetails.Folders"
            :key="item.Cid"
            class="menu-item tile tile-centered"
          >
            <div class="tile-content text-ellipsis">
              <div class="tile-title h5">
                <router-link
                  :to="{
                    name: 'Drive Details',
                    params: { cid: $route.params.cid.concat(item.Name) },
                  }"
                >
                  {{ item.Name }}
                </router-link>
              </div>
              <div class="tile-subtitle text-gray">
                Cid:
                <b>{{ item.Cid["/"] }}</b>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="driveDetails.Files.length > 0"
      class="accordion mt-2 column col-6 col-md-12"
    >
      <input
        id="accordion-files"
        type="checkbox"
        name="accordion-checkbox"
        hidden
      />
      <label class="accordion-header" for="accordion-files">
        <i class="icon icon-arrow-right mr-1"></i>
        <FontAwesomeIcon :icon="['fas', 'file-alt']" size="lg" class="mr-2" />
        File(s)
      </label>
      <div class="accordion-body">
        <ul class="menu menu-nav">
          <li
            v-for="item in driveDetails.Files"
            :key="item.Cid"
            class="menu-item tile tile-centered"
          >
            <div class="tile-content text-ellipsis">
              <div class="tile-title h5">
                {{ item.Name }}
              </div>
              <div class="tile-subtitle text-gray">
                Cid:
                <b>{{ item.Cid["/"].substr(0, 15) }}...</b>
                · Size:
                <b>{{ $filters.bytesToSize(item.Size) }}</b>
              </div>
            </div>
            <div class="tile-action">
              <a
                class="btn btn-link"
                :href="`http://testnet1.dfms.io:6366/api/v1/drive/file?arg=${$route.params.cid[0]}&arg=${item.Cid['/']}`"
                :download="item.Name"
              >
                <i class="icon icon-download"></i>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHdd,
  faFolderOpen,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

library.add(faHdd, faFolderOpen, faFileAlt);

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
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/mixins/shadow";
@import "spectre.css/src/mixins/text";
@import "spectre.css/src/accordions";
@import "spectre.css/src/breadcrumbs";
@import "spectre.css/src/hero";
@import "spectre.css/src/menus";
@import "spectre.css/src/tiles";

.divider {
  border-top: $border-width solid $secondary-color;

  &[data-content]::after {
    color: $primary-color;
  }
}

.hero {
  @include shadow-variant($unit-1);
}
</style>
