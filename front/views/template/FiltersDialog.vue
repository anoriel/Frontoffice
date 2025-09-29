<template>
  <v-dialog v-model="globalStore.showFiltersDialog">
    <v-form v-model="formIsValid" validate-on="submit lazy" validated>
      <v-card :title="$helpers.capitalizeFirstLetter($t('filters'))" prepend-icon="mdi-filter">
        <template v-slot:text>

          <template v-for="(filter, key) in defaultFilters" :key="key">
            <v-row><v-col>{{ key }}</v-col><v-col>{{ filter }}</v-col></v-row>
          </template>
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


function isSaveDisabled()
{
  return !searchFilters.value.length || JSON.stringify(searchFilters.value) == JSON.stringify(props.store.getSearchFilters());
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
