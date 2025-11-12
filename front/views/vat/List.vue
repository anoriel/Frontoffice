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
          v-model="vatInvoiceStore.invoiceCondition" :multiple="false" :fieldObjectEnum="invoiceConditionsList" />
      </v-col>
    </v-row>
  </v-container>
  <List moduleName="vatInvoice" :addItem='false' :canExport="false" :canSavetSettings="false"
    :additionnalFilters="getFilters()" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

import { useVatInvoiceStore } from '@/stores/vatInvoice';
const vatInvoiceStore = useVatInvoiceStore();
import { useInvoiceConditionStore } from '@/stores/invoiceCondition';
const invoiceConditionStore = useInvoiceConditionStore();

import List from '@/views/template/List.vue';
import SelectObject from '@/components/searchComponents/SelectObject.vue';

const invoiceConditionSelect = ref(null)
const invoiceConditionsList = ref([])


onMounted(async () =>
{
  let customer = vatInvoiceStore.getContextKey('customer')
  if (customer)
  {
    vatInvoiceStore.customer = JSON.parse(customer)
    await parentWatcher()
  }
  let invoiceCondition = vatInvoiceStore.getContextKey('invoiceCondition')
  if (invoiceCondition)
  {
    vatInvoiceStore.invoiceCondition = JSON.parse(invoiceCondition)
  }
})

watch(() => vatInvoiceStore.customer, parentWatcher)


async function parentWatcher()
{
  vatInvoiceStore.invoiceCondition = null;
  invoiceConditionsList.value = [];
  if (vatInvoiceStore.customer)
  {
    invoiceConditionsList.value = await invoiceConditionStore.findByParent(vatInvoiceStore.customer);
    if (invoiceConditionSelect.value)
    {
      invoiceConditionSelect.value.focus();
    }
  }
}

function getFilters()
{
  return {
    'invoiceConditionId': vatInvoiceStore.invoiceCondition?.id,
  }
}

</script>


<style scoped></style>
