<template>
  <template v-if="err">
    <Error :err="err" />
  </template>
  <Suspense v-else>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script>
import { onErrorCaptured, ref } from "vue";
import Loading from "@/components/Loading.vue";
import Error from "@/components/Error.vue";

export default {
  components: {
    Loading,
    Error,
  },
  setup() {
    const err = ref(null);

    onErrorCaptured((e) => {
      err.value = e;
      return true;
    });

    return {
      err,
    };
  },
};
</script>
