import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Map from "@/views/Map.vue";
import Statistics from "@/views/Statistics.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Home must always be the first element for Navbar to avoid creating duplicate link
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/map",
      name: "Map",
      component: Map,
    },
    {
      path: "/statistics",
      name: "Statistics",
      component: Statistics,
    },
  ],
});

export default router;
