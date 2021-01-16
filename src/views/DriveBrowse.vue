<template>
  <LoadingState v-if="!driveDetails" />
  <ErrorState v-else-if="driveDetails.err" :err="driveDetails.err" />
  <template v-else>
    <ul class="breadcrumb my-2">
      <li
        v-for="(item, index) in $route.params.cid"
        :key="item"
        class="breadcrumb-item"
      >
        <FontAwesomeIcon
          v-if="index == 0"
          :icon="['fas', 'hdd']"
          size="lg"
          class="mr-2"
        />
        <router-link
          :to="{
            name: 'Drive',
            params: { cid: $route.params.cid.slice(0, index + 1) },
          }"
        >
          {{ item.substr(0, 15) }}
        </router-link>
      </li>
    </ul>
    <DriveHero :drive-info="driveDetails.data" />
    <DriveFSAccordions
      :folders="driveDetails.folders"
      :files="driveDetails.files"
    />
  </template>
</template>

<script>
import DriveHero from "@/components/DriveHero.vue";
import DriveFSAccordions from "@/components/DriveFSAccordions.vue";
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getCurrentInstance, inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  name: "DriveBrowse",
  components: {
    DriveHero,
    DriveFSAccordions,
    ErrorState,
    FontAwesomeIcon,
    LoadingState,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const route = useRoute();
    const driveDetails = ref(null);
    library.add(faHdd);

    const removeDrivePath = (accumulator, currentValue, currentIndex) =>
      currentIndex == 1 ? currentValue : accumulator + `/${currentValue}`;

    const loadDetails = async () => {
      try {
        const resp = await Promise.all([
          axios.get(
            `${
              siriusStore.state.selectedChainNode
            }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
              route.params.cid[0]
            )}`
          ),
          axios.get(
            siriusStore.driveLsHttp(
              route.params.cid[0],
              route.params.cid.length > 1
                ? route.params.cid.reduce(removeDrivePath)
                : ""
            )
          ),
        ]);

        driveDetails.value = {
          data: resp[0].data.drive,
          files: [],
          folders: [],
        };

        if (resp[1].data.List) {
          resp[1].data.List.forEach((item) => {
            if (item.Type == "file") {
              driveDetails.value.files.push(item);
            } else {
              driveDetails.value.folders.push(item);
            }
          });
        }
      } catch (err) {
        console.error("Drive Details Error", err);
        driveDetails.value = {
          err: "Unable to fetch drive details from selected node",
        };
      }
    };

    onMounted(async () => {
      await loadDetails();
    });

    watch(
      () => [
        siriusStore.state.selectedChainNode,
        siriusStore.state.selectedStorageNode,
        route.params.cid,
      ],
      async () => {
        driveDetails.value = null;
        await loadDetails();
      }
    );

    return {
      driveDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/breadcrumbs";
</style>
