<template>
  <table class="table table-striped">
    <tbody>
      <template v-if="storage">
        <tr>
          <td class="text-bold">ID</td>
          <td class="text-ellipsis">
            {{ nodeDetail.ID }}
          </td>
        </tr>
        <tr>
          <td class="text-bold">Public Key</td>
          <td class="text-ellipsis">
            <a
              :href="explorerPublicKeyHttp(nodeDetail.Key.substr(8))"
              target="_blank"
            >
              {{ nodeDetail.Key.substr(8).toUpperCase() }}
            </a>
          </td>
        </tr>
        <tr>
          <td class="text-bold">Type</td>
          <td>{{ nodeDetail.type }}</td>
        </tr>
        <tr>
          <td class="text-bold">App Name</td>
          <td>{{ nodeDetail.App }}</td>
        </tr>
        <tr>
          <td class="text-bold">Version</td>
          <td>{{ nodeDetail.Version }}</td>
        </tr>
        <tr>
          <td class="text-bold">Commit Hash</td>
          <td>{{ nodeDetail.Commit }}</td>
        </tr>
        <tr>
          <td class="text-bold">Build Date</td>
          <td>{{ nodeDetail.BuildDate }}</td>
        </tr>
        <tr>
          <td class="text-bold">Operating System</td>
          <td>{{ nodeDetail.System }}</td>
        </tr>
        <tr>
          <td class="text-bold">Go Version</td>
          <td>{{ nodeDetail.GO }}</td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td class="text-bold">Public Key</td>
          <td class="text-ellipsis">
            <a
              :href="explorerPublicKeyHttp(nodeDetail.publicKey)"
              target="_blank"
            >
              {{ nodeDetail.publicKey }}
            </a>
          </td>
        </tr>
        <tr>
          <td class="text-bold">Friendly Name</td>
          <td class="text-ellipsis">
            {{ nodeDetail.friendlyName }}
          </td>
        </tr>
        <tr>
          <td class="text-bold">Type</td>
          <td v-if="nodeDetail.roles == 1">API</td>
          <td v-else-if="nodeDetail.roles == 2">API & Peer</td>
          <td v-else>Peer</td>
        </tr>
        <tr>
          <td class="text-bold">Version</td>
          <td>{{ nodeDetail.serverInfo.restVersion }}</td>
        </tr>
        <tr>
          <td class="text-bold">SDK Version</td>
          <td>{{ nodeDetail.serverInfo.sdkVersion }}</td>
        </tr>
        <tr>
          <td class="text-bold">Total Blocks</td>
          <td>
            <a :href="explorerBlockHttp(nodeDetail.numBlocks)" target="_blank">
              {{ nodeDetail.numBlocks }}
            </a>
          </td>
        </tr>
        <tr>
          <td class="text-bold">Total Transactions</td>
          <td>{{ nodeDetail.numTransactions }}</td>
        </tr>
        <tr>
          <td class="text-bold">Total Accounts</td>
          <td>{{ nodeDetail.numAccounts }}</td>
        </tr>
      </template>
      <tr>
        <td class="text-bold">Average Ping</td>
        <td
          :class="{
            'text-success': nodeDetail.ping < 100,
            'text-warning': nodeDetail.ping >= 100 && nodeDetail.ping < 250,
            'text-error': nodeDetail.ping >= 250,
          }"
        >
          {{ nodeDetail.ping > 0 ? nodeDetail.ping + " ms" : "Timed Out" }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { inject } from "vue";

export default {
  name: "NodeStatusTable",
  props: {
    nodeDetail: {
      type: Object,
      default: null,
    },
    storage: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const appStore = inject("appStore");

    return {
      explorerBlockHttp: appStore.explorerBlockHttp,
      explorerPublicKeyHttp: appStore.explorerPublicKeyHttp,
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
