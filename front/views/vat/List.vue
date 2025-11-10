<template>
  <v-container fluid class="w-100 position-relative">
    <v-row>
      <v-col>
        <select-object fieldname="customer.label" fieldObjectType="customer"
          :label="$helpers.capitalizeFirstLetter($t('customer.label'))" :preloadData="false"
          v-model="vatInvoiceStore.customer" :multiple="false" />
      </v-col>
      <v-col>
        <select-object fieldname="invoice condition" fieldObjectType="invoiceCondition" ref="invoiceConditionSelect"
          :label="$helpers.capitalizeFirstLetter($t('invoice condition'))" :preloadData="false"
          v-model="vatInvoiceStore.invoiceCondition" :multiple="false" :parent="vatInvoiceStore.customer" />
      </v-col>
    </v-row>
  </v-container>
  <List moduleName="vatInvoice" :addItem='false' :canExport="false" :canSavetSettings="false"
    :additionnalFilters="getFilters()" />
</template>

<script setup>
import { ref, watch } from 'vue'

import { useVatInvoiceStore } from '@/stores/vatInvoice';
const vatInvoiceStore = useVatInvoiceStore();

import List from '@/views/template/List.vue';
import SelectObject from '@/components/searchComponents/SelectObject.vue';

const invoiceConditionSelect = ref(null)

vatInvoiceStore.customer = JSON.parse(vatInvoiceStore.getContextKey('customer'))
vatInvoiceStore.invoiceCondition = JSON.parse(vatInvoiceStore.getContextKey('invoiceCondition'))

function getFilters()
{
  return {
    'invoiceConditionId': vatInvoiceStore.invoiceCondition?.id,
  }
}

</script>


<style scoped></style>
