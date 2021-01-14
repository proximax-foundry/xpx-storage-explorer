<template>
  <div class="text-center">
    <h3>Peer Nodes</h3>
    <router-link to="/peers" class="btn btn-link">View All</router-link>
  </div>
  <ErrorState v-if="errorMessage" :err="errorMessage" />
  <template v-else>
    <LoadingState v-if="peerDetails.length == 0" />
    <table v-else class="table table-striped table-stack">
      <thead>
        <tr>
          <th>ID</th>
          <th>Public Key</th>
          <th>Host</th>
          <th>Location</th>
          <th>Type</th>
        </tr>
      </thead>
      <transition-group name="peer-table" tag="tbody">
        <tr v-for="item in peerDetails" :key="item.id">
          <td data-th="Id">{{ item.id }}</td>
          <td data-th="Public Key">
            {{ $filters.peerIdToPublicKey(item.id).substr(0, 15) }}...
          </td>
          <td data-th="Host">{{ item.details.IPv4 }}</td>
          <td data-th="Location">{{ item.details.country_name }}</td>
          <td data-th="Type">{{ item.type }}</td>
        </tr>
      </transition-group>
    </table>
  </template>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import { inject, onMounted, ref, watch } from "vue";
import axios from "axios";

export default {
  name: "PeersSummary",
  components: {
    ErrorState,
    LoadingState,
  },
  setup() {
    const siriusStore = inject("siriusStore");
    const appStore = inject("appStore");
    const peerDetails = ref([]);
    const errorMessage = ref(null);

    const loadDetails = async () => {
      try {
        const peers = await axios.get(siriusStore.peersHttp);
        let i = 0;

        while (peerDetails.value.length < 5 && i < peers.data.Peers.length) {
          const peerDetail = peers.data.Peers[i].Addrs[0].split("/");
          try {
            const ipDetail = await axios.get(
              appStore.ipLocationHttp(peerDetail[2])
            );

            if (
              ipDetail.data.IPv4 == "Not found" ||
              peerDetails.value.find(
                (element) =>
                  element.id == peers.data.Peers[i].ID &&
                  element.details.IPv4 == ipDetail.data.IPv4
              )
            ) {
              i++;
              continue;
            }

            peerDetails.value.push({
              id: peers.data.Peers[i].ID,
              type: peerDetail[4] == 63666 ? "SDN" : "SRN",
              details: ipDetail.data,
            });
          } catch (err) {
            console.error("IP Geolocation Error", err);
          }

          i++;
        }

        if (peerDetails.value.length == 0 && peers.data.Peers.length > 0) {
          errorMessage.value =
            "Please check if " +
            appStore.ipLocationHostname +
            " is blocked by your AdBlocker and unblock it to view more information on each peer node";
        }
      } catch (err) {
        console.error("Peer List Error", err);
        errorMessage.value = "Unable to fetch peers from node";
      }
    };

    onMounted(async () => {
      await loadDetails();
    });

    watch(
      () => siriusStore.state.selectedStorageNode,
      async () => {
        peerDetails.value = [];
        errorMessage.value = null;
        await loadDetails();
      }
    );

    return {
      errorMessage,
      peerDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";

.table {
  tbody {
    tr:nth-of-type(odd) {
      background: $light-color;
    }
  }
}

.peer-table-move {
  transition: all 1s ease;
}

.peer-table-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
