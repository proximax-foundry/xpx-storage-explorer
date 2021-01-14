<template>
  <LoadingState v-if="!drives" />
  <template v-else>
    <ErrorState v-if="drives.err" :err="drives.err" small-text="true" />
    <div v-else class="card text-center">
      <div class="card-header">
        <div class="card-subtitle">
          <small class="text-bold">Drives</small>
        </div>
        <div class="card-title h4">
          {{ drives.total }}
        </div>
        <div class="card-subtitle">on Network</div>
      </div>
      <div class="card-body bg-success m-2">
        <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" />
        Active Contracts: <b>{{ drives.active }}</b>
      </div>
    </div>
  </template>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { inject, onMounted, ref, watch } from "vue";
import axios from "axios";

library.add(faHdd);

export default {
  name: "ContractSummary",
  components: {
    ErrorState,
    FontAwesomeIcon,
    LoadingState,
  },
  setup() {
    const siriusStore = inject("siriusStore");
    const drives = ref(null);

    const loadDetails = async () => {
      try {
        const contracts = await axios.get(
          `${siriusStore.state.selectedChainNode}/drives`
        );
        drives.value = {
          total: 0,
          active: 0,
        };

        drives.value.total = contracts.data.pagination.totalEntries;
      } catch (err) {
        console.error("Drives Error", err);
        drives.value = {
          err: "Unable to fetch list of drives from node",
        };
      }
    };

    onMounted(async () => {
      await loadDetails();
    });

    watch(
      () => siriusStore.state.selectedChainNode,
      async () => {
        drives.value = null;
        await loadDetails();
      }
    );

    return {
      drives,
    };
  },
};
</script>
