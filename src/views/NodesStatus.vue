<template>
  <div class="card my-2">
    <div class="card-header">
      <div class="card-title h5 text-ellipsis">Blockchain Node</div>
    </div>
    <div class="card-body">
      <LoadingState v-if="!chainNodeDetail" />
      <ErrorState v-else-if="chainNodeDetail.err" :err="chainNodeDetail.err" />
      <NodeStatusTable v-else :node-detail="chainNodeDetail" />
    </div>
  </div>
  <div class="card my-2">
    <div class="card-header">
      <div class="card-title h5 text-ellipsis">Storage Node</div>
    </div>
    <div class="card-body">
      <LoadingState v-if="!storageNodeDetail" />
      <ErrorState
        v-else-if="storageNodeDetail.err"
        :err="storageNodeDetail.err"
      />
      <NodeStatusTable v-else :node-detail="storageNodeDetail" storage />
    </div>
  </div>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import NodeStatusTable from "@/components/NodeStatusTable.vue";
import { inject, onMounted, ref, watch } from "vue";
import axios from "axios";

export default {
  name: "NodesStatus",
  components: {
    ErrorState,
    LoadingState,
    NodeStatusTable,
  },
  setup() {
    const siriusStore = inject("siriusStore");
    const chainNodeDetail = ref(null);
    const storageNodeDetail = ref(null);

    const loadChainNodeDetails = async () => {
      try {
        const resp = await Promise.all([
          axios.get(siriusStore.state.selectedChainNode + "/node/info"),
          axios.get(siriusStore.state.selectedChainNode + "/diagnostic/server"),
          axios.get(
            siriusStore.state.selectedChainNode + "/diagnostic/storage"
          ),
        ]);

        chainNodeDetail.value = {
          ...resp[0].data,
          ...resp[1].data,
          ...resp[2].data,
        };
        chainNodeDetail.value.ping = 0;

        for (let i = 0; i < 5; i++) {
          const start = new Date();
          await fetch(siriusStore.state.selectedChainNode + "/chain/height", {
            mode: "no-cors",
          });
          chainNodeDetail.value.ping += new Date() - start;
        }
        chainNodeDetail.value.ping /= 5;
      } catch (err) {
        console.error("Chain Node Status Error", err);
        chainNodeDetail.value = {
          err: "Unable to fetch details from selected chain node",
        };
      }
    };

    const loadStorageNodeDetails = async () => {
      try {
        const resp = await Promise.all([
          axios.get(siriusStore.netIdHttp),
          axios.get(siriusStore.versionHttp),
          axios.get(siriusStore.keyHttp),
        ]);

        storageNodeDetail.value = {
          ...resp[0].data,
          ...resp[1].data,
          ...resp[2].data,
        };
        storageNodeDetail.value.type =
          siriusStore.state.selectedStorageNodeType;
        storageNodeDetail.value.ping = 0;

        for (let i = 0; i < 5; i++) {
          const start = new Date();
          await fetch(siriusStore.netIdHttp, { mode: "no-cors" });
          storageNodeDetail.value.ping += new Date() - start;
        }
        storageNodeDetail.value.ping /= 5;
      } catch (err) {
        console.error("Storage Node Status Error", err);
        storageNodeDetail.value = {
          err: "Unable to fetch details from selected storage node",
        };
      }
    };

    onMounted(async () => {
      await Promise.all([loadChainNodeDetails(), loadStorageNodeDetails()]);
    });

    watch(
      () => siriusStore.state.selectedChainNode,
      async () => {
        chainNodeDetail.value = null;
        await loadChainNodeDetails();
      }
    );

    watch(
      () => siriusStore.state.selectedStorageNode,
      async () => {
        storageNodeDetail.value = null;
        await loadStorageNodeDetails();
      }
    );

    return {
      chainNodeDetail,
      storageNodeDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";

.card {
  full-width: $size-md;
}

.table {
  table-layout: fixed;

  td:first-child {
    width: 25%;
  }
}
</style>
