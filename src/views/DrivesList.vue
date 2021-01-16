<template>
  <LoadingState v-if="!drives" />
  <ErrorState v-else-if="drives.err" :err="drives.err" />
  <template v-else>
    <DriveTile
      v-for="item in drives.data"
      :key="item.drive.Id"
      :drive="item.drive"
    />
    <DrivesPagination :pagination="drives.pagination" />
  </template>
</template>

<script>
import DriveTile from "@/components/DriveTile.vue";
import DrivesPagination from "@/components/DrivesPagination.vue";
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import { getCurrentInstance, inject, onMounted, ref, watch } from "vue";
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
    const siriusStore = inject("siriusStore");
    const route = useRoute();
    const router = useRouter();
    const drives = ref(null);

    const fetchDrives = async (pageNumber) => {
      try {
        const resp = await axios.get(`
          ${siriusStore.state.selectedChainNode}/drives${
          pageNumber ? "?pageNumber=" + pageNumber : ""
        }`);

        if (pageNumber > resp.data.pagination.totalPages) {
          router.replace({
            path: "/drives",
            query: { pageNumber: resp.data.pagination.totalPages },
          });
          return;
        }

        resp.data.data.forEach(async (drive) => {
          drive.drive.Id = internalInstance.appContext.config.globalProperties.$filters.publicKeyToCID(
            drive.drive.multisig
          );
          drive.drive.count = {
            folders: 0,
            files: 0,
          };

          if (drive.drive.state == 1 || drive.drive.state == 2) {
            try {
              const resp = await axios.get(
                siriusStore.driveLsHttp(drive.drive.Id)
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
            } catch (err) {
              console.error("Drives List Error", err);
            }
          }
        });

        drives.value = resp.data;
      } catch (err) {
        console.error("Drives Error", err);
        drives.value = {
          err: "Unable to fetch list of drives from node",
        };
      }
    };

    onMounted(async () => {
      await fetchDrives(route.query["pageNumber"]);
    });

    watch(
      () => [
        siriusStore.state.selectedChainNode,
        siriusStore.state.selectedStorageNode,
        route.query["pageNumber"],
      ],
      async () => {
        drives.value = null;
        await fetchDrives(route.query["pageNumber"]);
      }
    );

    return {
      drives,
    };
  },
};
</script>
