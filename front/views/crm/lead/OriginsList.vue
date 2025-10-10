<template>
  <v-container fluid class="w-100 h-100 overflow-auto position-relative">
    <simple-list-template currentItemDescription="lead.origin" :currentItemsStore="leadOriginStore" />
  </v-container>
</template>

<script setup>
import { useLeadOriginStore } from '@/stores/leadOrigin'
const leadOriginStore = useLeadOriginStore()
import SimpleListTemplate from '@/components/SimpleListTemplate.vue';
import { useGlobalStore } from '@/stores/global';
useGlobalStore().isLoadingWithLock = false
</script>


<style scoped>
.v-list-item.disabled .v-list-item-title {
  font-style: italic;
  text-decoration: line-through red;
}
</style>
