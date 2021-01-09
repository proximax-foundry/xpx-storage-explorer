<template>
  <div class="form-group">
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
  <form
    class="form-group"
    :class="{ 'has-error': err }"
    @submit.prevent="addNewNode"
  >
    <div class="input-group">
      <input
        v-model="newUrl"
        type="text"
        class="form-input"
        :disabled="loading"
        placeholder="Add Node"
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
    const err = ref("");
    const loading = ref(false);
    const newUrl = ref("");
    const siriusStore = inject("siriusStore");

    const addNewNode = async () => {
      loading.value = true;
      err.value = "";
      const url = parse(newUrl.value, true);
      const nodeConfigString = JSON.stringify({
        protocol: url.protocol.slice(0, -1),
        hostname: url.hostname,
        port: url.port,
      });

      const res = await siriusStore.addChainNode(nodeConfigString);
      if (res == 1) {
        siriusStore.selectNewChainNode(nodeConfigString);
        newUrl.value = "";
      } else if (res == 0) {
        err.value = "Invalid Node";
      } else {
        err.value = "Node Exist";
      }

      loading.value = false;
    };

    return {
      addNewNode,
      err,
      loading,
      newUrl,
      siriusStore,
    };
  },
};
</script>
