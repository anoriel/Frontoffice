import { RouteRecordRaw } from "vue-router";
import AssignmentRule from "../views/crm/lead/AssignmentRule.vue";
import LeadDashboard from "../views/crm/lead/Dashboard.vue";
import LeadPage from "../views/crm/lead/LeadPage.vue";
import OriginsList from "../views/crm/lead/OriginsList.vue";
import ReasonList from "../views/crm/lead/ReasonList.vue";
import CustomersList from "@/views/crm/customer/List.vue";
import LeadsList from "@/views/crm/lead/List.vue";

const moduleRoutes: RouteRecordRaw[] = [
  {
    name: "menu.crm",
    path: "/#",
    component: {},
    meta: {
      icon: "mdi-face-agent",
      isDropdown: true,
      hasRole: "ROLE_CRM"
    }
  },
  {
    name: "customer.list",
    path: "/crm/customer/list",
    component: CustomersList,
    meta: {
      icon: "mdi-account-file-text",
      isDisabled: false,
      title: "customer.listTitle",
      list: "customer",
      parent: "menu.crm",
      hasRole: "ROLE_CRM"
    },
  },
  {
    name: "lead.dashboard",
    path: "/crm/lead",
    component: LeadDashboard,
    meta: {
      icon: "mdi-account-eye",
      isDisabled: true,
      title: "lead.dashboardTitle",
      parent: "menu.crm",
      hasRole: "ROLE_SUPER_ADMIN"
    },
  },
  {
    name: "lead.list",
    path: "/crm/lead/list",
    component: LeadsList,
    meta: {
      icon: "mdi-account-file-text",
      isDisabled: false,
      title: "lead.listTitle",
      parent: "menu.crm",
      hasRole: "ROLE_CRM"
    },
  },
  {
    name: "crm.settings",
    path: "/#",
    component: AssignmentRule,
    meta: {
      icon: "mdi-cog",
      isDropdown: true,
      hasRole: "ROLE_CRM_ADMIN",
      parent: "menu.crm",
      title: "settings"
    }
  },
  {
    name: "lead.assignmentRulesList",
    path: "/crm/lead/settings/assignments",
    component: AssignmentRule,
    meta: {
      icon: "mdi-arrow-decision-auto",
      isDisabled: false,
      title: "lead.assignmentRulesList",
      parent: "crm.settings",
      root: "menu.crm",
      hasRole: "ROLE_CRM_ADMIN"
    },
  },
  {
    name: "lead.originsList",
    path: "/crm/lead/settings/origin",
    component: OriginsList,
    meta: {
      icon: "mdi-map-marker-account",
      isDisabled: false,
      title: "lead.originsList",
      parent: "crm.settings",
      root: "menu.crm",
      hasRole: "ROLE_CRM_ADMIN"
    },
  },
  {
    name: "lead.refusalReasonsList",
    path: "/crm/lead/settings/reasons",
    component: ReasonList,
    meta: {
      icon: "mdi-close-octagon",
      isDisabled: false,
      title: "lead.refusalReasonsList",
      parent: "crm.settings",
      hasRole: "ROLE_CRM_ADMIN"
    },
  },
  {
    name: "lead.page",
    path: "/crm/lead/:id",
    component: LeadPage,
    meta: {
      parent: "menu.crm",
      isHidden: true,
      title: "lead.page",
      hasRole: "ROLE_CRM"
    },
  }
];

export default moduleRoutes;
