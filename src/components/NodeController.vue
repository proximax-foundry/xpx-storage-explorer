<template>
  <div class="form-group">
    <select
      class="form-select"
      @change="changeNode"
    >
      <option
        v-for="(item, index) in siriusStore.state.nodes"
        :key="index"
        :value="index"
      >
        {{ item }}
      </option>
    </select>
  </div>
  <form class="form-group" :class="{ 'has-error' : err }" @submit.prevent="addNewNode">
    <div class="input-group">
      <input v-model="newUrl" type="text" class="form-input" placeholder="Add Node">
      <button class="btn btn-primary input-group-btn" :class="{ loading: loading }">
        <i class="icon icon-plus"></i>
      </button>
    </div>
    <p v-if="err" class="form-input-hint">{{ err }}</p>
  </form>
</template>

<script>
import { inject, ref } from "vue";

export default {
  setup(props, { emit }) {
    const err = ref("");
    const loading = ref(false);
    const newUrl = ref("");
    const siriusStore = inject("siriusStore");

    const changeNode = (e) => {
      siriusStore.selectNewNode(e.target.value);
      emit("close-modal");
    };

    const addNewNode = async () => {
      loading.value = true;
      err.value = "";
      const res = await siriusStore.addNode(newUrl.value);
      if (res == 1) {
        newUrl.value = "";
        setTimeout(emit("close-modal"), 5000);
      } else if (res == 0) {
        err.value = "Invalid Node";
      } else {
        err.value = "Node Exist";
      }

      loading.value = false;
    };

    return {
      addNewNode,
      changeNode,
      err,
      loading,
      newUrl,
      siriusStore,
    };
  },
};
</script>
