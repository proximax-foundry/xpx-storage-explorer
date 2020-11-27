<template>
  <header>
    <keep-alive>
      <Header />
    </keep-alive>
  </header>

  <section class="container grid-xl full-height">
    <router-view v-slot="{ Component }">
      <Susp>
        <template #default>
          <component :is="Component" :key="$route.path" />
        </template>
      </Susp>
    </router-view>
  </section>

  <footer>
    <Footer />
  </footer>
</template>

<script>
import Header from "@/components/Header.vue";
import Susp from "@/components/SuspenseLoadError.vue";
import Footer from "@/components/Footer.vue";
import { siriusStore } from "@/store/sirius";
import { appStore } from "@/store/app";

export default {
  name: appStore.name,
  components: {
    Header,
    Susp,
    Footer,
  },
  provide: {
    appStore,
    siriusStore,
  },
};
</script>

<style lang="scss">
@import "./assets/main.scss";

body {
  background: $gray-color-light;
}

.full-height {
  min-height: 100vh;
}
</style>
