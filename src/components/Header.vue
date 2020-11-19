<template>
  <nav id="navMenu" class="navbar mb-2 p-2 p-fixed">
    <div class="navbar-section">
      <router-link to="/" class="navbar-brand d-inline-flex">
        <img
          src="@/assets/logo-name.png"
          alt="ProximaX Logo"
          width="150"
        />
        <div class="divider-vert"></div>
        <small class="label label-secondary text-bold">{{ appStore.name }} v{{ appStore.version }}</small>
      </router-link>
    </div>
    <div class="navbar-center">
      <button class="btn btn-link btn-action btn-lg" href="#navbarModal" @click="$emit('update:modalActive', !modalActive)">
        <i class="icon icon-menu"></i>
      </button>
    </div>
    <div class="navbar-section">
      <teleport :disabled="!modalActive" to="#navbarSearch">
        <Search />
      </teleport>
    </div>
    <div class="navbar-section">
      <teleport :disabled="!modalActive" to="#navbarEnd">
        <router-link
          v-for="route in $router.options.routes.slice(1)"
          :key="route.path"
          :to="route.path"
          active-class="disabled"
          exact-active-class="text-error"
          class="btn btn-link mr-1"
          @click="closeModal"
        >
          {{ route.name }}
        </router-link>
        <div class="dropdown dropdown-right">
          <button class="btn btn-link dropdown-toggle" tabindex="0">
            <i class="icon icon-more-vert"></i>
          </button>
          <ul class="menu">
            <li class="menu-item">
              <ThemeSwitcher @close-modal="closeModal" />
            </li>
            <li class="menu-item">
              <NodeController @close-modal="closeModal" />
            </li>
          </ul>
        </div>
      </teleport>
    </div>
  </nav>
</template>
<script>
import NodeController from "@/components/NodeController.vue";
import Search from "@/components/Search.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

export default {
  components: {
    NodeController,
    Search,
    ThemeSwitcher,
  },
  inject: ["appStore"],
  props: {
    modalActive: Boolean,
  },
  setup(props, { emit }) {
    const closeModal = () => {
      if (props.modalActive) {
        emit("update:modalActive", false);
      }
    };

    return {
      closeModal,
    };
  },
};
</script>

<style lang="sass" scoped>
</style>
