<template>
  <NavbarModal v-model:modalActive="modalActive" />
  <header>
    <keep-alive>
      <Header v-model:modalActive="modalActive" />
    </keep-alive>
  </header>

  <section class="container grid-xl full-height">
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
import { ref } from "vue";
import Header from "@/components/Header.vue";
import NavbarModal from "@/components/NavbarModal.vue";
import Susp from "@/components/SuspenseLoadError.vue";
import Footer from "@/components/Footer.vue";
import { siriusStore } from "@/store/sirius";
import { appStore } from "@/store/app";

export default {
  components: {
    NavbarModal,
    Header,
    Susp,
    Footer,
  },
  provide: {
    appStore,
    siriusStore,
  },
  setup() {
    return {
      modalActive: ref(false),
    }
  },
};
</script>

<style lang="sass">
@import './assets/main.scss'

.full-height
  min-height: 100vh
</style>
