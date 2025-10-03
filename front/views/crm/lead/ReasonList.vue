<template>
  <v-container fluid class="w-100 h-100 overflow-auto position-relative">
    <simple-list-template currentItemDescription="refusal reason" :currentItemsStore="leadRefusalReasonStore" />
  </v-container>
</template>

<script setup>
import { useLeadRefusalReasonStore } from '@/stores/leadRefusalReason'
const leadRefusalReasonStore = useLeadRefusalReasonStore()
import SimpleListTemplate from '@/components/SimpleListTemplate.vue';
</script>


<style scoped>
.v-list-item.disabled .v-list-item-title {
  font-style: italic;
  text-decoration: line-through red;
}
</style>
