<template>
  <select
    class="form-select"
    @change="siriusStore.selectNewNode($event.target.value)"
  >
    <option
      v-for="(item, index) in siriusStore.state.nodes"
      :key="index"
      :value="index"
    >
      {{ item }}
    </option>
    <hr />
  </select>
</template>

<script>
export default {
  inject: ["siriusStore"],
};
</script>
