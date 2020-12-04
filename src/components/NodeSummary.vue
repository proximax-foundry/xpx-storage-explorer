<template>
  <div class="text-center">
    <h3>Nodes / Host</h3>
    <router-link to="/nodes" class="btn btn-link"> View All </router-link>
  </div>
  <table class="table table-hover table-stack">
    <thead>
      <tr>
        <th>ID</th>
        <th>IP</th>
        <th>Country</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in nodeDetails" :key="item.Id">
        <td data-th="Id">{{ item.id }}</td>
        <td data-th="IP">{{ item.details.IPv4 }}</td>
        <td data-th="Country">
          {{
            item.details.country_name == "Not found"
              ? "N/A"
              : item.details.country_name
          }}
        </td>
        <td data-th="Status">
          <span
            v-if="item.details.country_name == 'Not found'"
            class="label label-error"
            >Offline</span
          >
          <span v-else class="label label-success">Online</span>
        </td>
        <td class="text-center">
          <button class="btn">More</button>
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

    const peers = await axios.get("mock/testnet1.dfms.io/peers.json");
    for (var i = 0; i < 5; i++) {
      const peerDetail = peers.data.Peers[i].Addrs[0].split("/");
      const ipDetail = await axios.get(
        `https://geolocation-db.com/json/${peerDetail[2]}`
      );
      if (ipDetail.data.IPv4 == "Not found") {
        ipDetail.data.IPv4 = peerDetail[2];
      }
      nodeDetails.value.push({
        id: peers.data.Peers[i].ID,
        details: ipDetail.data,
      });
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
