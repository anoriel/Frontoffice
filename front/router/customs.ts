import CustomsCommissionCategoryList from "../views/customs/CustomCommissionCategoryList.vue";
import CustomsCommissionsList from "../views/customs/CustomsCommissionsList.vue"

export default [
  {
    name: "menu.customs",
    path: "/#",
    meta: {
      icon: "mdi-police-station",
      isDropdown: true,
      hasRole: "ROLE_CUSTOMS"
    }
  },
  {
    path: "/customs/commissions",
    component: CustomsCommissionsList,
    name: "customs.commissions",
    meta: {
      hasRole: "ROLE_CUSTOMS",
      isDisabled: false,
      parent: "menu.customs"
    },
  },
  {
    name: "customs.settings",
    path: "/#",
    meta: {
      icon: "mdi-cog",
      isDropdown: true,
      hasRole: "ROLE_CUSTOMS_ADMIN",
      parent: "menu.customs",
      title: "settings"
    }
  },
  {
    name: "customs.customsCommissionCategoryList",
    path: "/customs/settings/categories",
    component: CustomsCommissionCategoryList,
    meta: {
      icon: "mdi-invoice-text-check",
      isDisabled: false,
      title: "customs.customsCommissionCategoryList",
      parent: "customs.settings",
      root: "menu.customs",
      hasRole: "ROLE_CUSTOMS_ADMIN"
    },
  }
];
