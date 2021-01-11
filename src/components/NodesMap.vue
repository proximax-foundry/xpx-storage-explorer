<template>
  <div class="card">
    <div class="card-image">
      <div id="map"></div>
    </div>
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
        <transition-group name="node-table" tag="tbody">
          <tr
            v-for="item in tableData"
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

<script>
import { inject, ref, onMounted } from "vue";
import axios from "axios";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";

export default {
  name: "NodesMap",
  setup() {
    const siriusStore = inject("siriusStore");
    const map = ref(null);
    const nodeDetails = ref([]);
    const mapMarker = require("@/assets/map-pointer.svg");

    mapboxgl.accessToken =
      "pk.eyJ1Ijoiai1tb3JhMTUiLCJhIjoiY2p5MGY4a2RhMDJqZjNucXh0anl0ZDd2eCJ9.Lsq-ETN03fbVIctkd9lV3Q";

    const mapFocus = (longitude, latitude) => {
      map.value.jumpTo({ center: [longitude, latitude] });
    };

    const pushData = (peerId, peerIp, nodeType, geolocationDetails) => {
      nodeDetails.value.push({
        id: peerId,
        type: nodeType,
        details: geolocationDetails,
      });

      var figure = document.createElement("figure");
      figure.className = "avatar";
      var image = document.createElement("img");
      image.style.width = "40px";
      image.style.height = "52px";
      image.src = mapMarker;
      figure.appendChild(image);

      if (
        geolocationDetails.longitude != "Not found" &&
        geolocationDetails.latitude != "Not found"
      ) {
        new mapboxgl.Marker(figure)
          .setLngLat([
            geolocationDetails.longitude,
            geolocationDetails.latitude,
          ])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              "<p><strong>" +
                peerId.substr(0, 15) +
                "</strong><br />(" +
                geolocationDetails.IPv4 +
                ")</p>"
            )
          )
          .addTo(map.value);
      } else {
        geolocationDetails.longitude = null;
        geolocationDetails.longitude = null;
      }
    };

    onMounted(async () => {
      const resp = await axios.get(siriusStore.peersHttp);

      resp.data.Peers.forEach(async (peer) => {
        const peerDetail = peer.Addrs[0].split("/");
        const ipDetail = await axios.get(
          `https://geolocation-db.com/json/${peerDetail[2]}`
        );

        if (ipDetail.data.IPv4 == "Not found") {
          return;
        }

        if (nodeDetails.value.length == 0) {
          map.value = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/light-v10",
            center: [ipDetail.data.longitude, ipDetail.data.latitude],
            zoom: 5,
          });
          map.value.addControl(new mapboxgl.FullscreenControl());
        }

        pushData(
          peer.ID,
          peerDetail[2],
          peerDetail[4] == 63666 ? "SDN" : "SRN",
          ipDetail.data
        );
      });
    });

    return {
      mapFocus,
      tableData: nodeDetails,
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

.node-table-move {
  transition: all 1s ease;
}

.node-table-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
