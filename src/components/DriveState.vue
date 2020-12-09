<template>
  <ul class="breadcrumb my-2">
    <li class="breadcrumb-item">
      <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" />&nbsp;
      <router-link
        :to="{
          name: 'Drive Details',
          params: { cid: driveDetails.drive },
        }"
      >
        {{ driveDetails.drive.substr(0, 15) }}
      </router-link>
    </li>
  </ul>
  <div v-if="driveDetails.replicas == 0" class="hero hero-sm bg-error my-2">
    <div class="hero-body">
      <p>Not Active</p>
      <h1>{{ driveDetails.drive.substr(0, 15) }}...</h1>
    </div>
  </div>
  <div
    v-else-if="driveDetails.replicas < driveDetails.minReplicators"
    class="hero hero-sm bg-warning my-2"
  >
    <div class="hero-body">
      <p>Pending</p>
      <h1>{{ driveDetails.drive.substr(0, 15) }}...</h1>
    </div>
  </div>
  <div v-else class="hero hero-sm bg-success my-2">
    <div class="hero-body">
      <p>Active</p>
      <h1>{{ driveDetails.drive.substr(0, 15) }}...</h1>
    </div>
  </div>
  <div v-if="driveDetails.Folders.length > 0" class="columns mx-2">
    <div class="column col-12 p-2 text-bold">Folders</div>
    <div
      v-for="item in driveDetails.Folders"
      :key="item.Cid"
      class="column card mb-2 mr-2 p-0"
    >
      <div class="card-header">
        <div class="card-title h5">{{ item.Name }}</div>
      </div>
      <div class="card-body">
        <div>Cid:</div>
        <div class="text-bold">{{ item.Cid["/"] }}</div>
      </div>
    </div>
  </div>
  <div v-if="driveDetails.Files.length > 0" class="columns mx-2">
    <div class="column col-12 p-2 text-bold">Files</div>
    <div
      v-for="item in driveDetails.Files"
      :key="item.Cid"
      class="column card mb-2 mr-2 p-0"
    >
      <div class="card-header">
        <div class="card-title h5">{{ item.Name }}</div>
      </div>
      <div class="card-body">
        <div>Cid:</div>
        <div class="text-bold">{{ item.Cid["/"] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

library.add(faHdd);

export default {
  name: "DriveState",
  components: {
    FontAwesomeIcon,
  },
  async setup() {
    const route = useRoute();
    const driveDetails = ref(null);

    const driveData = await axios.get(
      `/mock/testnet1.dfms.io/${route.params.cid}.json`
    );

    const files = new Array();
    const folders = new Array();
    if (driveData.data.list) {
      driveData.data.list.forEach((driveItem) => {
        driveData.data.List.forEach((item) => {
          if (item.Name == driveItem) {
            if (item.Type == "file") {
              files.push(item);
            } else {
              folders.push(item);
            }
            return;
          }
        });
      });
    }

    driveDetails.value = driveData.data.Contract;
    driveDetails.value.Files = files;
    driveDetails.value.Folders = folders;

    return {
      driveDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "spectre.css/src/variables";
@import "spectre.css/src/mixins/shadow";
@import "spectre.css/src/hero";
@import "spectre.css/src/breadcrumbs";

.hero {
  @include shadow-variant($unit-1);
}
</style>
