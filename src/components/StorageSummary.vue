<template>
  <div class="card text-center">
    <div class="card-header">
      <div class="card-subtitle">
        <small class="text-bold">Used Storage</small>
      </div>
      <div class="card-title h4">{{ $filters.bytesToSize(storage.used) }}</div>
      <div class="card-subtitle">on Network</div>
    </div>
    <div class="card-body bg-success m-2">
      <FontAwesomeIcon :icon="['fas', 'cloud-upload-alt']" size="lg" />
      Available Storage: <b>{{ $filters.bytesToSize(storage.available) }}</b>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, reactive } from "vue";
import axios from "axios";

library.add(faCloudUploadAlt);

export default {
  name: "StorageSummary",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const storage = reactive({
      used: 0,
      available: 0,
    });

    const contracts = await axios.get(siriusStore.contractLsHttp);

    contracts.data.Ids.forEach(async (id) => {
      const driveDetails = await axios.get(
        `${
          siriusStore.state.selectedChainNode
        }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
          id
        )}`
      );

      storage.available += internalInstance.appContext.config.globalProperties.$filters.numberArrayToCompact(
        driveDetails.data.drive.size
      );
      storage.used += internalInstance.appContext.config.globalProperties.$filters.numberArrayToCompact(
        driveDetails.data.drive.occupiedSpace
      );
    });

    return {
      storage,
    };
  },
};
</script>
