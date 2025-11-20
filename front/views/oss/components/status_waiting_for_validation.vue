<template>
  <!-- #region legend-->
  <v-row class="justify-end mt-16">
    <v-col cols="12" class="text-center">
      <small class="bg-secondary pa-2">
        <span class="text-right ma-1 pa-1">
          <strong>{{ $helpers.capitalizeFirstLetter($t("legend")) }}</strong>
        </span>
        <span class="bg-success text-white ma-1 pa-1">
          {{ $helpers.capitalizeFirstLetter($t("high correspondence")) }}
        </span>
        <span class="bg-warning ma-1 pa-1">
          {{ $helpers.capitalizeFirstLetter($t("average correspondence")) }}
        </span>
        <span class="bg-error text-white ma-1 pa-1">
          {{ $helpers.capitalizeFirstLetter($t("poor correspondence")) }}
        </span>
        <span class="bg-white border ma-1 pa-1">
          {{ $helpers.capitalizeFirstLetter($t("no correspondence")) }}
        </span>
      </small>
    </v-col>
  </v-row>
  <!-- #endregion legend-->

  <!-- #region data table-->
  <v-row>
    <v-col cols="12" class="overflow-x-auto" style="max-width: 97vw;">
      <v-skeleton-loader v-if="!ossIntegrationStore.fileLinesDetail.length" type="table-row-divider@12" />
      <table v-else>

        <!-- #region headers -->
        <thead>
          <tr>
            <td class="pa-1" v-for="(column) in ossIntegrationStore.fileHeaders" :key="column.key"
              :class="column.key.length > 20 ? 'text-caption' : 'text-body-2'">
              <div :class="getHeaderClass(column)" class="text-center pb-1">
                <div class="text-no-wrap pa-3 pb-0">
                  {{ column.key }}
                </div>
                <small v-if="'value' in column && column.value && 'probability' in column.value"
                  class="text-no-wrap font-italic pa-1">{{ $helpers.capitalizeFirstLetter($t("correspondence"))
                  }}{{ $t(":") }}
                  <span>{{
                    (column.value as unknown as FileIntegrationColumnDefinitionInterface).probability
                    }}</span>
                </small>

                <v-select v-model="column.value" :items="(column as AvailableFieldInterface).items" label=""
                  density="compact" class="bg-white ma-1 overflow-hidden" hide-details style="min-width: 200px;"
                  v-on:update:model-value="checkColumns">
                  <template v-slot:selection="{ item }">
                    <span v-if="item.raw && item.raw.value === null">&lt;&nbsp;</span>
                    {{ $helpers.capitalizeFirstLetter($te(item.raw.text) ? $t(item.raw.text) : item.raw.text) }}
                    <span v-if="item.raw && item.raw.value === null">&nbsp;&gt;</span>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item class="text-caption text-no-wrap" v-bind="props" title=""
                      :class="getHeaderClass(item.raw)">
                      <v-list-item-title>
                        <span v-if="item.raw && item.raw.value === null">&lt;&nbsp;</span>
                        {{ $helpers.capitalizeFirstLetter($te(item.raw.text) ? $t(item.raw.text) : item.raw.text) }}
                        <span v-if="item.raw && item.raw.value === null">&nbsp;&gt;</span>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
            </td>
          </tr>
        </thead>
        <!-- #endregion headers -->

        <!-- #region rows -->
        <tbody>
          <tr v-for="(row, index) in ossIntegrationStore.fileLinesDetail" :key="'row-' + index">
            <td v-for="(value, key) in row" :key="index + '-' + key" class="text-no-wrap text-center">{{ value }}</td>
          </tr>
        </tbody>
        <!-- #endregion rows -->

      </table>
    </v-col>
  </v-row>
  <!-- #endregion data table-->

  <!-- #region alerts-->
  <v-row v-if="Object.keys(columnsNotFound).length" class="d-flex align-start flex-column">
    <v-alert v-for="(item, index) in columnsNotFound" :key="index" type="error" icon="mdi-alert" variant="tonal"
      :text="$helpers.capitalizeFirstLetter($t('warning not found', { column: item.name }))" class="ma-1" />
  </v-row>
  <v-row v-if="Object.keys(columnsInDoublon).length" class="d-flex align-start flex-column">
    <v-alert v-for="(items, index) in columnsInDoublon" :key="index" type="error" icon="mdi-alert" variant="outlined"
      :text="$helpers.capitalizeFirstLetter($t('warning doublon', { column: index, fieldsList: items }))"
      class="ma-1" />
  </v-row>
  <!-- #endregion alerts-->

  <!-- #region valid button-->
  <v-row>
    <v-col cols="12" class="text-center">
      <v-btn color="primary col-6 offset-3" :disabled="!allColumnsAreValidated()" @click="validateColumns()">
        {{ $helpers.capitalizeFirstLetter($t("validate columns")) }}
      </v-btn>
    </v-col>
  </v-row>
  <!-- #endregion valid button-->
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

import { OssIntegrationInterface } from '@/interfaces/OssIntegrationInterface';
import { useOssIntegrationStore } from '@/stores/ossIntegration';
import { FileIntegrationColumnDefinitionInterface } from '@/interfaces/FileIntegrationColumnDefinitionInterface';
import { AvailableFieldInterface } from '@/interfaces/AvailableFieldInterface';
import { FileIntegrationColumnInterface } from '@/interfaces/FileIntegrationColumnInterface';
import { FileIntegrationValidatedColumnInterface } from '@/interfaces/FileIntegrationValidatedColumnInterface';
const ossIntegrationStore = useOssIntegrationStore();

const props = defineProps({
  item: {
    type: Object as PropType<OssIntegrationInterface>,
    default: null
  }
});


const columnsInDoublon = ref<Record<string, string[]>>({});
const columnsNotFound = ref<FileIntegrationColumnInterface[]>([]);

watch(
  () => props.item,
  (newValue, oldValue) => itemWatcher(newValue, oldValue),
  { immediate: true }
)

function allColumnsAreValidated()
{
  let r = true;
  ossIntegrationStore.fileHeaders.forEach((element) =>
  {
    if (!("value" in element) || (element.value == undefined && element.value != null)) {
      r = false;
    }
  });

  return r && Object.keys(columnsInDoublon.value).length == 0 && columnsNotFound.value.length == 0;
}

function checkColumns()
{
  setTimeout(() => { doublonColumnsAreValidated() }, 200);
}

async function doublonColumnsAreValidated()
{
  // #region mandatory columns not filled
  let columnsList: FileIntegrationColumnInterface[] = [];
  if (props.item && "columnsTemplate" in props.item && props.item.columnsTemplate) {
    columnsList =
      props.item.columnsTemplate.fileIntegrationColumns.filter(
        (o) => o.isMandatory == true
      );
    for (let column in ossIntegrationStore.fileHeaders) {
      if (
        "value" in ossIntegrationStore.fileHeaders[column] &&
        ossIntegrationStore.fileHeaders[column].value != null &&
        typeof ossIntegrationStore.fileHeaders[column].value != "undefined"
      ) {
        columnsList = columnsList.filter(
          (o) =>
            ossIntegrationStore.fileHeaders[column].value && ossIntegrationStore.fileHeaders[column].value.name &&
            o.name.toLowerCase() !== ossIntegrationStore.fileHeaders[column].value.name.toLowerCase()
        );
      }
    }
  }
  columnsNotFound.value = columnsList;
  // #endregion

  // #region doublons
  columnsInDoublon.value = {};
  ossIntegrationStore.fileHeaders.forEach((element: AvailableFieldInterface) =>
  {
    element.warning = false;
    if (
      !("value" in element) ||
      element.value == undefined ||
      element.value == -1
    ) {
      return;
    }
    if (
      typeof columnsInDoublon.value[element.value.name] ==
      "undefined"
    ) {
      columnsInDoublon.value[element.value.name] = [];
    }
    columnsInDoublon.value[element.value.name].push(element.key);
  });

  for (let column in columnsInDoublon.value) {
    let list = columnsInDoublon.value[column];
    if (list.length > 1) {
      for (let c in list) {
        let found = ossIntegrationStore.fileHeaders.find(e => e.key == list[c])
        if (found != undefined) found.warning = true;
      }
    } else {
      delete columnsInDoublon.value[column];
    }
  }
  // #endregion
}

async function itemWatcher(newValue: OssIntegrationInterface, oldValue?: OssIntegrationInterface)
{
  if (newValue && newValue.id && newValue.id != oldValue?.id) {
    ossIntegrationStore.getFileLinesDetail(newValue.id);
    doublonColumnsAreValidated();
  }
}

function getHeaderClass(column: AvailableFieldInterface, onlyColor: boolean = false)
{
  if (!column.value) {
    return onlyColor ? '' : null;
  }
  let value: FileIntegrationColumnDefinitionInterface = column.value as unknown as FileIntegrationColumnDefinitionInterface;
  if (value.probability > 75) {
    return onlyColor ? 'success' : "bg-success";
  } else if (value.probability >= 50) {
    return onlyColor ? 'warning' : "bg-warning";
  } else if (value.probability >= 25) {
    return onlyColor ? 'error' : "bg-error";
  }

  return onlyColor ? '' : null;
}

async function validateColumns()
{
  let payload: Record<string, FileIntegrationValidatedColumnInterface> = {};
  let id = 0;
  ossIntegrationStore.fileHeaders.forEach((element) =>
  {
    if (
      "value" in element &&
      element.value != null
    ) {
      payload[element.key] = {
        fileColumnId: id++,
        matchedColumn: element.value.name,
        expectedColumnId: element.value.expectedColumnId,
      };
    }
  });
  if (props.item) {
    let r = await ossIntegrationStore.setColumns(props.item.id as number, payload);
    if (r && r.id) {
      router.push({ name: "OSS.list" });
    } else {
      console.log('error ossIntegrationStore.setColumns', r);
    }
  }
}
</script>
