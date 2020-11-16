<template>
  <nav class="navbar">
    <div class="navbar-section">
      <a class="navbar-brand mr-2" href="https://proximax.io">
        <img
          src="https://www.proximax.io/user/themes/proximaxvrs1/images/logo.png"
          alt="ProximaX Logo"
          class="img-responsive"
        />
      </a>
    </div>
    <div class="navbar-section" :class="{ 'is-active': isActive }">
      <div>
        <Search />
      </div>
      <div>
        <SelectNode />
      </div>
    </div>
  </nav>
</template>
<script>
import { ref } from "vue";
import SelectNode from "@/components/SelectNode.vue";
import Search from "@/components/Search.vue";

export default {
  components: {
    SelectNode,
    Search,
  },
  setup() {
    return {
      isActive: ref(false),
    };
  },
};
</script>
