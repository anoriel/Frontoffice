<template>
  <span>
    <FlagIcon :code="getIso3166()" size="18" class="mr-1" />
    <span class="d-inline-block">{{ $helpers.capitalizeFirstLetter(country.nom) }}</span>
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import FlagIcon, { CountryCode } from 'vue3-flag-icons'
import { Pays } from '@/interfaces/pays';

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
