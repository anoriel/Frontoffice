<template>
  <span class="text-no-wrap">
    <FlagIcon :code="getIso3166()" size="18" class="mr-1" circle />
    <span class="d-inline-block">{{ customer.nomSociete }}</span>
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { CountryCode } from '@/types/CountryCode';
import FlagIcon from './FlagIcon.vue';
import { CustomerInterface } from '@/interfaces/CustomerInterface';

const props = defineProps({
  customer: {
    type: Object as PropType<CustomerInterface>,
    required: true,
  },
})

function getIso3166(): CountryCode
{
  let code = props.customer.country?.iso3166 as CountryCode
  if (code.toLowerCase() == 'xi') {
    code = 'gb-nir';
  }
  return code;
}
</script>

<style scoped></style>
