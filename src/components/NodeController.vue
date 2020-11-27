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
        :value="item"
      >
        {{ item }}
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

export default {
  name: "NodeController",
  setup() {
    const err = ref("");
    const loading = ref(false);
    const newUrl = ref("");
    const siriusStore = inject("siriusStore");

    const addNewNode = async () => {
      loading.value = true;
      err.value = "";
      const res = await siriusStore.addNode(newUrl.value);
      if (res == 1) {
        siriusStore.selectNewNode(newUrl.value);
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
