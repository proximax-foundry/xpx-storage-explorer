<template>
  <Susp>
    <template #default>
      <Map />
    </template>
  </Susp>
</template>

<script>
import Susp from "@/components/SuspenseLoadError.vue";
import Map from "@/components/Map.vue";

export default {
  components: {
    Susp,
    Map,
  },
};
</script>
