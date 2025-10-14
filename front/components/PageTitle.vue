<template>
  <v-app-bar v-if="router.currentRoute.value && router.currentRoute.value.name" class="pl-5" height="40"
    density="compact" color="blue-lighten-4
">
    <v-breadcrumbs density="compact" :items="getBreadcrumbs(router.currentRoute.value, true)">
      <template v-slot:divider>
        <v-icon color="white" style="vertical-align: top;">mdi-menu-right</v-icon>
      </template>
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="getPath(item)" :class="{ 'font-italic': item.name == router.currentRoute.value.name }" color="blue-darken-4">
          <FlagIcon v-if="item.meta && item.meta.flag" :code="item.meta && item.meta.flag" class="mr-1" />
          <v-icon v-if="item.meta && item.meta.icon" size="smaller" class="mr-1">
            {{ item.meta.icon }}
          </v-icon>
          {{ $helpers.capitalizeFirstLetter($t(item.name)) }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import FlagIcon from './FlagIcon.vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const breadcrumbs = ref([])

function getBreadcrumbs(item, isRoot = false)
{
  if (isRoot)
  {
    breadcrumbs.value = [];
  }
  if (item.meta && item.meta.parent)
  {
    let route = router.getRoutes().find(e => e.name == item.meta.parent)
    if (route != undefined)
    {
      getBreadcrumbs(route)
    }
  }
  breadcrumbs.value.push(item)
  if (isRoot)
  {
    return breadcrumbs.value
  }
}

function getPath(item)
{
  if (!('meta' in item) || item.meta.isDisabled || item.name == router.currentRoute.value.name)
  {
    return null
  }
  return item.path
}
</script>

<style>
.v-breadcrumbs-divider {
  padding: 0 !important;
}
</style>
