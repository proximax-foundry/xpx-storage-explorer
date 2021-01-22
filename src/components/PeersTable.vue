<template>
  <ErrorState v-if="errorMessage" :err="errorMessage" />
  <table
    v-else
    class="table table-striped table-stack"
    :class="{ 'table-hover': map }"
  >
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
          'c-hand': map && item.details[lngField] && item.details[latField],
          'bg-secondary': item.id == $route.query.peerId,
        }"
        @click="
          map && item.details[lngField] && item.details[latField]
            ? mapFocus(item.details[lngField], item.details[latField])
            : null
        "
      >
        <td data-th="Id">{{ item.id }}</td>
        <td data-th="Public Key">
          <a
            :href="explorerPublicKeyHttp($filters.peerIdToPublicKey(item.id))"
            target="_blank"
          >
            {{ $filters.peerIdToPublicKey(item.id) }}
          </a>
        </td>
        <td data-th="Host">{{ item.details[ipField] }}</td>
        <td data-th="Location">{{ item.details[countryField] }}</td>
        <td data-th="Type">{{ item.type }}</td>
      </tr>
    </transition-group>
  </table>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import { inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";

export default {
  name: "PeersTable",
  components: {
    ErrorState,
  },
  props: {
    map: {
      type: Object,
      default: null,
    },
    peersInfo: {
      type: Array,
      default: () => [],
    },
    limitResults: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:showMap"],
  setup(props, context) {
    const appStore = inject("appStore");
    const route = useRoute();
    const peerDetails = ref([]);
    const errorMessage = ref(null);
    const mapMarkers = ref([]);
    const mapMarker = require("@/assets/map-pointer.svg");

    const mapFocus = (longitude, latitude) => {
      props.map.flyTo({ center: [longitude, latitude] });
    };

    const loadDetails = async () => {
      for (let i = 0; i < props.peersInfo.length; i++) {
        try {
          const peerDetail = props.peersInfo[i].Addrs[0].split("/");
          const ipDetail = await axios.get(
            appStore.ipLocationHttp(peerDetail[2])
          );

          if (
            ipDetail.data[appStore.ipLocation.ipField] == "Not found" ||
            peerDetails.value.find(
              (element) =>
                element.id == props.peersInfo[i].ID &&
                element.details[appStore.ipLocation.ipField] ==
                  ipDetail.data[appStore.ipLocation.ipField]
            )
          ) {
            continue;
          }

          if (route.query.peerId == props.peersInfo[i].ID) {
            peerDetails.value.unshift({
              id: props.peersInfo[i].ID,
              type: peerDetail[4] == 63666 ? "SDN" : "SRN",
              details: ipDetail.data,
            });
          } else {
            peerDetails.value.push({
              id: props.peersInfo[i].ID,
              type: peerDetail[4] == 63666 ? "SDN" : "SRN",
              details: ipDetail.data,
            });
          }

          if (props.map) {
            var figure = document.createElement("figure");
            figure.className = "avatar";
            var image = document.createElement("img");
            image.style.width = "48px";
            image.style.height = "48px";
            image.src = mapMarker;
            figure.appendChild(image);

            mapMarkers.value.push(
              new mapboxgl.Marker(figure)
                .setLngLat([
                  ipDetail.data[appStore.ipLocation.longitudeField],
                  ipDetail.data[appStore.ipLocation.latitudeField],
                ])
                .setPopup(
                  new mapboxgl.Popup({
                    offset: [40, -20],
                    maxWidth: "none",
                    focusAfterOpen: false,
                  }).setHTML(
                    "<p><strong>" +
                      props.peersInfo[i].ID +
                      "</strong><br />(" +
                      ipDetail.data[appStore.ipLocation.ipField] +
                      ")</p>"
                  )
                )
                .addTo(props.map)
            );
          } else if (
            props.limitResults > 0 &&
            peerDetails.value.length == props.limitResults
          ) {
            break;
          }
        } catch (err) {
          console.error("IP Geolocation Error", err);
        }
      }

      if (peerDetails.value.length > 0) {
        if (props.map) {
          mapFocus(
            peerDetails.value[0].details[appStore.ipLocation.longitudeField],
            peerDetails.value[0].details[appStore.ipLocation.latitudeField]
          );
          context.emit("update:showMap", true);
        }
      } else {
        if (props.peersInfo.length > 0) {
          errorMessage.value =
            "Please check if " +
            appStore.ipLocation.url +
            " is blocked by your AdBlocker and unblock it to view more information on each peer node";
        }

        if (props.map) {
          context.emit("update:showMap", false);
        }
      }
    };

    onMounted(async () => {
      await loadDetails();
    });

    watch(
      () => props.peersInfo,
      async () => {
        mapMarkers.value.forEach((marker) => marker.remove());
        mapMarkers.value = [];
        peerDetails.value = [];
        errorMessage.value = null;
        await loadDetails();
      }
    );

    return {
      errorMessage,
      explorerPublicKeyHttp: appStore.explorerPublicKeyHttp,
      ipField: appStore.ipLocation.ipField,
      countryField: appStore.ipLocation.countryField,
      lngField: appStore.ipLocation.longitudeField,
      latField: appStore.ipLocation.latitudeField,
      mapFocus,
      peerDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/mixins/avatar";
@import "spectre.css/src/avatars";

.table {
  table-layout: fixed;
  width: 100%;

  th:nth-child(2),
  th:nth-child(3),
  th:nth-child(4) {
    width: 15%;
  }

  th:nth-child(5) {
    width: 5%;
  }

  td:nth-child(2) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &.table-striped {
    tbody {
      tr:nth-of-type(even) {
        background: $light-color;
      }
    }
  }

  &.table-hover {
    tbody {
      tr {
        &:hover {
          background: $bg-color-dark;
        }
      }
    }
  }
}

.peer-table-move {
  transition: all 1s ease;
}

.peer-table-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
