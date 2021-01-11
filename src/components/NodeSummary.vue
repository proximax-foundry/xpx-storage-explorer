<template>
  <div class="text-center">
    <h3>Nodes</h3>
    <router-link to="/nodes" class="btn btn-link"> View All </router-link>
  </div>
  <table class="table table-striped table-stack">
    <thead>
      <tr>
        <th>ID</th>
        <th>Public Key</th>
        <th>Host</th>
        <th>Location</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in nodeDetails" :key="item.Id">
        <td data-th="Id">{{ item.id }}</td>
        <td data-th="Public Key">
          {{ $filters.peerIdToPublicKey(item.id).substr(0, 15) }}...
        </td>
        <td data-th="Host">{{ item.details.IPv4 }}</td>
        <td data-th="Location">{{ item.details.country_name }}</td>
        <td data-th="Type">{{ item.type }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { inject, ref } from "vue";
import axios from "axios";

export default {
  name: "NodeSummary",
  async setup() {
    const siriusStore = inject("siriusStore");
    const nodeDetails = ref([]);

    const peers = await axios.get(siriusStore.peersHttp);
    let i = 0;
    while (nodeDetails.value.length < 5 && i < peers.data.Peers.length) {
      const peerDetail = peers.data.Peers[i].Addrs[0].split("/");
      const ipDetail = await axios.get(
        `https://geolocation-db.com/json/${peerDetail[2]}`
      );

      if (ipDetail.data.IPv4 == "Not found") {
        i++;
        continue;
      }

      nodeDetails.value.push({
        id: peers.data.Peers[i].ID,
        type: peerDetail[4] == 63666 ? "SDN" : "SRN",
        details: ipDetail.data,
      });

      i++;
    }

    return {
      nodeDetails,
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
</style>
