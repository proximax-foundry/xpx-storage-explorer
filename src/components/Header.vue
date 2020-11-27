<template>
  <nav class="header">
    <div class="columns my-2">
      <div class="column col-auto text-left">
        <router-link to="/" class="logo d-inline-flex">
          <img
            class="img-responsive"
            src="@/assets/logo-name.png"
            alt="ProximaX Logo"
            width="150"
          />
          <div class="divider-vert"></div>
          <small class="label label-secondary text-bold"
            >{{ appStore.name }} v{{ appStore.version }}</small
          >
        </router-link>
      </div>
      <div class="column col-md-12">
        <Search />
      </div>
      <div class="column col-lg-12 col-auto text-right">
        <router-link
          v-for="route in $router.options.routes.slice(1)"
          :key="route.path"
          :to="route.path"
          active-class="disabled"
          exact-active-class="text-error"
          class="btn btn-link mr-1"
        >
          {{ route.name }}
        </router-link>
        <div
          class="dropdown dropdown-right"
          :class="{ active: optionsMenuActive }"
        >
          <button
            class="btn btn-link dropdown-toggle"
            tabindex="0"
            @click="optionsMenuActive = !optionsMenuActive"
          >
            <i class="icon icon-more-vert"></i>
          </button>
          <ul class="menu">
            <li class="menu-item">
              <ThemeSwitcher />
            </li>
            <li class="menu-item">
              <NodeController />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import { ref } from "vue";
import NodeController from "@/components/NodeController.vue";
import Search from "@/components/Search.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

export default {
  name: "Header",
  components: {
    NodeController,
    Search,
    ThemeSwitcher,
  },
  inject: ["appStore"],
  setup() {
    const optionsMenuActive = ref(false);

    return {
      optionsMenuActive,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";

.header {
  top: 0;
  width: 100%;
  position: sticky;
  margin-bottom: $unit-2;
  padding: $unit-2 $unit-2;
  background: $secondary-color-dark;
  z-index: 100;

  .column {
    margin: $unit-2 0;
    padding: $unit-2 $unit-2;
  }
}

.logo {
  align-items: center;
  -ms-flex-align: center;
}

.menu {
  min-width: $control-width-md;
}
</style>
