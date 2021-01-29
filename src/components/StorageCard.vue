<template>
  <div class="card text-center">
    <div class="card-header">
      <div class="card-subtitle">
        <small class="text-bold">Used Storage</small>
      </div>
      <div class="card-title h4">
        {{ $filters.bytesToSize(storageInfo.used) }}
      </div>
      <div class="card-subtitle">on Network</div>
    </div>
    <div class="card-body bg-gradient text-light m-2">
      <FontAwesomeIcon :icon="['fas', 'cloud-upload-alt']" size="lg" />
      Available Storage:
      <b>{{ $filters.bytesToSize(storageInfo.available) }}</b>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "StorageCard",
  components: {
    FontAwesomeIcon,
  },
  props: {
    storageInfo: {
      type: Object,
      default: null,
    },
  },
  setup() {
    library.add(faCloudUploadAlt);
  },
};
</script>
