<template>
  <v-dialog v-model="globalStore.showColumnsDialog" @afterEnter="loadFields()">
    <v-card :title="$helpers.capitalizeFirstLetter($t('columns'))">
      <template v-slot:text>
        <v-container class="text-center">
          <v-row>
            <v-col>
              {{ $helpers.capitalizeFirstLetter($t('select fields to show')) }}
            </v-col>
          </v-row>
          <v-row>
            <v-col ref="availableColumnsDiv" class="col bg-danger-10">
              <h6 class="bg-error text-light pa-1 ma-0">
                {{ $helpers.capitalizeFirstLetter($t('available columns')) }}
              </h6>
              <draggable v-model="clonedAvailableColumns" item-key="key" @end="sortLeadColumns(clonedAvailableColumns)"
                group="fields">
                <template #header v-if="!clonedAvailableColumns.length">
                  <small><i>{{ $helpers.capitalizeFirstLetter($t('drop here')) }}</i></small>
                </template>

                <template #item="{ element }">
                  <div class="border cursor-pointer">
                    {{ getColumnName(element) }}
                  </div>
                </template>
              </draggable>
            </v-col>
            <v-col ref="visibleColumns" class="col bg-success-10">
              <h6 class="bg-success text-light pa-1 ma-0">
                {{ $helpers.capitalizeFirstLetter($t('visible columns')) }}
              </h6>
              <draggable v-model="clonedVisibleColumns" item-key="key" group="fields">
                <template #header v-if="!clonedVisibleColumns.length">
                  <small><i>{{ $helpers.capitalizeFirstLetter($t('drop here')) }}</i></small>
                </template>
                <template #item="{ element }">
                  <div class="border cursor-pointer">
                    {{ getColumnName(element) }}
                  </div>
                </template>
              </draggable>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <v-card-actions class="bg-surface-light">
        <v-spacer></v-spacer>

        <v-btn :text="$helpers.capitalizeFirstLetter($t('cancel'))" color="error"
          @click="globalStore.showColumnsDialog = false" prepend-icon="mdi-close-circle" />
        <v-btn :text="$helpers.capitalizeFirstLetter($t('reset'))" color="primary" @click="reset"
          :disabled="isResetDisabled()" prepend-icon="mdi-eraser" />
        <v-btn :text="$helpers.capitalizeFirstLetter($t('save'))" color="success"
          @click="$emit('saveColumns', clonedVisibleColumns)" :disabled="isSaveDisabled()"
          prepend-icon="mdi-content-save" />
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import draggable from 'vuedraggable'
import { useGlobalStore } from '@/stores/global';
import { PropType } from 'vue';
import { BaseStoreInterface } from '@/interfaces/BaseStoreInterface';
import { AvailableField } from '@/interfaces/AvailableFieldInterface';
const globalStore = useGlobalStore()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useI18n } from "vue-i18n";
const { t, te } = useI18n({ useScope: "global" });


const props = defineProps({
  defaultColumns: {
    type: Array,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  store: {
    type: Object as PropType<BaseStoreInterface>,
    required: true,
  },
  visibleColumns: {
    type: Array,
    required: true,
  },
})

const clonedAvailableColumns = shallowRef<AvailableField[]>([])
const clonedVisibleColumns = shallowRef<AvailableField[]>([])

function getColumnName(column: AvailableField)
{
  return helpers.capitalizeFirstLetter(t(te(props.moduleName + '.' + column.key) ? props.moduleName + '.' + column.key : column.key));
}

function isResetDisabled()
{
  return JSON.stringify(clonedVisibleColumns.value) == JSON.stringify(props.defaultColumns);
}

function isSaveDisabled()
{
  return !clonedVisibleColumns.value.length || JSON.stringify(clonedVisibleColumns.value) == JSON.stringify(props.visibleColumns);
}

function loadFields()
{
  clonedVisibleColumns.value = JSON.parse(JSON.stringify(props.visibleColumns));
  refreshClonedAvailableColumns();
}

function refreshClonedAvailableColumns()
{
  clonedAvailableColumns.value = JSON.parse(JSON.stringify(props.store.availableFields))
  clonedVisibleColumns.value.forEach(element =>
  {
    const objIndex = clonedAvailableColumns.value.findIndex((obj) => obj.key == element.key);
    if (objIndex >= 0) {
      clonedAvailableColumns.value.splice(objIndex, 1);
    }
  });
  sortLeadColumns(clonedAvailableColumns.value);
}

function reset()
{
  clonedVisibleColumns.value = JSON.parse(JSON.stringify(props.defaultColumns));
  refreshClonedAvailableColumns();
}

function sortLeadColumns(columnsList: AvailableField[])
{
  columnsList.sort(function (a, b)
  {
    let aName = getColumnName(a);
    let bName = getColumnName(b);
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
}
</script>
