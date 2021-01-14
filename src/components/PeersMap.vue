<template>
  <div v-show="peerDetails.length != 0" id="map"></div>
  <ErrorState v-if="errorMessage" :err="errorMessage" />
  <template v-else>
    <LoadingState v-if="peerDetails.length == 0" />
    <div v-else class="card">
      <div class="card-body">
        <table class="table table-striped table-hover table-stack">
          <thead>
            <tr>
              <th>ID</th>
              <th>Public Key</th>
              <th>Host</th>
              <th>Location</th>
              <th>Type</th>
            </tr>
          </thead>
          <transition-group name="peer-table" tag="tbody">
            <tr
              v-for="item in peerDetails"
              :key="item.id"
              :class="{
                'c-hand': item.details.longitude && item.details.latitude,
              }"
              @click="
                item.details.longitude && item.details.latitude
                  ? mapFocus(item.details.longitude, item.details.latitude)
                  : null
              "
            >
              <td data-th="ID">
                {{ item.id }}
              </td>
              <td data-th="Public Key">
                {{ $filters.peerIdToPublicKey(item.id).substr(0, 15) }}...
              </td>
              <td data-th="Host">{{ item.details.IPv4 }}</td>
              <td data-th="Location">{{ item.details.country_name }}</td>
              <td data-th="Type">{{ item.type }}</td>
            </tr>
          </transition-group>
        </table>
      </div>
    </div>
  </template>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import { inject, onMounted, ref, watch } from "vue";
import axios from "axios";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";

export default {
  name: "PeersMap",
  components: {
    ErrorState,
    LoadingState,
  },
  setup() {
    const siriusStore = inject("siriusStore");
    const map = ref(null);
    const mapMarkers = ref([]);
    const peerDetails = ref([]);
    const mapMarker = require("@/assets/map-pointer.svg");
    const errorMessage = ref(null);

    mapboxgl.accessToken =
      "pk.eyJ1Ijoiai1tb3JhMTUiLCJhIjoiY2p5MGY4a2RhMDJqZjNucXh0anl0ZDd2eCJ9.Lsq-ETN03fbVIctkd9lV3Q";

    const mapFocus = (longitude, latitude) => {
      map.value.flyTo({ center: [longitude, latitude] });
    };

    const loadDetails = async () => {
      try {
        const resp = await axios.get(siriusStore.peersHttp);

        for (let i = 0; i < resp.data.Peers.length; i++) {
          try {
            const peerDetail = resp.data.Peers[i].Addrs[0].split("/");
            const ipDetail = await axios.get(
              `https://geolocation-db.com/json/${peerDetail[2]}`
            );

            if (
              ipDetail.data.IPv4 == "Not found" ||
              peerDetails.value.find(
                (element) =>
                  element.id == resp.data.Peers[i].ID &&
                  element.details.IPv4 == ipDetail.data.IPv4
              )
            ) {
              continue;
            }

            peerDetails.value.push({
              id: resp.data.Peers[i].ID,
              type: peerDetail[4] == 63666 ? "SDN" : "SRN",
              details: ipDetail.data,
            });

            var figure = document.createElement("figure");
            figure.className = "avatar";
            var image = document.createElement("img");
            image.style.width = "40px";
            image.style.height = "52px";
            image.src = mapMarker;
            figure.appendChild(image);

            mapMarkers.value.push(
              new mapboxgl.Marker(figure)
                .setLngLat([ipDetail.data.longitude, ipDetail.data.latitude])
                .setPopup(
                  new mapboxgl.Popup().setHTML(
                    "<p><strong>" +
                      resp.data.Peers[i].ID.substr(0, 15) +
                      "</strong><br />(" +
                      ipDetail.data.IPv4 +
                      ")</p>"
                  )
                )
                .addTo(map.value)
            );
          } catch (err) {
            console.error("IP Geolocation Error", err);
          }
        }

        if (peerDetails.value.length == 0 && resp.data.Peers.length > 0) {
          errorMessage.value =
            "Please check if 'https://geolocation-db.com' is blocked by your AdBlocker and unblock it to view more information on each peer node";
        } else {
          mapFocus(
            peerDetails.value[0].details.longitude,
            peerDetails.value[0].details.latitude
          );
        }
      } catch (err) {
        console.error("Peer List Error", err);
        errorMessage.value = "Unable to fetch peers from node";
      }
    };

    onMounted(async () => {
      // Timeout is used to allow browser to generate map container fully before drawing map
      setTimeout(() => {
        map.value = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/light-v10",
          zoom: 5,
        });
        map.value.addControl(new mapboxgl.FullscreenControl());
      }, 1000);

      await loadDetails();
    });

    watch(
      () => siriusStore.state.selectedStorageNode,
      async () => {
        mapMarkers.value.forEach((marker) => marker.remove());
        peerDetails.value = [];
        mapMarkers.value = [];
        errorMessage.value = null;
        await loadDetails();
      }
    );

    return {
      errorMessage,
      mapFocus,
      peerDetails,
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

.marker {
  display: block;
  border: none;
  border-radius: 50%;
  padding: 0;
}

.peer-table-move {
  transition: all 1s ease;
}

.peer-table-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
