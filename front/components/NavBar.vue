<template>
  <v-app-bar app color="grey-darken-4">
    <template v-if="securityStore.getIsAuthenticated">
      <v-btn v-for="route in filteredRoutes" :key="route.name" text :title="route.meta?.title" variant="flat"
        rounded="0" class="mr-1" color="primary">
        <template v-slot:prepend>
          <FlagIcon v-if="route.meta.flag" :code="route.meta.flag" size="18" />
          <v-icon v-else-if="route.meta.icon">{{ route.meta.icon }}</v-icon>
        </template>
        {{ $helpers.capitalizeFirstLetter($t(route.name)) }}
        <template v-slot:append v-if="route.meta.isDropdown">
          <v-icon icon="mdi-menu-down" size="x-small"></v-icon>
        </template>

        <v-menu activator="parent" open-on-hover open-delay="10" close-delay="10" v-if="route.meta.isDropdown">
          <v-list>
            <v-list-item v-for="child in getChildren(route)" :key="child.name" :to="child.path" density="compact"
              base-color="blue-darken-4">
              <v-list-item-title>{{ $helpers.capitalizeFirstLetter($t(child.name)) }}</v-list-item-title>
              <template v-slot:prepend>
                <FlagIcon v-if="child.meta.flag" :code="child.meta.flag" />
                <v-icon v-else-if="child.meta.icon">{{ child.meta.icon }}</v-icon>
              </template>
              <template v-slot:append v-if="child.meta.isDropdown">
                <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
              </template>

              <v-menu :open-on-focus="false" activator="parent" open-on-hover submenu open-delay="10" close-delay="10"
                v-if="child.meta.isDropdown">
                <v-list>
                  <v-list-item v-for="subChild in getChildren(child)" :key="subChild.name" :to="subChild.path"
                    density="compact" base-color="blue-darken-4">
                    <v-list-item-title>{{ $helpers.capitalizeFirstLetter($t(subChild.name)) }}</v-list-item-title>
                    <template v-slot:prepend>
                      <FlagIcon v-if="subChild.meta.flag" :code="subChild.meta.flag" />
                      <v-icon v-else-if="subChild.meta.icon">{{ subChild.meta.icon }}</v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </template>

  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSecurityStore } from '../stores/security'
import FlagIcon from 'vue3-flag-icons'
const securityStore = useSecurityStore()

const appTitle = import.meta.env.VITE_APP_TITLE

const router = useRouter()

const filteredRoutes = computed(() =>
{
  return router.options.routes.filter((route) => route.meta && !route.meta.parent && route.meta.isDropdown && !route.meta.isHidden && securityStore.hasRole(route.meta?.hasRole))
})

function getChildren(route)
{
  let routesList = [];
  router.options.routes.forEach(item =>
  {
    if (item.meta && item.meta.parent && item.meta.parent == route.name && !item.meta.isHidden && securityStore.hasRole(item))
    {
      routesList.push(item)
    }
  })
  return routesList;
}
</script>
