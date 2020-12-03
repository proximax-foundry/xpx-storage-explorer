<template>
  <div class="card text-center">
    <div class="card-header">
      <div class="card-subtitle">
        <small class="text-bold">Used Storage</small>
      </div>
      <div class="card-title h4">123.45 TB</div>
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
import { ref } from "vue";
import axios from "axios";

library.add(faCloudUploadAlt);

export default {
  name: "StorageSummary",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const nodes = ref(0);

    const resp = await axios.get("mock/testnet1.dfms.io/peers.json");
    nodes.value = resp.data.Peers.length;

    return {
      nodes,
    };
  },
};
</script>
