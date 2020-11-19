<template>
  <Error v-if="err" :err="err" />
  <div v-else-if="tableData.length > 0" class="card">
    <div class="card-image">
      <table class="table table-striped table-hover table-stack">
        <thead>
          <tr>
            <th>Block Height</th>
            <th>Validator</th>
            <th>Fees</th>
            <th>Transactions</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <transition-group name="block-table" tag="tbody">
          <tr v-for="item in tableData" :key="item.height">
            <td data-th="Height">{{ item.height }}</td>
            <td class="text-break" data-th="Validator">
              {{ item.validator.substr(0, 10) }}
            </td>
            <td data-th="Fees">{{ item.fee }}</td>
            <td data-th="# Txs">{{ item.txCount }}</td>
            <td data-th="Timestamp">{{ $filters.getRelativeTimestamp(item.ts).toLocaleString() }}</td>
          </tr>
        </transition-group>
      </table>
    </div>
    <div class="card-footer">
      <button
        v-if="tableData[0].height != tableData.length"
        class="btn btn-primary"
        :class="{ loading: isLoading }"
        @click="loadMore($event)"
      >
        Load More
      </button>
    </div>
  </div>
  <Loading v-else />
</template>

<script>
import { inject, onUnmounted, reactive, ref, watch } from "vue";
import Error from "@/components/Error.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Error,
    Loading,
  },
  async setup() {
    const siriusStore = inject("siriusStore");
    const height = ref(null);
    const err = ref(null);

    const errorHandler = (detailErr, actualErr) => {
      console.error(detailErr, actualErr);
      err.value = "Unable to load blocks from selected node";
    };

    const isLoading = ref(false);
    const tableData = reactive([]);

    const getBlocks = async (blockHeight) => {
      try {
        const blockInfos = await siriusStore.blockHttp
          .getBlocksByHeightWithLimit(blockHeight, 25)
          .toPromise();
        if (blockInfos.length > 0) {
          blockInfos.forEach((element) => {
            tableData.push({
              height: element.height.compact(),
              validator: element.signer.publicKey,
              fee: element.totalFee.compact(),
              txCount: element.numTransactions,
              ts: element.timestamp,
            });
          });
        }
      } catch (err) {
        errorHandler("Block Height Limit Error", err);
      }
    };

    const loadMore = async () => {
      isLoading.value = true;
      await getBlocks(tableData[tableData.length - 1].height - 1);
      isLoading.value = false;
    };

    const subscribeNewBlock = async (blockInfo) => {
      let block = await siriusStore.blockHttp
        .getBlockByHeight(blockInfo.height.compact())
        .toPromise();
      tableData.unshift({
        height: block.height.compact(),
        validator: block.signer.publicKey,
        fee: block.totalFee.compact(),
        txCount: block.numTransactions,
        ts: block.timestamp,
      });
    };

    const listenerStop = (start) => {
      siriusStore.stopListener();

      if (start) {
        siriusStore.wsListener
          .open()
          .then(() => {
            siriusStore.wsListener.newBlock().subscribe(
              (blockInfo) => subscribeNewBlock(blockInfo),
              (err) => errorHandler("New Block Websocket Error", err)
            );
          })
          .catch((err) => {
            errorHandler("Websocket Error", err);
          });
      }
    };

    watch(
      async () => siriusStore.chainHttp,
      async () => {
        err.value = null;
        tableData.length = 0;
        try {
          height.value = await siriusStore.chainHttp
            .getBlockchainHeight()
            .toPromise();
          await getBlocks(height.value.compact());
        } catch (err) {
          errorHandler("Chain Height Error", err);
        }
        listenerStop(true);
      }
    );

    onUnmounted(() => {
      listenerStop(false);
    });

    height.value = await siriusStore.chainHttp
      .getBlockchainHeight()
      .toPromise();
    await getBlocks(height.value.compact());
    listenerStop(true);

    return {
      err,
      isLoading,
      tableData,
      loadMore,
    };
  },
};
</script>

<style lang="sass" scoped>
.block-table-move
  transition: all 1s ease

.block-table-enter-from
  opacity: 0
  transform: translateY(30px)
</style>
