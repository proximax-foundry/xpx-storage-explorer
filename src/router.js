import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { appStore } from "@/store/app";
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
      meta: {
        title: `${appStore.name} - Main Overview`,
      },
    },
    {
      path: "/nodes",
      name: "Nodes",
      component: NodesOverview,
      meta: {
        title: `${appStore.name} - Nodes Overview`,
      },
    },
    {
      path: "/drives",
      name: "Drives",
      component: DrivesOverview,
      meta: {
        title: `${appStore.name} - Drives Overview`,
      },
    },
  ],
});

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title || `${appStore.name} - to.name`;
  });
});

export default router;
