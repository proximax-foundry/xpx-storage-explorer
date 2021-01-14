<template>
  <LoadingState v-if="!storage" />
  <template v-else>
    <ErrorState v-if="storage.err" :err="storage.err" small-text="true" />
    <div v-else class="card text-center">
      <div class="card-header">
        <div class="card-subtitle">
          <small class="text-bold">Used Storage</small>
        </div>
        <div class="card-title h4">
          {{ $filters.bytesToSize(storage.used) }}
        </div>
        <div class="card-subtitle">on Network</div>
      </div>
      <div class="card-body bg-success m-2">
        <FontAwesomeIcon :icon="['fas', 'cloud-upload-alt']" size="lg" />
        Available Storage: <b>{{ $filters.bytesToSize(storage.available) }}</b>
      </div>
    </div>
  </template>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, onMounted, ref, watch } from "vue";
import axios from "axios";

library.add(faCloudUploadAlt);

export default {
  name: "StorageSummary",
  components: {
    ErrorState,
    FontAwesomeIcon,
    LoadingState,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const storage = ref(null);

    const loadDetails = async () => {
      try {
        const contracts = await axios.get(siriusStore.contractLsHttp);
        storage.value = {
          used: 0,
          available: 0,
        };

        contracts.data.Ids.forEach(async (id) => {
          try {
            const driveDetails = await axios.get(
              `${
                siriusStore.state.selectedChainNode
              }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
                id
              )}`
            );

            storage.value.available += internalInstance.appContext.config.globalProperties.$filters.numberArrayToCompact(
              driveDetails.data.drive.size
            );
            storage.value.used += internalInstance.appContext.config.globalProperties.$filters.numberArrayToCompact(
              driveDetails.data.drive.occupiedSpace
            );
          } catch (err) {
            console.error("Drive Contract (" + id + ") Error", err);
          }
        });
      } catch (err) {
        console.error("List Contracts Error", err);
        storage.value = {
          err: "Unable to fetch storage information from node",
        };
      }
    };

    onMounted(async () => {
      await loadDetails();
    });

    watch(
      () => [
        siriusStore.state.selectedChainNode,
        siriusStore.state.selectedStorageNode,
      ],
      async () => {
        storage.value = null;
        await loadDetails();
      }
    );

    return {
      storage,
    };
  },
};
</script>
