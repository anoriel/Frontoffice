<template>
  <!-- #region header-->
  <v-row v-if="item.importationParameters">
    <v-col cols="12" class="text-center d-flex align-center flex-column">
      <v-alert type="error" icon="mdi-alert" variant="tonal"
        :text="$helpers.capitalizeFirstLetter($t('duplicates met and need to be fixed'))" class="ma-1" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <p>
        {{ $helpers.capitalizeFirstLetter($t(
          "the system looks for an existing reference of the same operation type during the same year"
        )) }}.
      </p>
      <p>{{ $helpers.capitalizeFirstLetter($t("please check your file")) }}.</p>
    </v-col>
  </v-row>
  <!-- #endregion header-->

  <!-- #region errors-->
  <v-row>
    <v-col cols="12" class="overflow-x-auto" style="max-width: 97vw;">
      <v-data-table :hover="true" striped="even" density="compact" :items="item.importationParameters?.duplicates"
        v-model:page="ossIntegrationStore.currentPage" v-model:items-per-page="globalStore.perPage">

        <template v-slot:top>
          <v-row>
            <v-col cols="4" offset="4" class="text-center pt-2">
              <v-pagination v-model="ossIntegrationStore.currentPage" :length="globalStore.perPage" rounded="circle"
                active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
            </v-col>
            <v-col cols="1" offset="3">
              <v-select v-model="globalStore.perPage" :items="globalStore.perPageOptions" density="compact"
                :label="$helpers.capitalizeFirstLetter($t('per page'))" />
            </v-col>
          </v-row>
          <small class="text-center" v-if="item.importationParameters?.duplicates.length"><i>{{
            item.importationParameters?.duplicates.length }} {{ $t("record",
                item.importationParameters?.duplicates.length) }}</i></small>
        </template>

        <template v-slot:bottom>
          <v-row class="mt-1">
            <v-col cols="4" offset="4" class="text-center pt-2">
              <v-pagination v-model="ossIntegrationStore.currentPage" :length="globalStore.perPage" rounded="circle"
                active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
            </v-col>
            <v-col cols="1" offset="3">
              <v-select v-model="globalStore.perPage" :items="globalStore.perPageOptions" density="compact"
                :label="$helpers.capitalizeFirstLetter($t('per page'))" />
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <!-- #endregion errors-->
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { OssIntegrationInterface } from '@/interfaces/OssIntegrationInterface';

import { useOssIntegrationStore } from '@/stores/ossIntegration';
const ossIntegrationStore = useOssIntegrationStore();
import { useGlobalStore } from '@/stores/global'
const globalStore = useGlobalStore()

const props = defineProps({
  item: {
    type: Object as PropType<OssIntegrationInterface>,
    default: null
  }
});
</script>
