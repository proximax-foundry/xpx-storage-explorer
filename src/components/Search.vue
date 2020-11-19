<template>
  <div class="input-group full-width">
    <span class="input-group-addon addon-lg">{{ siriusStore.state.networkType.name }}</span>
      <input class="form-input input-lg" type="text" :placeholder="'Search ' + siriusStore.state.networkType.name" />
      <button class="input-group-btn btn btn-lg"><i class="icon icon-search"></i></button>
  </div>
</template>

<script>
export default {
  inject: ["siriusStore"],
};
</script>

<style lang="sass" scoped>
.full-width
  width: 100%
</style>
