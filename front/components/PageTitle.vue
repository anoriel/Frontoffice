<template>
  <v-app-bar v-if="router.currentRoute.value && router.currentRoute.value.name" class="pl-5" height="40"
    density="compact" color="blue-lighten-4
">
    <v-breadcrumbs :items="getBreadcrumbs(router.currentRoute.value, true)" density="compact">
      <template v-slot:item="{ item }">
       <FlagIcon v-if="item.meta && item.meta.flag"
          :code="item.meta && item.meta.flag" />
        <v-icon v-if="item.meta && item.meta.icon" size="smaller">
          {{ item.meta.icon }}
        </v-icon>
        {{ $helpers.capitalizeFirstLetter($t(item.name)) }}
      </template>
    </v-breadcrumbs>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import FlagIcon from 'vue3-flag-icons'
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

</script>
