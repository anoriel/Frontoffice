<template>
  <v-data-table :hover="true" striped="even" density="compact" :items="items" :hide-default-footer="true"
    :items-per-page="0" :headers="headers">
    <!-- #region headers -->
    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
      <tr>
        <template v-for="column in columns" :key="column.key">
          <th class="text-center text-no-wrap cursor-pointer font-weight-bold" @click="toggleSort(column)">
            {{ $helpers.capitalizeFirstLetter($t(column.key ?? 'unknown')) }}
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" color="medium-emphasis"></v-icon>
          </th>
        </template>
      </tr>
    </template>
    <!-- #endregion headers -->

    <!-- #region item -->
    <template v-slot:item.paysDépart="{ item }">
      <country-component
        :country="{ nom: item.paysDépart, iso3166: item.paysDépartIso, langue: '', stringValue: item.paysDépart }" />
    </template>
    <template v-slot:item.paysArrivée="{ item }">
      <country-component
        :country="{ nom: item.paysArrivée, iso3166: item.paysArrivéeIso, langue: '', stringValue: item.paysArrivée }" />
    </template>
    <!-- #endregion item -->

  </v-data-table>
</template>

<script setup lang="ts">
import CountryComponent from '@/components/CountryComponent.vue';
import { ref, PropType } from 'vue';

type Item = Record<string, any>;

const props = defineProps({
  items: {
    type: Array as PropType<Item[]>,
    default: () => []
  },
});

const headers = ref([
  { key: "paysDépart" },
  { key: "paysArrivée" },
  { key: "devise" },
  { key: "taux_tva" },
  { key: "nbLignes" },
  { key: "totalTTC" },
  { key: "totalHT" },
  { key: "totalTVA" },
  { key: "totalTVA_Calculé" },
]);
</script>
