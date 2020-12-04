<template>
  <template v-if="err">
    <ErrorState :err="err" />
  </template>
  <Suspense v-else>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #fallback>
      <LoadingState />
    </template>
  </Suspense>
</template>

<script>
import { onErrorCaptured, ref } from "vue";
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";

export default {
  name: "SuspenseLoadErrorTemplate",
  components: {
    ErrorState,
    LoadingState,
  },
  setup() {
    const err = ref(null);

    onErrorCaptured((e) => {
      console.error("Error Captured Suspense Template", e);
      err.value = "An error has occured, please try a new node";
      return true;
    });

    return {
      err,
    };
  },
};
</script>
