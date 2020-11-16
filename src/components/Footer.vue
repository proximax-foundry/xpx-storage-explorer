<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        Copyright {{ thisYear }}. ProximaX. All rights reserved.
        <b>
          Sirius
          <span class="has-text-primary">{{
            siriusStore.state.networkType.name
          }}</span>
          Storage Explorer <span class="has-text-primary">v{{ version }}</span>
        </b>
      </p>
    </div>
  </footer>
</template>

<script>
import { computed } from "vue";
import { version } from "@/../package.json";

export default {
  inject: ["siriusStore"],
  setup() {
    const thisYear = computed(() => new Date().getFullYear());
    return {
      version: version,
      thisYear,
    };
  },
};
</script>
