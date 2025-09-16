<template>
  <span>
    <FlagIcon :code="getIso3166()" size="18" class="mr-1" />
    <span class="d-inline-block">{{ society.nom }}</span>
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import FlagIcon, { CountryCode } from 'vue3-flag-icons'
import { Societe } from '@/interfaces/societe';

const props = defineProps({
  society: {
    type: Object as PropType<Societe>,
    required: true,
  },
})

function getIso3166(): CountryCode
{
  let code = props.society.pays?.iso3166 as CountryCode
  if (code.toLowerCase() == 'xi') {
    code = 'gb-nir';
  }
  return code;
}
</script>

<style scoped></style>
