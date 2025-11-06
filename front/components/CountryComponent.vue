<template>
  <span class="text-no-wrap">
    <FlagIcon :code="getIso3166()" size="18" class="mr-1" circle />
    {{ $helpers.capitalizeFirstLetter(country.iso3166) }}, {{ $helpers.capitalizeFirstLetter(country.nom) }}
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { CountryInterface } from '@/interfaces/CountryInterface';
import { CountryCode } from '@/types/CountryCode';
import FlagIcon from './FlagIcon.vue';

const props = defineProps({
  country: {
    type: Object as PropType<CountryInterface>,
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
