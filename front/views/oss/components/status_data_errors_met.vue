<template>
  <!-- #region header-->
  <v-row v-if="item.importationParameters">
    <v-col cols="12" class="text-center d-flex align-center flex-column">
      <v-alert type="error" icon="mdi-alert" variant="tonal"
        :text="$helpers.capitalizeFirstLetter($t('data errors met and need to be updated'))" class="ma-1" />
      <small>
        <v-chip color="warning" class="pa-5">
          {{ $helpers.capitalizeFirstLetter($t("error to fix", errorsList.length)) }}
          <v-chip variant="elevated" color="error" class="ma-1">
            {{ errorsList.length }}
          </v-chip>
        </v-chip>
      </small>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="d-flex align-end flex-column">
      <v-switch v-model="hideFilledRows" :label="$helpers.capitalizeFirstLetter($t('hide filled rows'))"
        color="primary" />
    </v-col>
  </v-row>
  <!-- #endregion header-->

  <!-- #region buttons-->
  <v-row>
    <v-col cols="4" offset="4" class="display-flex">
      <v-btn color="error" :disabled="getRemainingErrorsToFix().length != errorsList.length" @click="cancelDataError()"
        class="ma-1" prepend-icon="mdi-cancel">
        {{ $helpers.capitalizeFirstLetter($t("cancel")) }} </v-btn>
      <v-btn color="success" :disabled="getFixedErrors().length != errorsList.length" @click="validateAllDataErrors()"
        class="ma-1" prepend-icon="mdi-content-save">
        {{ $helpers.capitalizeFirstLetter($t("validate")) }}
      </v-btn>
    </v-col>
  </v-row>
  <!-- #endregion buttons-->

  <!-- #region errors-->
  <v-row v-if="getDataErrors().length">
    <v-col cols="12" class="overflow-x-auto" style="max-width: 97vw;">
      <table class="w-100 stripped">
        <!-- #region headers -->
        <thead>
          <tr>
            <th class="text-no-wrap">{{ $helpers.capitalizeFirstLetter($t('error')) }}&nbsp;#</th>
            <th class="text-no-wrap">{{ $helpers.capitalizeFirstLetter($t('occurrence', 2)) }}</th>
            <th class="text-no-wrap">{{ $helpers.capitalizeFirstLetter($t('column')) }}</th>
            <th class="text-no-wrap">{{ $helpers.capitalizeFirstLetter($t('fieldname')) }}</th>
            <th class="text-no-wrap">{{ $helpers.capitalizeFirstLetter($t('error')) }}</th>
            <th class="text-no-wrap">{{ $helpers.capitalizeFirstLetter($t('found value')) }}</th>
            <th class="text-no-wrap" style="min-width: 200px;">{{ $helpers.capitalizeFirstLetter($t('action')) }}</th>
          </tr>
        </thead>
        <!-- #endregion headers -->

        <!-- #region rows -->
        <tbody>
          <tr v-for="(row, index) in getDataErrors()" :key="'row-' + index">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ row.rows.length < 3 ? row.rows : $helpers.sprintf('%s %s %s', $t('found'),
              row.rows.length, $t('time(s)', row.rows.length)) }}</td>
            <td class="text-center">{{ row.column }}</td>
            <td class="text-center">{{ row.expectedField }}</td>
            <td class="text-center">{{ $helpers.capitalizeFirstLetter(
              $helpers.sprintf(
                $t(row.errorMessage),
                ...row.errorParameters
              )
            ) }}</td>
            <td class="text-center">{{ row.foundValue }}</td>
            <td>
              <div class="d-flex align-center">
                <v-autocomplete v-if="row.possibleValues && row.possibleValues.length" v-model="row.replacementValue"
                  :items="row.possibleValues" :label="$helpers.capitalizeFirstLetter($t('to replace with'))" clearable
                  hide-details min-width="150" density="compact" auto-select-first
                  @update:model-value="row.validated = false;" autocomplete="off"
                  :class="!row.validated ? 'emptyInput' : ''" />
                <v-text-field v-else v-model="row.replacementValue" solo class="centered-input vue-text-field-input m-1"
                  :class="!row.validated ? 'emptyInput' : ''"
                  :label="$helpers.capitalizeFirstLetter($t('to replace with'))" @input="row.validated = false" />

                <v-btn v-if="!row.validated && canValidate(row)" class="ma-1" size="small"
                  :title="$helpers.capitalizeFirstLetter($t('validate this row'))" color="success"
                  @click="row.validated = true" icon="mdi-check" />
                <v-btn v-if="row.validated" class="ma-1" size="small"
                  :title="$helpers.capitalizeFirstLetter($t('unset this row'))" color="error"
                  @click="row.validated = false; row.replacementValue = null" icon="mdi-close" />
              </div>
            </td>
          </tr>
        </tbody>
        <!-- #endregion rows -->

      </table>
    </v-col>
  </v-row>
  <!-- #endregion errors-->
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

import { OssIntegrationInterface } from '@/interfaces/OssIntegrationInterface';
import { FileImportationErrorInterface } from '@/interfaces/FileImportationErrorInterface';
import { useOssIntegrationStore } from '@/stores/ossIntegration';

const props = defineProps({
  item: {
    type: Object as PropType<OssIntegrationInterface>,
    default: null
  }
});

watch(
  () => props.item,
  (newValue, oldValue) => itemWatcher(newValue, oldValue),
)

onMounted(() =>
{
  errorsList.value = props.item.importationParameters ? props.item.importationParameters.dataErrorsList : []

});

const hideFilledRows = ref(true);
const errorsList = ref<FileImportationErrorInterface[]>([]);

function cancelDataError()
{
  if (!errorsList.value.length) {
    return;
  }
  for (let index in errorsList.value) {
    let value = errorsList.value[index];
    value.replacementValue = null;
    value.validated = false;
  }
}

function canValidate(error: FileImportationErrorInterface)
{
  return error.replacementValue && error.possibleValues?.length
    ? error.possibleValues.indexOf(
      error.replacementValue
    ) >= 0
    : error.replacementValue != undefined;
}

function getDataErrors()
{
  return errorsList.value.filter((o) => o.validated !== true || !hideFilledRows.value)
}

function getFixedErrors()
{
  if (
    !errorsList.value
  ) {
    return [];
  }
  return errorsList.value.filter(
    (o) => o.validated === true
  );
}

function getRemainingErrorsToFix()
{
  if (
    !errorsList.value
  ) {
    return [];
  }
  return errorsList.value.filter(
    (o) => o.validated === false || o.replacementValue != null
  );
}

function itemWatcher(newValue: OssIntegrationInterface, oldValue?: OssIntegrationInterface)
{
  if (newValue && newValue.id && newValue.id != oldValue?.id) {
  }
}

async function validateAllDataErrors()
{
  let r = await useOssIntegrationStore().setReplacements(props.item.id as number, errorsList.value);
  if (r && r.id) {
    router.push({ name: "OSS.list" });
  } else {
    console.log('error ossIntegrationStore.setReplacements', r);
  }
}
</script>
