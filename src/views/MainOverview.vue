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
      <LoadingState v-if="!peersInfo" />
      <ErrorState v-else-if="peersInfo.err" :err="peersInfo.err" />
      <PeersTable v-else :peers-info="peersInfo" :limit-results="5" />
    </div>
    <div class="column col-12">
      <div class="text-center">
        <h3>Drives</h3>
        <router-link to="/drives" class="btn btn-link">View All</router-link>
      </div>
      <LoadingState v-if="!drivesInfo" />
      <ErrorState v-else-if="drivesInfo.err" :err="drivesInfo.err" />
      <div v-else class="columns">
        <div
          v-for="item in drivesInfo"
          :key="item.drive.multisig"
          class="column col-4 col-md-6 col-sm-12 my-0"
        >
          <DriveTile :drive="item.drive" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlockCard from "@/components/BlockCard.vue";
import ContractCard from "@/components/ContractCard.vue";
import DriveTile from "@/components/DriveTile.vue";
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
    DriveTile,
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
    const drivesInfo = ref(null);
    const peersInfo = ref(null);
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

    const updateStorageInfo = async () => {
      try {
        let drives = await axios.get(siriusStore.drivesHttp());

        contractInfo.value = {
          total: 0,
          active: 0,
        };

        storageInfo.value = {
          used: 0,
          available: 0,
        };

        if (drives.data.pagination.totalEntries > 0) {
          drivesInfo.value = drives.data.data.slice(0, 6);
          contractInfo.value.total = drives.data.pagination.totalEntries;

          while (
            drives.data.pagination.pageNumber !=
            drives.data.pagination.totalPages + 1
          ) {
            drives.data.data.forEach((drive) => {
              if (drive.drive.state == 2) {
                contractInfo.value.active += 1;
              }
              storageInfo.value.available += internalInstance.appContext.config.globalProperties.$filters.numberArrayToCompact(
                drive.drive.size
              );
              storageInfo.value.used += internalInstance.appContext.config.globalProperties.$filters.numberArrayToCompact(
                drive.drive.occupiedSpace
              );
            });

            if (
              drives.data.pagination.pageNumber ==
              drives.data.pagination.totalPages
            ) {
              break;
            }

            try {
              drives = await axios.get(
                siriusStore.drivesHttp(drives.data.pagination.pageNumber + 1)
              );
            } catch (err) {
              console.error("List Drives Error", err);
              contractInfo.value = drivesInfo.value = {
                err: "Unable to fetch list of drives from node",
              };
              storageInfo.value = {
                err: "Unable to fetch storage information from node",
              };

              break;
            }
          }
        } else {
          contractInfo.value = drivesInfo.value = storageInfo.value = {
            err: "No drives found",
          };
        }
      } catch (err) {
        console.error("List Drives Error", err);
        contractInfo.value = drivesInfo.value = {
          err: "Unable to fetch list of drives from node",
        };
        storageInfo.value = {
          err: "Unable to fetch storage information from node",
        };
      }
    };

    const updatePeersInfo = async () => {
      try {
        const peers = await axios.get(siriusStore.peersHttp);
        if (peers.data.Peers) {
          peersInfo.value = peers.data.Peers;
        } else {
          peersInfo.value = {
            err: "Node does not seem to be connected to network",
          };
        }
      } catch (err) {
        console.error("Peer List Error", err);
        peersInfo.value = {
          err: "Unable to fetch peers from node",
        };
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
        blockInfo.value = contractInfo.value = drivesInfo.value = storageInfo.value = null;
        await Promise.all([updateBlockInfo(), updateStorageInfo()]);
        listenerStop(true);
      }
    );

    watch(
      () => siriusStore.state.selectedStorageNode,
      async () => {
        peersInfo.value = null;
        await updatePeersInfo();
      }
    );

    Promise.all([updateBlockInfo(), updateStorageInfo(), updatePeersInfo()]);
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
