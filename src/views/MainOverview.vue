<template>
  <div class="columns">
    <div class="column col-4">
      <LoadingState v-if="!blockInfo" />
      <ErrorState v-else-if="blockInfo.err" :err="blockInfo.err" small-text />
      <BlockCard v-else :block-info="blockInfo" />
    </div>
    <div class="column col-4">
      <LoadingState v-if="!storageInfo" />
      <ErrorState
        v-else-if="storageInfo.err"
        :err="storageInfo.err"
        small-text
      />
      <StorageCard v-else :storage-info="storageInfo" />
    </div>
    <div class="column col-4">
      <LoadingState v-if="!contractInfo" />
      <ErrorState
        v-else-if="contractInfo.err"
        :err="contractInfo.err"
        small-text
      />
      <ContractCard v-else :contract-info="contractInfo" />
    </div>
    <div class="column col-12">
      <div class="text-center">
        <h3>Peer Nodes</h3>
        <router-link to="/peers" class="btn btn-link">View All</router-link>
      </div>
      <ErrorState v-if="!peersInfo" err="Unable to fetch peers from node" />
      <LoadingState v-else-if="peersInfo.length == 0" />
      <PeersTable v-else :peers-info="peersInfo" :limit-results="5" />
    </div>
    <div class="column col-12">
      <div class="text-center">
        <h3>Drives</h3>
        <router-link to="/drives" class="btn btn-link">View All</router-link>
      </div>
      <ErrorState
        v-if="!drivesInfo"
        err="Unable to fetch list of drives from node"
      />
      <LoadingState v-else-if="drivesInfo.length == 0" />
      <DrivesCards v-else :drives-info="drivesInfo" />
    </div>
  </div>
</template>

<script>
import BlockCard from "@/components/BlockCard.vue";
import ContractCard from "@/components/ContractCard.vue";
import DrivesCards from "@/components/DrivesCards.vue";
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import PeersTable from "@/components/PeersTable.vue";
import StorageCard from "@/components/StorageCard.vue";
import { getCurrentInstance, inject, onUnmounted, ref, watch } from "vue";
import axios from "axios";

export default {
  name: "MainOverview",
  components: {
    BlockCard,
    ContractCard,
    DrivesCards,
    ErrorState,
    LoadingState,
    PeersTable,
    StorageCard,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const blockInfo = ref(null);
    const contractInfo = ref(null);
    const drivesInfo = ref([]);
    const peersInfo = ref([]);
    const storageInfo = ref(null);

    const updateBlockInfo = async (latestHeight) => {
      try {
        if (!latestHeight) {
          latestHeight = await siriusStore.chainHttp
            .getBlockchainHeight()
            .toPromise();
        }

        blockInfo.value = await siriusStore.blockHttp
          .getBlockByHeight(latestHeight.compact())
          .toPromise();
      } catch (err) {
        console.error("Chain Height Error", err);
        blockInfo.value = {
          err: "Unable to fetch latest block from selected node",
        };
      }
    };

    const updateContractInfo = async () => {
      try {
        const contracts = await axios.get(
          `${siriusStore.state.selectedChainNode}/drives`
        );

        contractInfo.value = {
          total: 0,
          active: 0,
        };

        contractInfo.value.total = contracts.data.pagination.totalEntries;
        drivesInfo.value = contracts.data.data.slice(0, 6);
      } catch (err) {
        console.error("Drives Error", err);
        contractInfo.value = {
          err: "Unable to fetch list of drives from node",
        };
        drivesInfo.value = null;
      }
    };

    const updateStorageInfo = async () => {
      try {
        const contracts = await axios.get(siriusStore.contractLsHttp);

        storageInfo.value = {
          used: 0,
          available: 0,
        };

        if (contracts.data.Ids) {
          contracts.data.Ids.forEach(async (id) => {
            try {
              const driveDetails = await axios.get(
                `${
                  siriusStore.state.selectedChainNode
                }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
                  id
                )}`
              );

              storageInfo.value.available += internalInstance.appContext.config.globalProperties.$filters.numberArrayToCompact(
                driveDetails.data.drive.size
              );
              storageInfo.value.used += internalInstance.appContext.config.globalProperties.$filters.numberArrayToCompact(
                driveDetails.data.drive.occupiedSpace
              );
            } catch (err) {
              console.error("Drive Contract (" + id + ") Error", err);
            }
          });
        }
      } catch (err) {
        console.error("List Contracts Error", err);
        storageInfo.value = {
          err: "Unable to fetch storage information from node",
        };
      }
    };

    const updatePeersInfo = async () => {
      try {
        const peers = await axios.get(siriusStore.peersHttp);
        peersInfo.value = peers.data.Peers;
      } catch (err) {
        console.error("Peer List Error", err);
        peersInfo.value = null;
      }
    };

    const listenerStop = (start) => {
      siriusStore.stopChainWSListener();

      if (start) {
        siriusStore.chainWSListener
          .open()
          .then(() => {
            siriusStore.chainWSListener
              .newBlock()
              .subscribe(
                async (blockInfo) => await updateBlockInfo(blockInfo.height)
              );
          })
          .catch((err) => {
            console.error("Websocket Error", err);
            blockInfo.value = {
              err: "Unable to listen to websocket from selected node",
            };
          });
      }
    };

    onUnmounted(() => {
      listenerStop(false);
    });

    watch(
      () => siriusStore.state.selectedChainNode,
      async () => {
        blockInfo.value = null;
        contractInfo.value = null;
        drivesInfo.value = [];
        await Promise.all([updateBlockInfo(), updateContractInfo()]);
        listenerStop(true);
      }
    );

    watch(
      () => siriusStore.state.selectedStorageNode,
      async () => {
        storageInfo.value = null;
        peersInfo.value = [];
        await Promise.all([updateStorageInfo(), updatePeersInfo()]);
      }
    );

    Promise.all([
      updateBlockInfo(),
      updateContractInfo(),
      updateStorageInfo(),
      updatePeersInfo(),
    ]);
    listenerStop(true);

    return {
      blockInfo,
      contractInfo,
      drivesInfo,
      peersInfo,
      storageInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";

.column {
  margin: $unit-6 0;
}
</style>
