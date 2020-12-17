<template>
  <div class="card text-center">
    <template v-if="isLoading">
      <div class="card-header">
        <div class="card-title h4">Loading</div>
      </div>
      <div class="card-body">
        <div class="loading loading-lg"></div>
      </div>
    </template>
    <template v-else>
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
    </template>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  computed,
  getCurrentInstance,
  inject,
  onUnmounted,
  ref,
  watch,
} from "vue";

library.add(faCube);

export default {
  name: "BlockSummary",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const nowTimestamp = ref(new Date().getTime());
    const blockInfo = ref(null);
    const isLoading = ref(false);
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
      }
    };

    const listenerStop = (start) => {
      siriusStore.stopListener();

      if (start) {
        siriusStore.wsListener
          .open()
          .then(() => {
            siriusStore.wsListener.newBlock().subscribe(
              async (blockInfo) => {
                await updateInfo(blockInfo.height);
              },
              (err) => console.error("New Block Websocket Error", err)
            );
          })
          .catch((err) => {
            console.error("Websocket Error", err);
          });
      }
    };

    onUnmounted(() => {
      listenerStop(false);
    });

    watch(
      async () => siriusStore.chainHttp,
      async () => {
        isLoading.value = true;
        blockInfo.value = null;
        await updateInfo();
        listenerStop(true);
        isLoading.value = false;
      }
    );

    onUnmounted(() => {
      listenerStop(false);
    });

    await updateInfo();
    listenerStop(true);
    setInterval(() => {
      nowTimestamp.value += 1000;
    }, 1000);

    return {
      blockInfo,
      isLoading,
      timeElapsed,
    };
  },
};
</script>
