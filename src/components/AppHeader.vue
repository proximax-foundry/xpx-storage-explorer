<template>
  <nav class="columns">
    <div class="column text-left">
      <router-link to="/" class="btn btn-link logo d-inline-flex">
        <img
          class="img-responsive"
          src="@/assets/logo-name.png"
          alt="ProximaX Logo"
          width="150"
        />
        <span class="divider-vert"></span>
        <small class="label label-secondary text-bold"
          >{{ appStore.name }} v{{ appStore.version }}</small
        >
      </router-link>
    </div>
    <div class="column col-md-12 text-right">
      <router-link
        v-for="route in $router.options.routes"
        :key="route.path"
        v-slot="{ navigate, href, isActive, isExactActive }"
        :to="route.path"
        custom
      >
        <a
          v-if="route.meta.showOnNav"
          :href="href"
          class="btn btn-link mr-1"
          :class="{
            'text-muted': isActive,
            disabled: isExactActive,
          }"
          @click="navigate"
        >
          {{ route.name }}
        </a>
      </router-link>
      <div class="dropdown dropdown-right">
        <button class="btn btn-link dropdown-toggle" tabindex="0">
          <i class="icon icon-more-vert"></i>
        </button>
        <ul class="menu">
          <li class="menu-item">
            <ThemeSwitcher />
          </li>
          <li class="menu-item">
            <NodesController />
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="column col-12 text-center">
    <h1>{{ $route.meta.title || $route.name }}</h1>
  </div>
  <div class="column col-12">
    <SearchBar />
  </div>
</template>
<script>
import { inject } from "vue";
import NodesController from "@/components/NodesController.vue";
import SearchBar from "@/components/SearchBar.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

export default {
  name: "AppHeader",
  components: {
    NodesController,
    SearchBar,
    ThemeSwitcher,
  },
  setup() {
    const appStore = inject("appStore");

    return {
      appStore,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/mixins/shadow";
@import "spectre.css/src/menus";
@import "spectre.css/src/dropdowns";

.column {
  margin: $unit-2 0;
  padding: $unit-2;
}

.logo {
  align-items: center;
  -ms-flex-align: center;
}

.menu {
  min-width: $control-width-md;
}

@media (max-width: $size-md) {
  .menu {
    min-width: $control-width-sm;
  }
}
</style>
