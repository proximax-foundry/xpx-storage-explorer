<template>
  <label class="form-switch">
  <input type="checkbox" :checked="appStore.state.darkTheme" @change="themeChange">
  <i class="form-icon"></i> Dark Theme
  </label>
</template>

<script>
import { inject } from "vue";

export default {
  setup(props, { emit }) {
    const appStore = inject("appStore");

    const themeChange = () => {
      appStore.toggleDarkTheme();
      emit("close-modal");
    };

    return {
      appStore,
      themeChange,
    };
  },
};
</script>
