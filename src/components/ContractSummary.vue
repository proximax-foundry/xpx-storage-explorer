<template>
  <div class="card text-center">
    <div class="card-header">
      <div class="card-subtitle">
        <small class="text-bold">Drives</small>
      </div>
      <div class="card-title h4">
        {{ drives }}
      </div>
      <div class="card-subtitle">Online Nodes: {{ nodes }}</div>
    </div>
    <div class="card-body bg-success m-2">
      <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" />
      Active Contracts: <b>{{ drives }}</b>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import axios from "axios";

library.add(faHdd);

export default {
  name: "ContractSummary",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const drives = ref(0);
    const nodes = ref(0);

    const resp = await Promise.all([
      axios.get("http://testnet1.dfms.io:6366/api/v1/contract/ls"),
      axios.get("http://testnet1.dfms.io:6366/api/v1/net/peers"),
    ]);

    drives.value = resp[0].data.Ids.length;
    nodes.value = resp[1].data.Peers.length;

    return {
      drives,
      nodes,
    };
  },
};
</script>
