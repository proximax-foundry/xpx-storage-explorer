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
    <div class="column col-sm-12 text-right">
      <router-link
        v-for="route in $router.options.routes"
        :key="route.path"
        :to="route.path"
        active-class="disabled"
        exact-active-class="text-muted"
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
  </nav>
  <div class="column col-12 text-center">
    <h1>{{ $route.name }}</h1>
  </div>
  <div class="column col-12">
    <Search />
  </div>
</template>
<script>
import { inject, ref } from "vue";
import NodeController from "@/components/NodeController.vue";
import Search from "@/components/Search.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

export default {
  name: "AppHeader",
  components: {
    NodeController,
    Search,
    ThemeSwitcher,
  },
  setup() {
    const appStore = inject("appStore");
    const optionsMenuActive = ref(false);

    return {
      appStore,
      optionsMenuActive,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";

.btn {
  &.btn-link {
    &:focus,
    &:hover {
      text-decoration: underline;
    }
  }
}

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
