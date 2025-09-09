<template>
  <v-main>
    <simple-list-template currentItemDescription="refusal reason" :currentItemsStore="leadRefusalReasonStore" />
  </v-main>
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
