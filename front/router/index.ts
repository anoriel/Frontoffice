import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import Login from "../views/Login.vue"


import adminRoutes from "./admin";
import crmRoutes from "./crm";
import customsRoutes from "./customs";
import ossRoutes from "./oss";
import vatRoutes from "./vat";

const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      icon: "mdi-home",
      title: "home",
    },
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    name: "login",
    path: "/login",
    component: Login,
    meta: {
      icon: "mdi-account",
      title: "login",
    },
  },
]

const routes = baseRoutes.concat(crmRoutes, customsRoutes, ossRoutes, vatRoutes, adminRoutes);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
