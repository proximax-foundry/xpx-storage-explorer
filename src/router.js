import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Map from "@/views/Map.vue";
import Statistics from "@/views/Statistics.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/map",
      name: "map",
      component: Map,
    },
    {
      path: "/statistics",
      name: "statistics",
      component: Statistics,
    },
  ],
});

export default router;
