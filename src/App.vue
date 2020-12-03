<template>
  <header>
    <section class="container grid-xl">
      <keep-alive>
        <AppHeader />
      </keep-alive>
    </section>
  </header>

  <section class="container grid-xl full-height">
    <router-view v-slot="{ Component }">
      <SuspenseTemplate>
        <template #default>
          <component :is="Component" :key="$route.path" />
        </template>
      </SuspenseTemplate>
    </router-view>
  </section>

  <footer>
    <section class="container grid-xl">
      <AppFooter />
    </section>
  </footer>
</template>

<script>
import { provide } from "vue";
import { appStore } from "@/store/app";
import { siriusStore } from "@/store/sirius";
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import SuspenseTemplate from "@/components/SuspenseLoadErrorTemplate.vue";

export default {
  name: appStore.name,
  components: {
    AppFooter,
    AppHeader,
    SuspenseTemplate,
  },
  setup() {
    provide("appStore", appStore);
    provide("siriusStore", siriusStore);
  },
};
</script>

<style lang="scss">
@import "@/assets/main";

#app {
  min-width: $size-sm;
  background: $gray-color-light;
}

header {
  background: $secondary-color;
  margin-bottom: $unit-2;
}

footer {
  background: $light-color;
  margin-top: $unit-2;
}

.full-height {
  min-height: 100vh;
}
</style>
