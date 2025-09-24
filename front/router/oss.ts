import { RouteRecordRaw } from "vue-router";
import OSSDashboard from "../views/oss/Dashboard.vue";
import OSSIntegration from "../views/oss/Integration.vue";

const moduleRoutes: RouteRecordRaw[] = [
  {
    name: "OSS.OSS",
    path: "/#",
    component: OSSDashboard,
    meta: {
      flag: 'eu',
      isDropdown: true,
      hasRole: "ROLE_OSS"
    },
  },
  {
    path: "/oss/dashboard",
    component: OSSDashboard,
    name: "OSS.dashboard",
    meta: {
      isDisabled: false,
      title: "OSS.dashboardTitle",
      parent: "OSS.OSS",
      hasRole: "ROLE_OSS"
    },
  },
  {
    name: "OSS.integration",
    path: "/oss/integration/:id",
    component: OSSIntegration,
    meta: {
      parent: "OSS.OSS",
      isHidden: true,
      title: "OSS.integrationTitle",
      hasRole: "ROLE_OSS"
    },
  },
];

export default moduleRoutes;

