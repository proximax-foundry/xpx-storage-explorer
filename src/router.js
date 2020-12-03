import { createRouter, createWebHistory } from "vue-router";
import MainOverview from "@/views/MainOverview.vue";
import NodesOverview from "@/views/NodesOverview.vue";
import DrivesOverview from "@/views/DrivesOverview.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Overview",
      component: MainOverview,
    },
    {
      path: "/nodes",
      name: "Nodes",
      component: NodesOverview,
    },
    {
      path: "/drives",
      name: "Drives",
      component: DrivesOverview,
    },
  ],
});

export default router;
