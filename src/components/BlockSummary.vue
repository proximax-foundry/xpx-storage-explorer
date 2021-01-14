<template>
  <LoadingState v-if="!blockInfo" />
  <template v-else>
    <ErrorState v-if="blockInfo.err" :err="blockInfo.err" small-text="true" />
    <div v-else class="card text-center">
      <div class="card-header">
        <div class="card-subtitle">
          <small class="text-bold">Latest Block</small>
        </div>
        <div class="card-title h4">
          {{ blockInfo.height.compact() }}
        </div>
        <div class="card-subtitle">
          {{
            $filters.getRelativeTimestamp(blockInfo.timestamp).toLocaleString()
          }}
          ({{ timeElapsed }} seconds ago)
        </div>
      </div>
      <div class="card-body bg-success m-2">
        <FontAwesomeIcon :icon="['fas', 'cube']" size="lg" />
        Upcoming block: <b>{{ blockInfo.height.compact() + 1 }}</b>
      </div>
    </div>
  </template>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";

library.add(faCube);

export default {
  name: "BlockSummary",
  components: {
    ErrorState,
    FontAwesomeIcon,
    LoadingState,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const nowTimestamp = ref(new Date().getTime());
    const blockInfo = ref(null);

    const timeElapsed = computed(() =>
      Math.floor(
        (nowTimestamp.value -
          internalInstance.appContext.config.globalProperties.$filters.getRelativeTimestamp(
            blockInfo.value.timestamp
          )) /
          1000
      )
    );

    const updateInfo = async (latestHeight) => {
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

    const listenerStop = (start) => {
      siriusStore.stopChainWSListener();

      if (start) {
        siriusStore.chainWSListener
          .open()
          .then(() => {
            siriusStore.chainWSListener
              .newBlock()
              .subscribe(
                async (blockInfo) => await updateInfo(blockInfo.height)
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

    onMounted(async () => {
      await updateInfo();
      listenerStop(true);
      setInterval(() => {
        nowTimestamp.value += 1000;
      }, 1000);
    });

    onUnmounted(() => {
      listenerStop(false);
    });

    watch(
      () => siriusStore.state.selectedChainNode,
      async () => {
        blockInfo.value = null;
        await updateInfo();
        listenerStop(true);
      }
    );

    return {
      blockInfo,
      timeElapsed,
    };
  },
};
</script>
