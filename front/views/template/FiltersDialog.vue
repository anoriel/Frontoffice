<template>
  <v-dialog v-model="globalStore.showFiltersDialog">
    <v-form v-model="formIsValid" validate-on="submit lazy" validated>
      <v-card :title="$helpers.capitalizeFirstLetter($t('filters'))" prepend-icon="mdi-filter" class="flex-nowrap">
        <template v-slot:text>
          <v-row>
            <template v-for="filterKey in Object.keys(defaultFilters)" :key="filterKey">
              <v-col cols="4">

                <template v-if="getFieldFilterCategory(filterKey) == 'string'">
                  <v-text-field v-model="searchFilters[filterKey]" :label="getFieldLabel(filterKey)" clearable
                    density="compact" min-width="150" />
                </template>

                <template v-else-if="['object', 'progressBar'].includes(getFieldFilterCategory(filterKey))">
                  <select-object :fieldname="filterKey" :fieldtype="getFieldType(filterKey)" :moduleName="moduleName" />
                </template>

                <template v-else-if="getFieldFilterCategory(filterKey) == 'boolean'">
                  <v-checkbox v-model="searchFilters[filterKey]" :label="getFieldLabel(filterKey)" density="compact" />
                </template>

                <v-sheet v-else class="ma-2 pa-2 bg-error">
                  {{ filterKey }}<br>
                  {{ getFieldFilterCategory(filterKey) }}<br>
                  {{ getFieldType(filterKey) }}
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

function getFieldFilterCategory(field: string)
{
  let category = '';
  if (props.store.fieldsByType.boolean.includes(field)) {
    category = 'boolean'
  } else if (props.store.fieldsByType.object.find((e: any) => e.name == field)) {
    category = 'object'
  } else if (props.store.fieldsByType.objectsList.find((e: any) => e.name == field)) {
    category = 'objectsList'
  } else if (props.store.fieldsByType.progressBar.find((e: any) => e.name == field)) {
    category = 'progressBar'
  } else if (props.store.fieldsByType.string.includes(field)) {
    category = 'string'
  } else if (props.store.fieldsByType.stringsList.includes(field)) {
    category = 'stringsList'
  }
  return category
}
function getFieldType(field: string)
{
  let category = getFieldFilterCategory(field);
  if (category in props.store.fieldsByType) {
    let foundField = props.store.fieldsByType[category].find((e: any) => e.name == field)
    if (foundField) return foundField.type
  }
  return ""
}

function getFieldLabel(field: string)
{
  return helpers.capitalizeFirstLetter(t(te(props.moduleName + '.' + field) ? props.moduleName + '.' + field : field))
}

function isSaveDisabled()
{
  return JSON.stringify(searchFilters.value) == JSON.stringify(props.store.getSearchFilters());
}
function isResetDisabled()
{
  return JSON.stringify(searchFilters.value) == JSON.stringify(defaultFilters.value);
}

function clearFilter()
{
  searchFilters.value = defaultFilters.value;
}

</script>
