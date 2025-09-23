<template>
  <v-dialog v-model="globalStore.showColumnsDialog" @afterEnter="loadFields()">
    <v-card :title="$helpers.capitalizeFirstLetter($t('columns'))">
      <template v-slot:text>
        <v-container class="text-center">
          <v-row>
            <v-col>
              {{ $helpers.capitalizeFirstLetter($t('select fields to show')) }} {{ moduleName }}
            </v-col>
          </v-row>
          <v-row>
            <v-col ref="availableColumnsDiv" class="col bg-danger-10">
              <h6 class="bg-error text-light pa-1 ma-0">
                {{ $helpers.capitalizeFirstLetter($t('available columns')) }}
              </h6>
              <draggable v-model="clonedAvailableColumns" item-key="key" @end="sortLeadColumns(clonedAvailableColumns)"
                group="fields">
                <template #header>
                  <v-btn append-icon="mdi-eraser" color="primary" @click="reset()" size="x-small">{{
                    $helpers.capitalizeFirstLetter($t('reset')) }}</v-btn>
                </template>

                <template #item="{ element }">
                  <div class="border cursor-pointer">
                    {{ $helpers.capitalizeFirstLetter($t(moduleName + '.' + element.key)) }}
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
                <template #item="{ index, element }">
                  <div class="border cursor-pointer">
                    {{ $helpers.capitalizeFirstLetter($t(moduleName + '.' + element.key)) }}
                  </div>
                </template>
              </draggable>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <v-card-actions class="bg-surface-light">
        <v-btn :text="$helpers.capitalizeFirstLetter($t('cancel'))" color="error"
          @click="globalStore.showColumnsDialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn :text="$helpers.capitalizeFirstLetter($t('save'))" color="success"
          @click="$emit('saveSettings', clonedVisibleColumns)"
          :disabled="!clonedVisibleColumns.length"></v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import draggable from 'vuedraggable'
import { useGlobalStore } from '@/stores/global';
import { PropType } from 'vue';
import { BaseStoreInterface } from '@/interfaces/baseStoreInterface';
import { AvailableField } from '@/interfaces/availableField';
const globalStore = useGlobalStore()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });


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
    let aName = helpers.capitalizeFirstLetter(t(props.moduleName + '.' + a.key));
    let bName = helpers.capitalizeFirstLetter(t(props.moduleName + '.' + b.key));
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  }
  );
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>
