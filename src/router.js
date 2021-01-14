import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { appStore } from "@/store/app";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Overview",
      component: () => import("@/views/MainOverview.vue"),
      meta: {
        title: "Main Overview",
        showOnNav: true,
      },
    },
    {
      path: "/drives",
      name: "Drives",
      component: () => import("@/components/DrivesList.vue"),
      meta: {
        title: "Drives Overview",
        showOnNav: true,
      },
    },
    {
      path: "/drive/:cid+",
      name: "Drive",
      component: () => import("@/components/DriveState.vue"),
      meta: {
        title: "Drive Details",
        showOnNav: false,
      },
    },
    {
      path: "/peers",
      name: "Peers",
      component: () => import("@/components/PeersMap.vue"),
      meta: {
        title: "Map of Peer Nodes",
        showOnNav: true,
      },
    },
    {
      path: "/status",
      name: "Status",
      component: () => import("@/components/NodesStatus.vue"),
      meta: {
        title: "Status of Nodes",
        showOnNav: true,
      },
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
