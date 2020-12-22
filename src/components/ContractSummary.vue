<template>
  <div class="card text-center">
    <div class="card-header">
      <div class="card-subtitle">
        <small class="text-bold">Drives</small>
      </div>
      <div class="card-title h4">
        {{ drives.total }}
      </div>
      <div class="card-subtitle">on Network</div>
    </div>
    <div class="card-body bg-success m-2">
      <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" />
      Active Contracts: <b>{{ drives.active }}</b>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, reactive } from "vue";
import axios from "axios";

library.add(faHdd);

export default {
  name: "ContractSummary",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const drives = reactive({
      total: 0,
      active: 0,
    });

    const contracts = await axios.get(
      "http://testnet1.dfms.io:6366/api/v1/contract/ls"
    );
    drives.total = contracts.data.Ids.length;

    contracts.data.Ids.forEach(async (id) => {
      const driveDetails = await axios.get(
        `${
          siriusStore.state.selectedNode
        }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
          id
        )}`
      );

      if (driveDetails.data.drive.state == 2) {
        drives.active++;
      }
    });

    return {
      drives,
    };
  },
};
</script>
