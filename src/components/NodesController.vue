<template>
  <div class="form-group">
    <select
      class="form-select"
      @change="siriusStore.selectNewNode($event.target.value)"
    >
      <option
        v-for="item in siriusStore.state.nodes"
        :key="item"
        :selected="item == siriusStore.state.selectedNode"
        :value="JSON.stringify(item)"
      >
        {{ parseNodeConfig(item) }}
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
      const url = new parse(newUrl.value);
      var nodeConfig = {};
      nodeConfig["protocol"] = url.protocol.slice(0, -1);
      nodeConfig["hostname"] = url.hostname;
      nodeConfig["port"] = url.port;

      const nodeConfigString = JSON.stringify(nodeConfig);
      const res = await siriusStore.addNode(nodeConfigString);
      if (res == 1) {
        siriusStore.selectNewNode(nodeConfigString);
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
  methods: {
    parseNodeConfig(nodeConfig) {
      return (
        nodeConfig.protocol +
        "://" +
        nodeConfig.hostname +
        ":" +
        nodeConfig.port
      );
    },
  },
};
</script>
