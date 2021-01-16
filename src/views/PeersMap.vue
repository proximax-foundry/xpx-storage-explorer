<template>
  <div class="card">
    <div v-show="showMap" class="card-image">
      <div id="map"></div>
    </div>
    <div class="card-body">
      <ErrorState v-if="!peersInfo" err="Unable to fetch peers from node" />
      <LoadingState v-else-if="peersInfo.length == 0" />
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
    const showMap = ref(true);
    const map = ref(null);
    const peersInfo = ref([]);

    mapboxgl.accessToken =
      "pk.eyJ1Ijoiai1tb3JhMTUiLCJhIjoiY2p5MGY4a2RhMDJqZjNucXh0anl0ZDd2eCJ9.Lsq-ETN03fbVIctkd9lV3Q";

    const loadDetails = async () => {
      try {
        const peers = await axios.get(siriusStore.peersHttp);
        peersInfo.value = peers.data.Peers;
        showMap.value = true;
      } catch (err) {
        console.error("Peer List Error", err);
        peersInfo.value = null;
        showMap.value = false;
      }
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
        peersInfo.value = [];
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
