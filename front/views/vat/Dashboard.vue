<template>
  <v-main>
    {{ router.currentRoute.value.name }}
  </v-main>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>


<style scoped></style>
