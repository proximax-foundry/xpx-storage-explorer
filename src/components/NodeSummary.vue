<template>
  <div class="text-center">
    <h3>Nodes</h3>
    <router-link to="/nodes" class="btn btn-link"> View All </router-link>
  </div>
  <table class="table table-hover table-stack">
    <thead>
      <tr>
        <th>ID</th>
        <th>Host</th>
        <th>Location</th>
        <th>Type</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in nodeDetails" :key="item.Id">
        <td data-th="Id">
          <router-link
            :to="{ name: 'Node Details', params: { nodeId: item.id } }"
          >
            {{ item.id }}
          </router-link>
        </td>
        <td data-th="Host">{{ item.details.IPv4 }}</td>
        <td data-th="Location">{{ item.details.country_name }}</td>
        <td data-th="Type">{{ item.type }}</td>
        <td class="text-center">
          <router-link
            :to="{ name: 'Node Details', params: { nodeId: item.id } }"
            class="btn"
          >
            More
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "NodeSummary",
  async setup() {
    const nodeDetails = ref([]);

    const peers = await axios.get(
      "http://testnet1.dfms.io:6366/api/v1/net/peers"
    );
    peers.data.Peers.slice(0, 5).forEach(async (peer) => {
      const peerDetail = peer.Addrs[0].split("/");
      const ipDetail = await axios.get(
        `https://geolocation-db.com/json/${peerDetail[2]}`
      );

      if (ipDetail.data.IPv4 == "Not found") {
        ipDetail.data.IPv4 = peerDetail[2];
      }

      nodeDetails.value.push({
        id: peer.ID,
        type: peerDetail[4] == 63666 ? "SDN" : "SRN",
        details: ipDetail.data,
      });
    });

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
