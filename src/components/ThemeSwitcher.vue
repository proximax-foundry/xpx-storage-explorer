<template>
  <label class="form-switch">
    <input
      type="checkbox"
      :checked="appStore.state.darkTheme"
      @change="appStore.toggleDarkTheme()"
    />
    <i class="form-icon"></i> Dark Theme
  </label>
</template>

<script>
export default {
  name: "ThemeSwitcher",
  inject: ["appStore"],
};
</script>
