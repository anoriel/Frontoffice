<template>
  <!-- #region header-->
  <v-row v-if="item.importationParameters">
    <v-col cols="12" class="text-center d-flex align-center flex-column">
      <v-tabs color="primary" v-model="tab" v-on:update:model-value="loadPeriod">
        <v-tab value="totals">
          {{ $helpers.capitalizeFirstLetter($t('file totals')) }}
          <v-progress-circular v-if="!ossIntegrationStore.totals.length" color="white" indeterminate :size="20"
            :width="2"></v-progress-circular>
        </v-tab>
        <v-tab v-for="period in ossIntegrationStore.periods" :key="period.key" :value="period.key">
          {{ $helpers.formatPeriod(period.key) }}
          <v-progress-circular v-if="period.isLoading" color="white" indeterminate :size="20" :width="2" />
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="totals">
          <h2>{{ $helpers.capitalizeFirstLetter($t("totals list")) }}</h2>
          <p v-if="item.importationParameters.nbFileImportedRows">
            {{ item.importationParameters.nbFileImportedRows }}
            {{ $helpers.capitalizeFirstLetter($t("imported rows", item.importationParameters.nbFileImportedRows)) }}
          </p>
          <p v-else>
            {{ $helpers.capitalizeFirstLetter($t("no import data")) }}
          </p>
          <v-skeleton-loader v-if="!ossIntegrationStore.totals.length" type="table-row-divider@12" />
          <Oss_table v-else :items="ossIntegrationStore.totals" />
        </v-tabs-window-item>
        <v-tabs-window-item v-for="period in ossIntegrationStore.periods" :key="period.key" :value="period.key">
          <h2>{{ $helpers.capitalizeFirstLetter($t("totals month list")) }}{{ $helpers.formatPeriod(period.key) }}</h2>
          <v-skeleton-loader v-if="period.isLoading" type="table-row-divider@12" />
          <Oss_table v-else :items="ossIntegrationStore.totalsByPeriod[period.key]" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
  </v-row>
  <!-- #endregion errors-->
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue';
import { OssIntegrationInterface } from '@/interfaces/OssIntegrationInterface';

import { useOssIntegrationStore } from '@/stores/ossIntegration';
import _ from 'lodash';
import Oss_table from './oss_table.vue';
const ossIntegrationStore = useOssIntegrationStore();

const props = defineProps({
  item: {
    type: Object as PropType<OssIntegrationInterface>,
    default: null
  }
});

const tab = ref('totals')

watch(
  () => props.item,
  (newValue, oldValue) => itemWatcher(newValue, oldValue),
)

onMounted(async () =>
{
  itemWatcher(props.item, undefined);
});

async function itemWatcher(newValue: OssIntegrationInterface, oldValue?: OssIntegrationInterface)
{
  if (newValue && newValue.id && newValue.id != oldValue?.id) {
    const id = newValue.id as number;
    await ossIntegrationStore.getTotals(id);
  }
}

async function loadPeriod()
{
  let period = ossIntegrationStore.periods.find(e => e.key == tab.value);
  if (period && period.isLoading) {
    return;
  }
  if (tab.value != 'totals' && props.item.id && (!(tab.value in ossIntegrationStore.totalsByPeriod) || !ossIntegrationStore.totalsByPeriod[tab.value].length)) {
    await ossIntegrationStore.getTotalsByPeriod(props.item.id, tab.value);
  }
}
</script>
