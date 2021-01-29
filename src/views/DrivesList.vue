<template>
  <ul class="tab tab-block my-2">
    <li class="tab-item" :class="{ active: !appStore.state.browseStorageNode }">
      <button class="btn btn-link" @click="switchTab(false)">Network</button>
    </li>
    <li class="tab-item" :class="{ active: appStore.state.browseStorageNode }">
      <button class="btn btn-link" @click="switchTab(true)">
        Selected Node
      </button>
    </li>
    <li class="tab-item tab-action">
      <div class="input-group input-inline">
        <span class="input-group-addon">Results per page</span>
        <select
          class="form-select"
          @change="updatePageSize($event.target.value)"
        >
          <option :selected="$route.query['pageSize'] == 24" :value="24">
            24
          </option>
          <option :selected="$route.query['pageSize'] == 48" :value="48">
            48
          </option>
          <option :selected="$route.query['pageSize'] == 72" :value="72">
            72
          </option>
          <option :selected="$route.query['pageSize'] == 96" :value="96">
            96
          </option>
        </select>
      </div>
    </li>
  </ul>
  <LoadingState v-if="!drives" />
  <ErrorState v-else-if="drives.err" :err="drives.err" />
  <div v-else class="columns">
    <div
      v-for="item in drives.data"
      :key="item.drive.multisig"
      class="column col-4 col-md-6 col-sm-12"
    >
      <DriveTile :drive="item.drive" />
    </div>
    <div class="column col-12">
      <DrivesPagination :pagination="drives.pagination" />
    </div>
  </div>
</template>

<script>
import DriveTile from "@/components/DriveTile.vue";
import DrivesPagination from "@/components/DrivesPagination.vue";
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "DrivesList",
  components: {
    DriveTile,
    DrivesPagination,
    ErrorState,
    LoadingState,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const route = useRoute();
    const router = useRouter();
    const chainDrives = ref(null);
    const storageDrives = ref(null);
    const drives = computed(() =>
      appStore.state.browseStorageNode ? storageDrives.value : chainDrives.value
    );

    const updatePageSize = (val) => {
      router.replace({
        path: "/drives",
        query: {
          pageSize: val,
          pageNumber: route.query["pageNumber"],
        },
      });
    };

    const fetchChainDrives = async () => {
      try {
        const resp = await axios.get(
          siriusStore.drivesHttp(
            route.query["pageSize"],
            route.query["pageNumber"]
          )
        );

        if (route.query["pageNumber"] > resp.data.pagination.totalPages) {
          router.replace({
            path: "/drives",
            query: {
              pageSize: route.query["pageSize"],
              pageNumber: resp.data.pagination.totalPages,
            },
          });
          return;
        }

        if (resp.data.pagination.totalEntries > 0) {
          chainDrives.value = resp.data;
        } else {
          chainDrives.value = {
            err: "No drives found",
          };
        }
      } catch (err) {
        console.error("Drives Error", err);
        chainDrives.value = {
          err: "Unable to fetch list of drives from chain node",
        };
      }
    };

    const fetchStorageDrives = async () => {
      try {
        const resp = await axios.get(siriusStore.contractLsHttp);

        if (resp.data.Ids.length > 0) {
          storageDrives.value = {
            data: [],
            pagination: {
              totalEntries: resp.data.Ids.length,
              pageNumber: 1,
              pageSize: 24,
              totalPages: 1,
            },
          };
          resp.data.Ids.forEach(async (id) => {
            try {
              const drive = await axios.get(
                siriusStore.driveHttp(
                  internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
                    id
                  )
                )
              );

              storageDrives.value.data.push(drive.data);
            } catch (err) {
              console.error("Drive Error", err);
            }
          });
        } else {
          storageDrives.value = {
            err: "No drives found",
          };
        }
      } catch (err) {
        console.error("Contract List Error", err);
        storageDrives.value = {
          err: "Unable to fetch list of drives from storage node",
        };
      }
    };

    const switchTab = async (storageTab) => {
      appStore.setBrowseMode(storageTab);

      if (!appStore.state.browseStorageNode) {
        if (
          (route.query["pageNumber"] &&
            chainDrives.value.pagination.pageNumber !=
              route.query["pageNumber"]) ||
          (route.query["pageSize"] &&
            chainDrives.value.pagination.pageSize != route.query["pageSize"])
        ) {
          chainDrives.value = null;
          await fetchChainDrives();
        }
      }
    };

    onMounted(async () => {
      await Promise.all([fetchChainDrives(), fetchStorageDrives()]);
    });

    watch(
      () => siriusStore.state.selectedChainNode,
      async () => {
        chainDrives.value = null;
        await fetchChainDrives();
      }
    );

    watch(
      () => siriusStore.state.selectedStorageNode,
      async () => {
        storageDrives.value = null;
        await fetchStorageDrives();
      }
    );

    watch(
      () => [route.query["pageSize"], route.query["pageNumber"]],
      async () => {
        if (!appStore.state.browseStorageNode) {
          chainDrives.value = null;
          await fetchChainDrives();
        }
      }
    );

    return {
      appStore,
      drives,
      switchTab,
      updatePageSize,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/tabs";

.tab {
  .tab-item {
    .btn {
      border-radius: 0;
      width: 100%;
      text-decoration: none;
    }

    &.active .btn {
      color: $primary-color;
      font-weight: bold;
      border-bottom-color: $primary-color;
    }
  }

  &.tab-block {
    .tab-action {
      flex: 0 0 auto;
      text-align: right;
    }
  }
}
</style>
