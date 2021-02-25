<template>
  <form
    class="form-group"
    :class="{ 'has-error': err }"
    @submit.prevent="search"
  >
    <fieldset :disabled="loading">
      <div class="input-group">
        <select
          class="form-select select-lg select-fit"
          @change="searchType = $event.target.value"
        >
          <option :selected="searchType == 0" :value="0">All</option>
          <option :selected="searchType == 1" :value="1">Drive</option>
          <option :selected="searchType == 2" :value="2">Peer</option>
        </select>
        <input
          v-model="searchText"
          class="form-input input-lg"
          type="text"
          :placeholder="
            'Search peer or drive id on Storage ' +
            siriusStore.state.network.name
          "
        />
        <button
          class="btn btn-lg btn-primary input-group-btn"
          :class="{ loading: loading }"
        >
          <i class="icon icon-search"></i>
        </button>
      </div>
      <div v-if="err" class="form-input-hint text-center">{{ err }}</div>
    </fieldset>
  </form>
</template>

<script>
import { getCurrentInstance, inject, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "SearchBar",
  setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const router = useRouter();
    const searchText = ref("");
    const searchType = ref(0);
    const err = ref("");
    const loading = ref(false);

    const searchDrive = async (driveId) => {
      try {
        await axios.get(
          `${
            siriusStore.state.selectedChainNode
          }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
            driveId
          )}`
        );
        return true;
      } catch {
        return false;
      }
    };

    const searchPeers = async (peerId) => {
      try {
        const peers = await axios.get(siriusStore.peersHttp);
        return peers.data.Peers.find((peer) => peer.ID == peerId)
          ? true
          : false;
      } catch {
        return false;
      }
    };

    const search = async () => {
      loading.value = true;
      err.value = "";

      if (searchType.value == 1) {
        if (await searchDrive(searchText.value)) {
          router.push({ name: "Drive", params: { cid: [searchText.value] } });
        } else {
          err.value = "Unable to seach for drive id";
        }
      } else if (searchType.value == 2) {
        if (await searchPeers(searchText.value)) {
          router.push({ name: "Peers", query: { peerId: searchText.value } });
        } else {
          err.value = "Unable to seach for peer id";
        }
      } else {
        const resp = await Promise.all([
          searchDrive(searchText.value),
          searchPeers(searchText.value),
        ]);

        if (resp[0]) {
          router.push({ name: "Drive", params: { cid: [searchText.value] } });
        } else if (resp[1]) {
          router.push({ name: "Peers", query: { peerId: searchText.value } });
        } else {
          err.value = "Unable to seach for peer or drive id";
        }
      }

      loading.value = false;
    };

    return {
      err,
      loading,
      search,
      searchText,
      searchType,
      siriusStore,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";

.input-group {
  color: $body-font-color;
}
</style>
