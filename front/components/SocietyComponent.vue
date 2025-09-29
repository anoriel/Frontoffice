<template>
  <span class="text-no-wrap">
    <FlagIcon :code="getIso3166()" size="18" class="mr-1" circle />
    <span class="d-inline-block">{{ society.nom }}</span>
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { CountryCode } from '@/types/CountryCode';
import FlagIcon from './FlagIcon.vue';
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
