<template>
  <v-col cols="5" sm="4" md="3" lg="2">
    <v-select :model-value="globalStore.perPage" :items="globalStore.perPageOptions"
      :label="$helpers.capitalizeFirstLetter($t('per page'))" density="compact" />
  </v-col>
</template>

<script setup>
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore()
</script>

<style>
.per-page-group>div {
  padding: 0;
}
</style>
