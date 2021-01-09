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
      <div class="columns">
        <div class="column col-3 col-md-4">
          <div>Public Key:</div>
          <div class="text-bold text-ellipsis">{{ driveDetails.multisig }}</div>
          <div>Owner:</div>
          <div class="text-bold text-ellipsis">{{ driveDetails.owner }}</div>
        </div>
        <div class="column col-md-4">
          <div>Created:</div>
          <div class="text-bold">
            Block {{ $filters.numberArrayToCompact(driveDetails.start) }}
          </div>
          <div>Duration:</div>
          <div class="text-bold">
            {{ $filters.numberArrayToCompact(driveDetails.duration) }}
            Block(s)
          </div>
        </div>
        <div class="column col-md-4">
          <div>Storage Used:</div>
          <div class="text-bold">
            {{
              $filters.bytesToSize(
                $filters.numberArrayToCompact(driveDetails.occupiedSpace)
              )
            }}
          </div>
          <div>Storage:</div>
          <div class="text-bold">
            {{
              $filters.bytesToSize(
                $filters.numberArrayToCompact(driveDetails.size)
              )
            }}
          </div>
        </div>
        <div class="column col-md-4">
          <div>Billing Price:</div>
          <div class="text-bold">
            {{ $filters.numberArrayToCompact(driveDetails.billingPrice) }}
            SO
          </div>
          <div>Billing Period:</div>
          <div class="text-bold">
            {{ $filters.numberArrayToCompact(driveDetails.billingPeriod) }}
            Block(s)
          </div>
        </div>
        <div class="column col-md-4">
          <div>Min Replicators:</div>
          <div class="text-bold">{{ driveDetails.minReplicators }}</div>
          <div>Replicators:</div>
          <div class="text-bold">{{ driveDetails.replicators.length }}</div>
        </div>
        <div class="column col-md-4">
          <div>Current Replicas:</div>
          <div class="text-bold">{{ driveDetails.replicas }}</div>
          <div>Percent Approvers:</div>
          <div class="text-bold">{{ driveDetails.percentApprovers }} %</div>
        </div>
        <div v-if="driveDetails.replicators.length > 0" class="column col-12">
          <div class="columns mt-2">
            <div class="column col-auto">Replicators:</div>
            <div
              v-for="replicator in driveDetails.replicators"
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

    const resp = await Promise.all([
      axios.get(
        `${
          siriusStore.state.selectedChainNode
        }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
          route.params.cid[0]
        )}`
      ),
      axios.get(
        `http://testnet1.dfms.io:6366/api/v1/drive/ls?arg=${
          route.params.cid[0]
        }${
          route.params.cid.length > 1
            ? "&arg=" + route.params.cid.reduce(removeDrivePath)
            : ""
        }`
      ),
    ]);

    const files = new Array();
    const folders = new Array();

    if (resp[1].data.List) {
      resp[1].data.List.forEach((item) => {
        if (item.Type == "file") {
          files.push(item);
        } else {
          folders.push(item);
        }
      });
    }

    driveDetails.value = resp[0].data.drive;
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
  background: $gray-color;
}
</style>
