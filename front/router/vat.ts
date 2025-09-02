import VATDashboard from "../views/vat/Dashboard.vue";
import VATIntegration from "../views/vat/Integration.vue";
import VATList from "../views/vat/List.vue";

export default [
  {
    name: "menu.VAT",
    path: "/#",
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
