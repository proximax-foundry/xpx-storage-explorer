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
export default {
  name: "Search",
  inject: ["siriusStore"],
};
</script>
