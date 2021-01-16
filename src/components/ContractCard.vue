<template>
  <div class="card text-center">
    <div class="card-header">
      <div class="card-subtitle">
        <small class="text-bold">Drives</small>
      </div>
      <div class="card-title h4">
        {{ contractInfo.total }}
      </div>
      <div class="card-subtitle">on Network</div>
    </div>
    <div class="card-body bg-success m-2">
      <FontAwesomeIcon :icon="['fas', 'hdd']" size="lg" />
      Active Contracts: <b>{{ contractInfo.active }}</b>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "ContractCard",
  components: {
    FontAwesomeIcon,
  },
  props: {
    contractInfo: {
      type: Object,
      default: null,
    },
  },
  setup() {
    library.add(faHdd);
  },
};
</script>
