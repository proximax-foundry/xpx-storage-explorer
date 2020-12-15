<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title h5">{{ nodeDetail.id }}</div>
    </div>
    <div class="card-body">
      <table class="table">
        <tbody>
          <tr>
            <td class="text-bold">Host</td>
            <td>{{ nodeDetail.IPv4 }}</td>
          </tr>
          <tr>
            <td class="text-bold">Country</td>
            <td>
              {{ nodeDetail.country_name }}
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

    const peers = await axios.get("/mock/testnet1.dfms.io/peers.json");
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
    } else {
      const ipDetail = await axios.get(
        "https://geolocation-db.com/json/testnet1.dfms.io"
      );
      if (ipDetail.data.IPv4 == "Not found") {
        ipDetail.data.IPv4 = "testnet1.dfms.io";
      }
      nodeDetail.value = ipDetail.data;
      nodeDetail.value.id = route.params.nodeId;
    }

    return {
      nodeDetail,
    };
  },
};
</script>
