<template>
  <div class="input-group">
    <span class="input-group-addon">Chain</span>
    <select
      class="form-select"
      @change="siriusStore.selectNewChainNode($event.target.value)"
    >
      <option
        v-for="item in siriusStore.state.chainNodes"
        :key="JSON.stringify(item)"
        :selected="
          $filters.parseNodeConfig(item) == siriusStore.state.selectedChainNode
        "
        :value="JSON.stringify(item)"
      >
        {{ $filters.parseNodeConfig(item) }}
      </option>
    </select>
  </div>
  <div class="input-group mt-1">
    <span class="input-group-addon">Storage</span>
    <select
      class="form-select"
      @change="siriusStore.selectNewStorageNode($event.target.value)"
    >
      <option
        v-for="item in siriusStore.state.storageNodes"
        :key="JSON.stringify(item)"
        :selected="
          $filters.parseNodeConfig(item) ==
          siriusStore.state.selectedStorageNode
        "
        :value="JSON.stringify(item)"
      >
        {{ $filters.parseNodeConfig(item) }}
      </option>
    </select>
  </div>
  <div class="divider text-center" data-content="Add New Node"></div>
  <form
    class="form-group"
    :class="{ 'has-error': err }"
    @submit.prevent="addNewNode"
  >
    <div class="input-group">
      <select v-model="addNodeType" class="form-select select-fit">
        <option :selected="addNodeType == 'Chain'">Chain</option>
        <option :selected="addNodeType == 'Storage'">Storage</option>
      </select>
      <input
        v-model="newUrl"
        type="text"
        class="form-input"
        :disabled="loading"
        placeholder="New Node Url"
      />
      <button
        class="btn btn-primary input-group-btn"
        :class="{ loading: loading }"
      >
        <i class="icon icon-plus"></i>
      </button>
    </div>
    <p v-if="err" class="form-input-hint">{{ err }}</p>
  </form>
</template>

<script>
import { inject, ref } from "vue";
import parse from "url-parse";

export default {
  name: "NodesController",
  setup() {
    const siriusStore = inject("siriusStore");
    const err = ref("");
    const loading = ref(false);
    const newUrl = ref("");
    const addNodeType = ref("Storage");

    const addNewNode = async () => {
      loading.value = true;
      err.value = "";
      const url = parse(newUrl.value, true);
      const nodeConfigString = JSON.stringify({
        protocol: url.protocol.slice(0, -1),
        hostname: url.hostname,
        port: url.port,
      });

      if (addNodeType.value == "Chain") {
        const res = await siriusStore.addChainNode(nodeConfigString);
        if (res == 1) {
          siriusStore.selectNewChainNode(nodeConfigString);
          newUrl.value = "";
        } else if (res == 0) {
          err.value = "Invalid Node";
        } else {
          err.value = "Node Exist";
        }
      } else {
        const res = await siriusStore.addStorageNode(nodeConfigString);
        if (res == 1) {
          siriusStore.selectNewStorageNode(nodeConfigString);
          newUrl.value = "";
        } else if (res == 0) {
          err.value = "Invalid Node";
        } else {
          err.value = "Node Exist";
        }
      }

      loading.value = false;
    };

    return {
      addNewNode,
      addNodeType,
      err,
      loading,
      newUrl,
      siriusStore,
    };
  },
};
</script>

<style lang="scss" scoped>
.input-group {
  .select-fit {
    flex: 0 0 auto;
  }
}
</style>
