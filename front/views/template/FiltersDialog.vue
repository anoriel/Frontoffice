<template>
  <v-dialog v-model="globalStore.showFiltersDialog" @afterEnter="loadFilters()">
    <v-form v-model="formIsValid" validate-on="submit lazy" validated>
      <v-card :title="$helpers.capitalizeFirstLetter($t('filters'))" prepend-icon="mdi-filter" class="flex-nowrap">
        <template v-slot:text>
          <v-row>
            <template v-for="filterKey in Object.keys(store.mapping)" :key="filterKey">
              <v-col cols="4">

                <template v-if="getFieldType(filterKey) == 'string'">
                  <v-text-field v-model="searchFilters[filterKey]" :label="getFieldLabel(filterKey)" clearable
                    density="compact" min-width="150" />
                </template>

                <template v-else-if="getFieldType(filterKey) == 'object'">
                  <select-object :fieldname="filterKey" :fieldObjectType="getFieldObjectType(filterKey) as string"
                    :label="getFieldLabel(filterKey)" :moduleName="moduleName"
                    @saveObject="(e: any) => searchFilters[filterKey] = e" />
                </template>

                <template v-else-if="getFieldType(filterKey) == 'boolean'">
                  <v-checkbox v-model="searchFilters[filterKey]" :label="getFieldLabel(filterKey)" density="compact" />
                </template>

                <template v-else-if="getFieldType(filterKey) == 'date'">
                  <v-date-input v-model="searchFilters[filterKey]" :label="getFieldLabel(filterKey)" multiple="range"
                    clearable density="compact" mode-icon="mdi-calendar-edit" />
                </template>

                <v-sheet v-else class="ma-2 pa-2 bg-error">
                  filterKey={{ filterKey }}<br>
                  getFieldType={{ getFieldType(filterKey) }}<br>
                  getFieldObjectType={{ getFieldObjectType(filterKey) }}
                </v-sheet>

              </v-col>
            </template>
          </v-row>
        </template>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :text="$helpers.capitalizeFirstLetter($t('cancel'))" color="error"
            @click="globalStore.showFiltersDialog = false" prepend-icon="mdi-close-circle" />
          <v-btn :text="$helpers.capitalizeFirstLetter($t('reset'))" color="primary" @click="clearFilter"
            :disabled="isResetDisabled()" prepend-icon="mdi-eraser" />
          <v-btn :text="$helpers.capitalizeFirstLetter($t('search'))" color="success"
            @click="$emit('saveFilters', searchFilters)" :disabled="isSaveDisabled()" prepend-icon="mdi-check-bold" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { useGlobalStore } from '@/stores/global';
import { PropType } from 'vue';
import { BaseStoreInterface } from '@/interfaces/baseStoreInterface';
const globalStore = useGlobalStore()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useI18n } from "vue-i18n";
const { t, te } = useI18n({ useScope: "global" });

import SelectObject from '@/components/searchComponents/SelectObject.vue';

const props = defineProps({
  moduleName: {
    type: String,
    required: true,
  },
  store: {
    type: Object as PropType<BaseStoreInterface>,
    required: true,
  },
})

const defaultFilters = ref(JSON.parse(JSON.stringify(props.store.getContextKey("filters", true))))
const formIsValid = shallowRef(false)
const searchFilters = ref(JSON.parse(JSON.stringify(props.store.getSearchFilters())))

function getFieldType(field: string)
{
  return props.store.mapping[field].type
}
function getFieldObjectType(field: string)
{
  return props.store.mapping[field].object
}

function getFieldLabel(field: string)
{
  let label = props.store.mapping[field].object ?? field;
  return helpers.capitalizeFirstLetter(t(te(props.moduleName + '.' + label) ? props.moduleName + '.' + label : label))
}

function isSaveDisabled()
{
  return JSON.stringify(searchFilters.value) == JSON.stringify(props.store.getSearchFilters());
}
function isResetDisabled()
{
  return JSON.stringify(searchFilters.value) == JSON.stringify(defaultFilters.value);
}

function loadFilters()
{
  searchFilters.value = JSON.parse(JSON.stringify(props.store.getSearchFilters()));
}

function clearFilter()
{
  searchFilters.value = defaultFilters.value;
}

</script>
