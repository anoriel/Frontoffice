<template>
  <simple-list-template currentItemDescription="lead.origin" :currentItemsStore="leadOriginStore" />
</template>

<script setup>
import { useLeadOriginStore } from '@/stores/leadOrigin'
const leadOriginStore = useLeadOriginStore()
import SimpleListTemplate from '@/components/SimpleListTemplate.vue';
</script>


<style scoped>
.v-list-item.disabled .v-list-item-title {
  font-style: italic;
  text-decoration: line-through red;
}
</style>
