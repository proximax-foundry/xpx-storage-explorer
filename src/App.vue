<template>
  <header>
    <Header />
  </header>

  <section class="container grid-xl">
    <div class="container">
      <router-view v-slot="{ Component }">
        <Susp>
          <template #default>
            <component :is="Component" :key="$route.path" />
          </template>
        </Susp>
      </router-view>
    </div>
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

export default {
  components: {
    Header,
    Susp,
    Footer,
  },
  provide: {
    siriusStore,
  },
};
</script>

<style lang="sass">
@import './assets/main.scss'
</style>
