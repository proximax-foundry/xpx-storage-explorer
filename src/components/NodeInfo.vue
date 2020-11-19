<template>
  <div v-if="info" class="card">
    <div class="card-header">
      <div class="tile tile-centered">
        <div class="tile-icon">
          <figure
            class="avatar avatar-xl"
            :data-initial="[info.friendlyName.substr(0, 2)]"
          >
            <i
              class="avatar-presence"
              :class="[info.publicKey != 'N/A' ? 'online' : 'offline']"
            ></i>
          </figure>
        </div>
        <div class="tile-content">
          <div class="tile-title h4">
            {{ info.host }}
          </div>
          <div class="tile-subtitle text-gray">
            {{ info.friendlyName }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <table class="text-left">
          <tr>
            <th>Public Key</th>
            <td>{{ info.publicKey.substr(0, 10) }}</td>
          </tr>
          <tr>
            <th>Version</th>
            <td>{{ info.version }}</td>
          </tr>
          <tr>
            <th>Roles</th>
            <td>
              {{ info.roles == 1 ? "Peer Node" : "API Node" }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <Loading v-else />
</template>

<script>
import { inject, ref, watch } from "vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "NodeInfo",
  components: {
    Loading,
  },
  async setup() {
    const info = ref(null);
    const siriusStore = inject("siriusStore");

    watch(
      async () => siriusStore.nodeHttp,
      async () => {
        info.value = null;
        try {
          info.value = await siriusStore.nodeHttp.getNodeInfo().toPromise();
        } catch (err) {
          console.error("Node Info Error", err);
          info.value = {
            host: siriusStore.state.selectedNode,
            friendlyName: siriusStore.state.selectedNode,
            publicKey: "N/A",
            version: "N/A",
            roles: "N/A",
          };
        }
      }
    );

    info.value = await siriusStore.nodeHttp.getNodeInfo().toPromise();

    return {
      info,
    };
  },
};
</script>
