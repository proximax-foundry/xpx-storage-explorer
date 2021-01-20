<template>
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
import { inject, onMounted, ref, watch } from "vue";
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
    const siriusStore = inject("siriusStore");
    const route = useRoute();
    const router = useRouter();
    const drives = ref(null);

    const fetchDrives = async (pageNumber) => {
      try {
        const resp = await axios.get(siriusStore.drivesHttp(pageNumber));

        if (pageNumber > resp.data.pagination.totalPages) {
          router.replace({
            path: "/drives",
            query: { pageNumber: resp.data.pagination.totalPages },
          });
          return;
        }

        if (resp.data.pagination.totalEntries > 0) {
          drives.value = resp.data;
        } else {
          drives.value = {
            err: "No drives found",
          };
        }
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
