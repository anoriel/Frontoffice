<template>
  <v-container fluid class="w-100 h-100 overflow-auto position-relative">
    {{ router.currentRoute.value.name }}
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { useGlobalStore } from '@/stores/global';
useGlobalStore().isLoadingWithLock = false
</script>


<style scoped></style>
