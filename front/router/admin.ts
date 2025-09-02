import UserSecurity from "../views/admin/UserSecurity.vue";
import CurrentlyLoggedUsers from "../views/admin/CurrentlyLoggedUsers.vue";

export default [
  {
    name: "admin.admin",
    path: "/#",
    meta: {
      icon: "mdi-security",
      isDropdown: true,
      hasRole: "ROLE_SUPER_ADMIN"
    },
  },
  {
    path: "/admin/userSecurity",
    component: UserSecurity,
    name: "admin.userSecurity",
    meta: {
      icon: "mdi-account-group",
      isDisabled: false,
      title: "admin.userSecurity",
      parent: "admin.admin",
      hasRole: "ROLE_SUPER_ADMIN"
    },
  },
  {
    path: "/admin/currentlyLoggedUsers",
    component: CurrentlyLoggedUsers,
    name: "admin.currentlyLoggedUsers",
    meta: {
      icon: "mdi-account-key",
      isDisabled: false,
      title: "admin.currentlyLoggedUsers",
      parent: "admin.admin",
      hasRole: "ROLE_SUPER_ADMIN"
    },
  }
];
