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
import { onMounted, ref, shallowRef, watch } from 'vue'
import useCommonHelper from '@/helpers/commonHelper';
const helper = useCommonHelper();
import { useGlobalStore } from '@/stores/global'
const globalStore = useGlobalStore()
import { useVatInvoiceStore } from '@/stores/vatInvoice';
const vatInvoiceStore = useVatInvoiceStore();
import { useInvoiceConditionStore } from '@/stores/invoiceCondition';
const invoiceConditionStore = useInvoiceConditionStore();

import List from '@/views/template/List.vue';
import SelectObject from '@/components/searchComponents/SelectObject.vue';

const invoiceConditionSelect = ref(null)
const invoiceConditionsList = ref([])
const watchCustomer = shallowRef(false)
const watchInvoiceCondition = shallowRef(false)


onMounted(async () =>
{
  let customer = vatInvoiceStore.getContextKey('customer')
  let invoiceCondition = vatInvoiceStore.getContextKey('invoiceCondition')
  if (customer)
  {
    vatInvoiceStore.customer = JSON.parse(customer)
    await parentWatcher()
  }
  if (invoiceCondition)
  {
    vatInvoiceStore.invoiceCondition = JSON.parse(invoiceCondition)
  }
})

watch(() => vatInvoiceStore.customer, parentWatcher)
watch(() => vatInvoiceStore.invoiceCondition, invoiceConditionWatcher)

function invoiceConditionWatcher()
{
  if (watchInvoiceCondition.value === false)
  {
    watchInvoiceCondition.value = true;
    return;
  }
  vatInvoiceStore.currentPage = 1;
}

async function parentWatcher()
{
  if (watchCustomer.value === false)
  {
    watchCustomer.value = true;
    return;
  }
  invoiceConditionsList.value = [];
  if (vatInvoiceStore.customer)
  {
    invoiceConditionsList.value = await invoiceConditionStore.findByParent(vatInvoiceStore.customer);
    if (invoiceConditionSelect.value && !globalStore.isLoadingWithLock)
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
