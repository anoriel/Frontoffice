<template>
  <v-container fluid class="w-100 position-relative">
    <v-row>
      <v-col>
        <h1 cols="4">
          {{ $helpers.capitalizeFirstLetter($t("OSS Integrations")) }}
        </h1>
      </v-col>
    </v-row>
    <v-form v-if="item">
      <!-- #region header-->
      <v-row>
        <v-col cols="4" class="d-flex align-start flex-column">
          <v-chip variant="elevated" density="compact" color="primary" class="ml-2 mb-2">
            {{ $helpers.capitalizeFirstLetter($t('customer.label')) }}
          </v-chip>
          <CustomerComponent v-if="item.customer" :customer="item.customer" />
        </v-col>

        <v-col cols="4" class="d-flex align-start flex-column">
          <v-chip variant="elevated" density="compact" color="primary" class="ml-2 mb-2">
            {{ $helpers.capitalizeFirstLetter($t('created by')) }}
          </v-chip>
          <UtilisateurComponent :user="item.user" />
        </v-col>

        <v-col cols="4" class="d-flex align-start flex-column">
          <v-chip variant="elevated" density="compact" color="primary" class="ml-2 mb-2">
            {{ $helpers.capitalizeFirstLetter($t('createdAt')) }}
          </v-chip>
          <DateTimeComponent :item="item.createdAt" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" class="d-flex justify-end">
          <div class="d-flex align-start flex-column">
            <v-chip variant="elevated" density="compact" color="primary" class="ml-2 mb-2">
              {{ $helpers.capitalizeFirstLetter($t('status')) }}
            </v-chip>
            <v-chip v-if="item.status" variant="elevated" density="compact" :color="item.status.cssClass">
              {{ $helpers.capitalizeFirstLetter($t("step")) }}
              {{ item.status?.position }}
              <span v-if="fileIntegrationStatusStore.list.length">
                &nbsp;{{ $t("on") }} {{ fileIntegrationStatusStore.list.length - 1 }}
              </span>
              &nbsp;-&nbsp;
              {{ $helpers.capitalizeFirstLetter($t(item.status?.stringValue)) }}
            </v-chip>
          </div>
        </v-col>
        <v-col cols="8" v-if="item.status" class="d-flex align-start flex-column">
          <v-chip variant="elevated" density="compact" color="primary" class="ml-2 mb-2">
            {{ $helpers.capitalizeFirstLetter($t('description')) }}
          </v-chip>
          {{ $helpers.capitalizeFirstLetter($t(item.status?.description)) }}
        </v-col>
      </v-row>
      <!-- #endregion header-->
      <StatusWaitingForValidation v-if="item.status?.name == 'STATUS_WAITING_FOR_VALIDATION'" :item="item" />
      <StatusDataErrorsMet v-else-if="item.status?.name == 'STATUS_DATA_ERRORS_MET'" :item="item" />
      <StatusDuplicatesFound v-else-if="item.status?.name == 'STATUS_DUPLICATES_FOUND'" :item="item" />
      <StatusGenerated v-else-if="item.status?.name == 'STATUS_GENERATED'" :item="item" />
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { OssIntegrationInterface } from '@/interfaces/OssIntegrationInterface';

import { useOssIntegrationStore } from '@/stores/ossIntegration';
import { useFileIntegrationStatusStore } from '@/stores/fileIntegrationStatus';
const fileIntegrationStatusStore = useFileIntegrationStatusStore();

import CustomerComponent from '@/components/CustomerComponent.vue';
import DateTimeComponent from '@/components/DateTimeComponent.vue';
import StatusDataErrorsMet from './components/status_data_errors_met.vue';
import StatusDuplicatesFound from './components/status_duplicates_found.vue';
import StatusGenerated from './components/status_generated.vue';
import StatusWaitingForValidation from './components/status_waiting_for_validation.vue';
import UtilisateurComponent from '@/components/UtilisateurComponent.vue';

const props = defineProps({
  id: {
    type: [String, Number],
    default: null
  }
});

const item = ref<OssIntegrationInterface>()

onMounted(async () =>
{
  if (!fileIntegrationStatusStore.list.length) {
    await fileIntegrationStatusStore.findAll();
  }
  itemWatcher()
})

watch(() => props.id, itemWatcher)

async function itemWatcher()
{
  item.value = await useOssIntegrationStore().find(props.id as number);
}
</script>


<style>
.v-field--variant-underlined .v-field__outline::before {
  border-style: none;
}

fieldset {
  border: 1px solid rgb(var(--v-theme-primary));
}
</style>
