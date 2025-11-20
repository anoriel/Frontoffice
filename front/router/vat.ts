import { RouteRecordRaw } from "vue-router";
import OSSIntegration from "../views/oss/Integration.vue";
import OSSList from "../views/oss/List.vue";
import VATDashboard from "../views/vat/Dashboard.vue";
import VATIntegration from "../views/vat/Integration.vue";
import VATList from "../views/vat/List.vue";

const moduleRoutes: RouteRecordRaw[] = [
  {
    name: "menu.VAT",
    path: "",
    component: VATDashboard,
    meta: {
      icon: "mdi-chart-areaspline",
      isDropdown: true,
      hasRole: "ROLE_TVA"
    },
  },
  {
    path: "/vat/dashboard",
    component: VATDashboard,
    name: "VAT.dashboard",
    meta: {
      icon: "mdi-invoice-import-outline",
      isDisabled: false,
      title: "VAT.dashboardTitle",
      parent: "menu.VAT",
      hasRole: "ROLE_TVA"
    },
  },
  {
    name: "VAT.integration",
    path: "/vat/integration/:id",
    component: VATIntegration,
    meta: {
      parent: "menu.VAT",
      isHidden: true,
      title: "VAT.integrationTitle",
      hasRole: "ROLE_TVA"
    },
  },
  {
    path: "/oss/list",
    component: OSSList,
    name: "OSS.list",
    meta: {
      isDisabled: false,
      flag: 'eu',
      title: "OSS.dashboardTitle",
      parent: "menu.VAT",
      hasRole: "ROLE_TVA"
    },
  },
  {
    name: "OSS.integration",
    path: "/oss/integration/:id",
    component: OSSIntegration,
    meta: {
      parent: "OSS.list",
      isHidden: true,
      title: "OSS.integrationTitle",
      hasRole: "ROLE_TVA"
    },
    props: (route) => ({ id: route.params.id }),
  },
  {
    path: "/vat/operations",
    component: VATList,
    name: "VAT.operations",
    meta: {
      icon: "mdi-invoice-text-multiple-outline",
      isDisabled: false,
      parent: "menu.VAT",
      hasRole: "ROLE_TVA"
    },
  },
];

export default moduleRoutes;

