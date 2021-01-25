<template>
  <LoadingState v-if="!driveDetails" />
  <ErrorState v-else-if="driveDetails.err" :err="driveDetails.err" />
  <template v-else>
    <ul class="breadcrumb my-2">
      <li v-for="(item, index) in cid" :key="item" class="breadcrumb-item">
        <FontAwesomeIcon
          v-if="index == 0"
          :icon="['fas', 'hdd']"
          size="lg"
          class="mr-2"
        />
        <router-link
          :to="{
            name: 'Drive',
            params: { cid: cid.slice(0, index + 1) },
          }"
        >
          {{ item.substr(0, 15) }}
        </router-link>
      </li>
    </ul>
    <DriveHero :drive-info="driveDetails" />
    <LoadingState v-if="!driveFS" />
    <ErrorState v-else-if="driveFS.err" :err="driveFS.err" />
    <DriveFSAccordions
      v-else
      :folders="driveFS.folders"
      :files="driveFS.files"
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
  props: {
    cid: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const driveDetails = ref(null);
    const driveFS = ref(null);
    library.add(faHdd);

    const removeDrivePath = (accumulator, currentValue, currentIndex) =>
      currentIndex == 1 ? currentValue : accumulator + `/${currentValue}`;

    const loadDriveDetails = async () => {
      try {
        const resp = await axios.get(
          siriusStore.driveHttp(
            internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
              props.cid[0]
            )
          )
        );

        driveDetails.value = resp.data.drive;
      } catch (err) {
        console.error("Drive Details Error", err);
        driveDetails.value = {
          err: "Unable to fetch drive details from selected chain node",
        };
      }
    };

    const loadFileFoldersDetails = async () => {
      try {
        const resp = await axios.get(
          siriusStore.driveLsHttp(
            props.cid[0],
            props.cid.length > 1 ? props.cid.reduce(removeDrivePath) : ""
          )
        );

        driveFS.value = {
          files: [],
          folders: [],
        };

        if (resp.data.List) {
          resp.data.List.forEach((item) => {
            if (item.Type == "file") {
              driveFS.value.files.push(item);
            } else {
              driveFS.value.folders.push(item);
            }
          });
        }
      } catch (err) {
        console.error("DriveFS Error", err);
        driveFS.value = {
          err: "Unable to find files and folders on selected storage node",
        };
      }
    };

    onMounted(async () => {
      await loadDriveDetails();
      if (siriusStore.state.selectedStorageNodeType == "SRN") {
        driveFS.value = {
          err: "Please select a SDN to browse drive files and folders",
        };
      } else {
        await loadFileFoldersDetails();
      }
    });

    watch(
      () => siriusStore.state.selectedChainNode,
      async () => {
        driveDetails.value = null;
        await loadDriveDetails();
      }
    );

    watch(
      () => [siriusStore.state.selectedStorageNode, props.cid],
      async () => {
        driveFS.value = null;
        await loadFileFoldersDetails();
      }
    );

    return {
      driveDetails,
      driveFS,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/breadcrumbs";
</style>
