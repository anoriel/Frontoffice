<template>
  <span class="text-no-wrap">
    <FlagIcon :code="getIso3166()" size="18" class="mr-1" circle />
    {{ $helpers.capitalizeFirstLetter(agency.pays.iso3166) }}, {{ $helpers.capitalizeFirstLetter(agency.stringValue) }}
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { AgencyInterface } from '@/interfaces/AgencyInterface';
import { CountryCode } from '@/types/CountryCode';
import FlagIcon from './FlagIcon.vue';

const props = defineProps({
  agency: {
    type: Object as PropType<AgencyInterface>,
    required: true,
  },
})

function getIso3166(): CountryCode
{
  let code = props.agency.pays?.iso3166 as CountryCode
  if (code.toLowerCase() == 'xi') {
    code = 'gb-nir';
  }
  return code;
}
</script>

<style scoped></style>
