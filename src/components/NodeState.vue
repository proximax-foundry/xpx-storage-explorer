<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title h5 text-ellipsis">{{ nodeDetail.id }}</div>
    </div>
    <div class="card-body">
      <table class="table">
        <tbody>
          <tr>
            <td class="text-bold">Public Key</td>
            <td class="text-ellipsis">
              {{ $filters.peerIdToPublicKey(nodeDetail.id) }}
            </td>
          </tr>
          <tr>
            <td class="text-bold">Type</td>
            <td>{{ nodeDetail.type }}</td>
          </tr>
          <tr>
            <td class="text-bold">Host</td>
            <td>{{ nodeDetail.IPv4 }}</td>
          </tr>
          <tr>
            <td class="text-bold">Country</td>
            <td>{{ nodeDetail.country_name }}</td>
          </tr>
          <tr>
            <td class="text-bold">Average Ping</td>
            <td>
              {{ nodeDetail.ping > 0 ? nodeDetail.ping + " ms" : "Timed Out" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  name: "NodeState",
  async setup() {
    const route = useRoute();
    const nodeDetail = ref(null);
    const matchPeerId = (peer) => route.params.nodeId == peer.ID;

    const peers = await axios.get(
      "http://testnet1.dfms.io:6366/api/v1/net/peers"
    );

    const peerIndex = peers.data.Peers.findIndex(matchPeerId);
    if (peerIndex != -1) {
      const peerDetail = peers.data.Peers[peerIndex].Addrs[0].split("/");
      const ipDetail = await axios.get(
        `https://geolocation-db.com/json/${peerDetail[2]}`
      );

      if (ipDetail.data.IPv4 == "Not found") {
        ipDetail.data.IPv4 = peerDetail[2];
      }

      nodeDetail.value = ipDetail.data;
      nodeDetail.value.id = peers.data.Peers[peerIndex].ID;
      nodeDetail.value.type = peerDetail[4] == 63666 ? "SDN" : "SRN";
    } else {
      const ipDetail = await axios.get(
        "https://geolocation-db.com/json/testnet1.dfms.io"
      );

      if (ipDetail.data.IPv4 == "Not found") {
        ipDetail.data.IPv4 = "testnet1.dfms.io";
      }

      nodeDetail.value = ipDetail.data;
      nodeDetail.value.id = route.params.nodeId;
      nodeDetail.value.type = "SDN & SRN";
    }

    nodeDetail.value.ping = 0;

    for (let i = 0; i < 5; i++) {
      const start = new Date();
      await fetch(nodeDetail.value.IPv4, { mode: "no-cors" });
      nodeDetail.value.ping += new Date() - start;
    }

    nodeDetail.value.ping /= 5;

    return {
      nodeDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";

.card {
  full-width: $size-md;
}

.table {
  table-layout: fixed;

  td:first-child {
    width: 25%;
  }
}
</style>
