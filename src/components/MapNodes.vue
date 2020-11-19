<template>
  <div class="card">
    <div class="card-image">
      <div id="map"></div>
    </div>
    <div class="card-body">
      <table class="table table-striped table-hover table-stack">
        <thead>
          <tr>
            <th>Name</th>
            <th>Host</th>
            <th>Public Key</th>
            <th>Version</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <transition-group name="node-table" tag="tbody">
          <tr
            v-for="item in tableData"
            :key="item.publicKey"
            class="c-hand"
            @click="
              item.longitude && item.latitude
                ? mapFocus(item.longitude, item.latitude)
                : null
            "
          >
            <td data-th="Name">{{ item.name }}</td>
            <td data-th="Host">{{ item.host }}</td>
            <td data-th="Public Key">{{ item.publicKey.substr(0, 10) }}</td>
            <td data-th="Version">{{ item.version }}</td>
            <td data-th="Location">{{ item.location }}</td>
            <td :class="[item.class]" data-th="Status">{{ item.status }}</td>
          </tr>
        </transition-group>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";

export default {
  name: "MapNodes",
  async setup() {
    const map = ref(null);
    const mapMarker = require("@/assets/map-pointer.svg");
    const peerList = ref(null);
    const nodeInfo = ref(null);
    const peerData = ref([]);

    mapboxgl.accessToken =
      "pk.eyJ1Ijoiai1tb3JhMTUiLCJhIjoiY2p5MGY4a2RhMDJqZjNucXh0anl0ZDd2eCJ9.Lsq-ETN03fbVIctkd9lV3Q";

    const mapFocus = (longitude, latitude) => {
      map.value.jumpTo({ center: [longitude, latitude] });
    };

    const pushData = (node, details, styleClass) => {
      let nodeStatus = "";
      switch (styleClass) {
        case "text-success":
          nodeStatus = "Active";
          break;
        case "text-warning":
          nodeStatus = "Inactive";
          break;
        case "text-gray":
          nodeStatus = "Busy";
          break;
        default:
          nodeStatus = "Not Available";
      }

      peerData.value.push({
        name: node.identity.name,
        host: node.endpoint.host,
        publicKey: node.identity["public-key"],
        version: node.metaData.version,
        location: details.data.country_name,
        longitude: details.data.longitude,
        latitude: details.data.latitude,
        status: nodeStatus,
        class: styleClass,
      });

      var figure = document.createElement("figure");
      figure.className = "avatar";
      var image = document.createElement("img");
      image.style.width = "40px";
      image.style.height = "52px";
      image.src = mapMarker;
      figure.appendChild(image);

      new mapboxgl.Marker(figure)
        .setLngLat([details.data.longitude, details.data.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            "<p><strong>" +
              node.identity.name +
              "</strong> (" +
              node.endpoint.host +
              ")</p>"
          )
        )
        .addTo(map.value);
    };

    onMounted(async () => {
      if (peerList.value != null && peerList.value.status == 200) {
        let details = null;
        try {
          details = await axios.get(
            "http://geolocation-db.com/json/176.9.68.110"
          );

          map.value = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/light-v10",
            center: [details.data.longitude, details.data.latitude],
            zoom: 5,
          });
          map.value.addControl(new mapboxgl.FullscreenControl());

          pushData(nodeInfo.value.data, details, "text-success");
        } catch (err) {
          console.error("Geo Location DB Error", err);
          throw "Cannot connect to current node";
        }

        for (let i = 0; i < 10; i++) {
          try {
            details = await axios.get(
              "http://geolocation-db.com/json/" +
                peerList.value.data.active[i].endpoint.host
            );
            pushData(peerList.value.data.active[i], details, "text-success");
          } catch (err) {
            console.error("Geo Location DB Error", err);
            peerData.value.push({
              name: peerList.value.data.active[i].endpoint.host,
              host: peerList.value.data.active[i].endpoint.host,
              publicKey: "",
              version: "",
              location: "Unknown",
              status: "Not Available",
              class: "text-error",
            });
          }
        }

        peerList.value.data.inactive.forEach(async (node) => {
          try {
            details = await axios.get(
              "http://geolocation-db.com/json/" + node.endpoint.host
            );
            pushData(node, details, "text-warning");
          } catch (err) {
            console.error("Geo Location DB Error", err);
            peerData.value.push({
              name: node.endpoint.host,
              host: node.endpoint.host,
              publicKey: "",
              version: "",
              location: "Unknown",
              status: "Not Available",
              class: "text-error",
            });
          }
        });

        peerList.value.data.busy.forEach(async (node) => {
          try {
            details = await axios.get(
              "http://geolocation-db.com/json/" + node.endpoint.host
            );
            pushData(node, details, "text-gray");
          } catch (err) {
            console.error("Geo Location DB Error", err);
            peerData.value.push({
              name: node.endpoint.host,
              host: node.endpoint.host,
              publicKey: "",
              version: "",
              location: "Unknown",
              status: "Not Available",
              class: "text-error",
            });
          }
        });

        peerList.value.data.failure.forEach(async (node) => {
          try {
            details = await axios.get(
              "http://geolocation-db.com/json/" + node.endpoint.host
            );
            pushData(node, details, "text-error");
          } catch (err) {
            console.error("Geo Location DB Error", err);
            peerData.value.push({
              name: node.endpoint.host,
              host: node.endpoint.host,
              publicKey: "",
              version: "",
              location: "Unknown",
              status: "Not Available",
              class: "text-error",
            });
          }
        });
      }
    });

    peerList.value = await axios.get(
      "http://176.9.68.110:7890/node/peer-list/all"
    );
    nodeInfo.value = await axios.get("http://176.9.68.110:7890/node/info");

    return {
      mapFocus,
      tableData: peerData,
    };
  },
};
</script>

<style lang="sass" scoped>
@import "https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"

#map
  position: relative
  top: 0
  bottom: 0
  width: 100%
  height: 480px

.marker
  display: block
  border: none
  border-radius: 50%
  padding: 0

.node-table-move
  transition: all 1s ease

.node-table-enter-from
  opacity: 0
  transform: translateY(30px)
</style>
