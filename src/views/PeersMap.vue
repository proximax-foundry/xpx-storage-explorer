<template>
  <div class="card">
    <div v-show="showMap" class="card-image">
      <div id="map"></div>
    </div>
    <div class="card-body">
      <LoadingState v-if="!peersInfo" />
      <ErrorState v-else-if="peersInfo.err" :err="peersInfo.err" />
      <PeersTable
        v-else
        v-model:show-map="showMap"
        :peers-info="peersInfo"
        :map="map"
      />
    </div>
  </div>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import PeersTable from "@/components/PeersTable.vue";
import { inject, onMounted, ref, watch } from "vue";
import axios from "axios";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";

export default {
  name: "PeersMap",
  components: {
    ErrorState,
    LoadingState,
    PeersTable,
  },
  setup() {
    const siriusStore = inject("siriusStore");
    const appStore = inject("appStore");
    const showMap = ref(true);
    const map = ref(null);
    const peersInfo = ref(null);

    mapboxgl.accessToken = appStore.mapboxToken;

    const loadDetails = async () => {
      try {
        const peers = await axios.get(siriusStore.peersHttp);
        if (peers.data.Peers) {
          peersInfo.value = peers.data.Peers;
        } else {
          peersInfo.value = {
            err: "Node does not seem to be connected to network",
          };
        }
      } catch (err) {
        console.error("Peer List Error", err);
        peersInfo.value = {
          err: "Unable to fetch peers from node",
        };
      }

      peersInfo.value.err ? (showMap.value = false) : (showMap.value = true);
    };

    onMounted(async () => {
      map.value = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
        zoom: 5,
      });
      map.value.addControl(new mapboxgl.FullscreenControl());
    });

    watch(
      () => siriusStore.state.selectedStorageNode,
      async () => {
        peersInfo.value = null;
        await loadDetails();
      }
    );

    loadDetails();

    return {
      showMap,
      peersInfo,
      map,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css";

#map {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 480px;
}
</style>
