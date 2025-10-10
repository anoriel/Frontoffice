<template>
  <v-main>
    {{ router.currentRoute.value.name }}
  </v-main>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { useGlobalStore } from '@/stores/global';
useGlobalStore().isLoadingWithLock = false
</script>


<style scoped></style>
