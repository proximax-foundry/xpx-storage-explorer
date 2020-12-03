<template>
  <div class="input-group has-icon-right">
    <span class="input-group-addon addon-lg">{{
      siriusStore.state.networkType.name
    }}</span>
    <input
      class="form-input input-lg"
      type="text"
      :placeholder="'Search ' + siriusStore.state.networkType.name"
    />
    <i class="form-icon icon icon-search"></i>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  name: "SearchBar",
  setup() {
    const siriusStore = inject("siriusStore");
    return {
      siriusStore,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/mixins/shadow";

.input-group {
  @include shadow-variant($unit-o);
}
</style>
