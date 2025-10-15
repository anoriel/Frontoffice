<template>
  <v-container class="w-100 h-100 overflow-auto">
    <v-row>
      <v-col>
        <h1>{{ $helpers.capitalizeFirstLetter($t('welcome to ASD ERP, please select a link from the menu')) }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col offset="1">
        <v-list>
          <v-list-item v-for="route in filteredRoutes" :key="route.name" text :title="route.meta?.title" variant="flat"
            rounded="0" class="mr-1" color="primary" :class="{ 'disabled': route.meta.isDisabled }">
            <v-list-item-title>
              <FlagIcon v-if="route.meta.flag" :code="route.meta.flag" />
              <v-icon v-else-if="route.meta.icon">{{ route.meta.icon }}</v-icon>
              {{ $helpers.capitalizeFirstLetter($t(route.name)) }}
            </v-list-item-title>
            <template v-slot:append v-if="route.meta.isDropdown">
              <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
            </template>

            <v-list v-if="route.meta.isDropdown">
              <v-list-item v-for="child in getChildren(route)" :key="child.name"
                :to="child.meta.isDisabled ? null : child.path" density="compact" base-color="blue-darken-4"
                :class="{ 'disabled': child.meta.isDisabled }">
                <v-list-item-title>
                  <FlagIcon v-if="child.meta.flag" :code="child.meta.flag" />
                  <v-icon v-else-if="child.meta.icon">{{ child.meta.icon }}</v-icon>
                  {{ $helpers.capitalizeFirstLetter($t(child.name)) }}
                </v-list-item-title>
                <template v-slot:append v-if="child.meta.isDropdown">
                  <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
                </template>

                <v-list v-if="child.meta.isDropdown">
                  <v-list-item v-for="subChild in getChildren(child)" :key="subChild.name"
                    :to="subChild.meta.isDisabled ? null : subChild.path" density="compact" base-color="blue-darken-4"
                    :class="{ 'disabled': subChild.meta.isDisabled }">
                    <v-list-item-title>
                      <FlagIcon v-if="subChild.meta.flag" :code="subChild.meta.flag" />
                      <v-icon v-else-if="subChild.meta.icon">{{ subChild.meta.icon }}</v-icon>
                      {{ $helpers.capitalizeFirstLetter($t(subChild.name)) }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-list-item>
            </v-list>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSecurityStore } from '../stores/security'
import FlagIcon from '@/components/FlagIcon.vue'
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

<style scoped>
.v-list-item.disabled {
  cursor: not-allowed;
  text-decoration: line-through red;
}
</style>
