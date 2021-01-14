import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { appStore } from "@/store/app";

const MainOverview = () => import("@/views/MainOverview.vue");
const PeersMap = () => import("@/components/PeersMap.vue");
const NodesStatus = () => import("@/components/NodesStatus.vue");
const DrivesLayout = () => import("@/views/DrivesLayout.vue");
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
      path: "/drives",
      name: "Drives",
      component: DrivesLayout,
      children: [
        {
          path: "",
          name: "Drives Overview",
          component: DrivesList,
        },
        {
          path: ":cid+",
          name: "Drive Details",
          component: DriveState,
        },
      ],
    },
    {
      path: "/peers",
      name: "Peers Map",
      component: PeersMap,
      meta: {
        title: "Map of Peer Nodes",
      },
    },
    {
      path: "/status",
      name: "Status",
      component: NodesStatus,
      meta: {
        title: "Status of Nodes",
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
