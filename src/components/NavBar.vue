<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>My App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      v-for="route in filteredRoutes"
      :key="route.name"
      :to="route.path"
      text
    >
      {{ route.name }}
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const filteredRoutes = computed(() => {
  return router.options.routes.filter(route => route.name)
})
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>
