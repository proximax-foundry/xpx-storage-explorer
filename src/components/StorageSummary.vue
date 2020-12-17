<template>
  <div class="card text-center">
    <div class="card-header">
      <div class="card-subtitle">
        <small class="text-bold">Used Storage</small>
      </div>
      <div class="card-title h4">{{ $filters.bytesToSize(storage) }}</div>
      <div class="card-subtitle">From {{ nodes }} nodes</div>
    </div>
    <div class="card-body bg-success m-2">
      <FontAwesomeIcon :icon="['fas', 'cloud-upload-alt']" size="lg" />
      Available Storage: <b>500 TB</b>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, ref } from "vue";
import { UInt64 } from "tsjs-xpx-chain-sdk";
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
    const nodes = ref(0);
    const storage = ref(0);

    const resp = await Promise.all([
      axios.get("http://testnet1.dfms.io:6366/api/v1/net/peers"),
      axios.get("http://testnet1.dfms.io:6366/api/v1/contract/ls"),
    ]);

    nodes.value = resp[0].data.Peers.length;
    resp[1].data.Ids.forEach(async (id) => {
      const driveDetails = await axios.get(
        `${
          siriusStore.state.selectedNode
        }/drive/${internalInstance.appContext.config.globalProperties.$helpers.cidToPublicKey(
          id
        )}`
      );
      storage.value += new UInt64(driveDetails.data.drive.size).compact();
    });

    return {
      nodes,
      storage,
    };
  },
};
</script>
