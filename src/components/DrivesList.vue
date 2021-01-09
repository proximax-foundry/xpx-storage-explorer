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
  <ul class="pagination">
    <template v-if="drives.data.pagination.totalPages < 11">
      <li
        class="page-item"
        :class="{ disabled: drives.data.pagination.pageNumber == 1 }"
      >
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber:
                drives.data.pagination.pageNumber == 1
                  ? 1
                  : drives.data.pagination.pageNumber - 1,
            },
          }"
          class="btn btn-link"
          >Prev</router-link
        >
      </li>
      <li
        v-for="n in drives.data.pagination.totalPages"
        :key="n"
        class="page-item"
        :class="{ active: n == drives.data.pagination.pageNumber }"
      >
        <router-link
          :to="{ path: '/drives', query: { pageNumber: n } }"
          class="btn btn-link"
          >{{ n }}</router-link
        >
      </li>
      <li
        class="page-item"
        :class="{
          disabled:
            drives.data.pagination.pageNumber ==
            drives.data.pagination.totalPages,
        }"
      >
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber:
                drives.data.pagination.pageNumber ==
                drives.data.pagination.totalPages
                  ? drives.data.pagination.totalPages
                  : drives.data.pagination.pageNumber + 1,
            },
          }"
          class="btn btn-link"
          >Next</router-link
        >
      </li>
    </template>
    <template v-else-if="drives.data.pagination.pageNumber == 1">
      <li class="page-item disabled">
        <router-link
          :to="{ path: '/drives', query: { pageNumber: 1 } }"
          class="btn btn-link"
          >Prev</router-link
        >
      </li>
      <li class="page-item active">
        <router-link
          :to="{ path: '/drives', query: { pageNumber: 1 } }"
          class="btn btn-link"
          >1</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{ path: '/drives', query: { pageNumber: 2 } }"
          class="btn btn-link"
          >2</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{ path: '/drives', query: { pageNumber: 3 } }"
          class="btn btn-link"
          >3</router-link
        >
      </li>
      <li class="page-item">
        <span>...</span>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.totalPages },
          }"
          class="btn btn-link"
          >{{ drives.data.pagination.totalPages }}</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{ path: '/drives', query: { pageNumber: 2 } }"
          class="btn btn-link"
          >Next</router-link
        >
      </li>
    </template>
    <template
      v-else-if="
        drives.data.pagination.pageNumber == drives.data.pagination.totalPages
      "
    >
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.pageNumber - 1 },
          }"
          class="btn btn-link"
          >Prev</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{ path: '/drives', query: { pageNumber: 1 } }"
          class="btn btn-link"
          >1</router-link
        >
      </li>
      <li class="page-item">
        <span>...</span>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.pageNumber - 2 },
          }"
          class="btn btn-link"
          >{{ drives.data.pagination.pageNumber - 2 }}</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.pageNumber - 1 },
          }"
          class="btn btn-link"
          >{{ drives.data.pagination.pageNumber - 1 }}</router-link
        >
      </li>
      <li class="page-item active">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.totalPages },
          }"
          class="btn btn-link"
          >{{ drives.data.pagination.totalPages }}</router-link
        >
      </li>
      <li class="page-item disabled">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.totalPages },
          }"
          class="btn btn-link"
          >Next</router-link
        >
      </li>
    </template>
    <template v-else>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.pageNumber - 1 },
          }"
          class="btn btn-link"
          >Prev</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{ path: '/drives', query: { pageNumber: 1 } }"
          class="btn btn-link"
          >1</router-link
        >
      </li>
      <li v-if="drives.data.pagination.pageNumber > 3" class="page-item">
        <span>...</span>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.pageNumber - 1 },
          }"
          class="btn btn-link"
          >{{ drives.data.pagination.pageNumber - 1 }}</router-link
        >
      </li>
      <li class="page-item active">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.pageNumber },
          }"
          class="btn btn-link"
        >
          {{ drives.data.pagination.pageNumber }}
        </router-link>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.pageNumber + 1 },
          }"
          class="btn btn-link"
        >
          {{ drives.data.pagination.pageNumber + 1 }}
        </router-link>
      </li>
      <li
        v-if="
          drives.data.pagination.pageNumber <
          drives.data.pagination.totalPages - 2
        "
        class="page-item"
      >
        <span>...</span>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.totalPages },
          }"
          class="btn btn-link"
        >
          {{ drives.data.pagination.totalPages }}
        </router-link>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: drives.data.pagination.pageNumber + 1 },
          }"
          class="btn btn-link"
        >
          Next
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
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
    const route = useRoute();
    const router = useRouter();
    const drives = ref(null);

    const fetchDrives = async (pageNumber) => {
      drives.value = await axios.get(`
        ${siriusStore.state.selectedChainNode}/drives${
        pageNumber ? "?pageNumber=" + pageNumber : ""
      }`);

      if (pageNumber > drives.value.data.pagination.totalPages) {
        router.replace({
          path: "/drives",
          query: { pageNumber: drives.value.data.pagination.totalPages },
        });
        return;
      }

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
    };

    watch(
      () => route.query["pageNumber"],
      async (newPageNumber) => {
        await fetchDrives(newPageNumber);
      }
    );

    await fetchDrives(route.query["pageNumber"]);
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
@import "spectre.css/src/pagination";

.tile {
  @include shadow-variant($unit-o);
  padding: $unit-2;
  margin: $unit-4 0;
  border: $border-width solid $border-color;
}

.pagination {
  justify-content: center;
}
</style>
