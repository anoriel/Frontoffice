<template>
  <span class="text-no-wrap">
    <FlagIcon :code="getIso3166()" size="18" class="mr-1" circle />
    <span class="d-inline-block">{{ invoiceCondition.stringValue }}</span>
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { CountryCode } from '@/types/CountryCode';
import FlagIcon from './FlagIcon.vue';
import { InvoiceConditionInterface } from '@/interfaces/InvoiceconditionInterface';

const props = defineProps({
  invoiceCondition: {
    type: Object as PropType<InvoiceConditionInterface>,
    required: true,
  },
})

function getIso3166(): CountryCode
{
  let code = props.invoiceCondition.pays?.iso3166 as CountryCode
  if (code.toLowerCase() == 'xi') {
    code = 'gb-nir';
  }
  return code;
}
</script>

<style scoped></style>
