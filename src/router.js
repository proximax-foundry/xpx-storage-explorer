import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { appStore } from "@/store/app";

const MainOverview = () => import("@/views/MainOverview.vue");
const NodesOverview = () => import("@/views/NodesOverview.vue");
const DriveLayout = () => import("@/views/DriveLayout.vue");
const DrivesList = () => import("@/components/DrivesList.vue");
const DriveState = () => import("@/components/DriveState.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Overview",
      component: MainOverview,
      meta: {
        title: "Main Overview",
      },
    },
    {
      path: "/nodes",
      name: "Nodes",
      component: NodesOverview,
      meta: {
        title: "Nodes Overview",
      },
    },
    {
      path: "/drives",
      name: "Drives",
      component: DriveLayout,
      children: [
        {
          path: "",
          name: "Drives Overview",
          component: DrivesList,
        },
        {
          path: ":cid",
          name: "Drive Details",
          component: DriveState,
        },
      ],
    },
  ],
});

router.afterEach((to) => {
  nextTick(() => {
    document.title = `ProximaX Sirius ${appStore.name} -
      ${to.meta.title ? to.meta.title : to.name}`;
  });
});

export default router;
