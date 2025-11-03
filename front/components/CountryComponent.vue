<template>
  <span class="text-no-wrap">
    <FlagIcon :code="getIso3166()" size="18" class="mr-1" circle />
    <span class="d-inline-block">{{ $helpers.capitalizeFirstLetter(country.nom) }}</span>
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { Pays } from '@/interfaces/CountryInterface';
import { CountryCode } from '@/types/CountryCode';
import FlagIcon from './FlagIcon.vue';

const props = defineProps({
  country: {
    type: Object as PropType<Pays>,
    required: true,
  },
})

function getIso3166(): CountryCode
{
  let code = props.country.iso3166 as CountryCode
  if (props.country.iso3166.toLowerCase() == 'xi') {
    code = 'gb-nir';
  }
  return code;
}
</script>

<style scoped></style>
