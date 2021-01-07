<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title h5 text-ellipsis">
        Blockchain Node
        <span
          class="label label-rounded"
          :class="{
            'label-success': chainNodeDetail != undefined,
            'label-error': chainNodeDetail == undefined,
          }"
        >
          {{ chainNodeDetail != undefined ? "Online" : "Offline" }}
        </span>
      </div>
    </div>
    <template v-if="chainNodeDetail != undefined">
      <div class="card-body">
        <table class="table table-striped">
          <tbody>
            <tr>
              <td class="text-bold">Public Key</td>
              <td class="text-ellipsis">
                {{ chainNodeDetail.publicKey }}
              </td>
            </tr>
            <tr>
              <td class="text-bold">Friendly Name</td>
              <td class="text-ellipsis">
                {{ chainNodeDetail.friendlyName }}
              </td>
            </tr>
            <tr>
              <td class="text-bold">Type</td>
              <td>{{ chainNodeDetail.roles == 2 ? "API" : "Peer" }}</td>
            </tr>
            <tr>
              <td class="text-bold">Version</td>
              <td>{{ chainNodeDetail.serverInfo.restVersion }}</td>
            </tr>
            <tr>
              <td class="text-bold">SDK Version</td>
              <td>{{ chainNodeDetail.serverInfo.sdkVersion }}</td>
            </tr>
            <tr>
              <td class="text-bold">Total Blocks</td>
              <td>{{ chainNodeDetail.numBlocks }}</td>
            </tr>
            <tr>
              <td class="text-bold">Total Transactions</td>
              <td>{{ chainNodeDetail.numTransactions }}</td>
            </tr>
            <tr>
              <td class="text-bold">Total Accounts</td>
              <td>{{ chainNodeDetail.numAccounts }}</td>
            </tr>
            <tr>
              <td class="text-bold">Average Ping</td>
              <td>
                {{
                  chainNodeDetail.ping > 0
                    ? chainNodeDetail.ping + " ms"
                    : "Timed Out"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
  <div class="divider"></div>
  <div class="card">
    <div class="card-header">
      <div class="card-title h5 text-ellipsis">
        Storage Node
        <span
          class="label label-rounded"
          :class="{
            'label-success': storageNodeDetail != undefined,
            'label-error': storageNodeDetail == undefined,
          }"
        >
          {{ storageNodeDetail != undefined ? "Online" : "Offline" }}
        </span>
      </div>
    </div>
    <template v-if="storageNodeDetail != undefined">
      <div class="card-body">
        <table class="table table-striped">
          <tbody>
            <tr>
              <td class="text-bold">ID</td>
              <td class="text-ellipsis">
                {{ storageNodeDetail.ID }}
              </td>
            </tr>
            <tr>
              <td class="text-bold">Public Key</td>
              <td class="text-ellipsis">
                {{ $filters.peerIdToPublicKey(storageNodeDetail.ID) }}
              </td>
            </tr>
            <tr>
              <td class="text-bold">Type</td>
              <td>{{ storageNodeDetail.type }}</td>
            </tr>
            <tr>
              <td class="text-bold">Average Ping</td>
              <td>
                {{
                  storageNodeDetail.ping > 0
                    ? storageNodeDetail.ping + " ms"
                    : "Timed Out"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import axios from "axios";

export default {
  name: "NodesStatus",
  async setup() {
    const siriusStore = inject("siriusStore");
    const chainNodeDetail = ref(null);
    const storageNodeDetail = ref(null);

    try {
      const resp = await Promise.all([
        axios.get(siriusStore.state.selectedNode + "/node/info"),
        axios.get(siriusStore.state.selectedNode + "/diagnostic/server"),
        axios.get(siriusStore.state.selectedNode + "/diagnostic/storage"),
      ]);

      chainNodeDetail.value = {
        ...resp[0].data,
        ...resp[1].data,
        ...resp[2].data,
      };
      chainNodeDetail.value.ping = 0;

      for (let i = 0; i < 5; i++) {
        const start = new Date();
        await fetch(siriusStore.state.selectedNode + "/chain/height", {
          mode: "no-cors",
        });
        chainNodeDetail.value.ping += new Date() - start;
      }
      chainNodeDetail.value.ping /= 5;
    } catch (err) {
      console.error("Chain Node Status Error", err);
    }

    try {
      const storageResp = await axios.get(
        "http://testnet1.dfms.io:6366/api/v1/net/id"
      );
      storageNodeDetail.value = storageResp.data;
      storageNodeDetail.value.type = "SDN & SRN";
      storageNodeDetail.value.ping = 0;

      for (let i = 0; i < 5; i++) {
        const start = new Date();
        await fetch("http://testnet1.dfms.io:5000", { mode: "no-cors" });
        storageNodeDetail.value.ping += new Date() - start;
      }
      storageNodeDetail.value.ping /= 5;
    } catch (err) {
      console.error("Storage Node Status Error", err);
    }

    return {
      chainNodeDetail,
      storageNodeDetail,
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
