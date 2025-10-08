<template>
  <v-app-bar density="compact" variant="flat">
    <v-spacer></v-spacer>

    <v-btn v-if="addItem" class="p-0 pr-1 bg-primary mr-1" size="x-small" @click="addAnItem">
      <v-icon>mdi-plus-circle-outline</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('add' +
        $helpers.capitalizeFirstLetter(moduleName))) }}
    </v-btn>
    <v-btn class="p-0 pr-1 mr-3 bg-primary" size="x-small" @click="exportList">
      <v-icon>mdi-file-excel</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('export')) }}
    </v-btn>
    <v-btn class="p-0 pr-1 mr-1 bg-secondary" size="x-small" @click="displaySaveSettingsDialog()">
      <v-icon>mdi-cloud-upload</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('save settings')) }}
    </v-btn>
    <v-badge location="top right" color="warning" :model-value="store.getNumberOfFilters() > 0"
      :content="store.getNumberOfFilters()" class="mb-1 mt-1 mr-1" :class="{ 'mr-3': store.getNumberOfFilters() > 0 }">
      <v-btn size="x-small" :title="$helpers.capitalizeFirstLetter($t('filters'))"
        class="bg-secondary position-relative p-0 pr-1" @click="globalStore.showFiltersDialog = true">
        <v-icon>mdi-filter</v-icon>
        &nbsp;{{ $helpers.capitalizeFirstLetter($t('filters')) }}
      </v-btn>
    </v-badge>
    <v-btn class="p-0 pr-1 bg-secondary mr-1" size="x-small" :title="$helpers.capitalizeFirstLetter($t('columns'))"
      @click="globalStore.showColumnsDialog = true">
      <v-icon>mdi-table-column-plus-after</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('columns')) }}
    </v-btn>
  </v-app-bar>

  <v-container fluid class="w-100 h-100 overflow-auto">
    <v-data-table-server :hover="true" v-model:items-per-page="itemsPerPage" :headers="visibleFields" striped="even"
      :items="serverItems" :items-length="totalItems" :loading="loading" @update:options="loadItems"
      v-model:page="store.currentPage" density="compact" v-model:sort-by="sortBy" fixed-header style="max-height: 99%;">

      <!-- #region top -->
      <template v-slot:top>
        <small class="text-center" v-if="totalItems">
          <i>{{ totalItems }} {{ $t("record", totalItems) }}</i>
        </small>
        <v-row>
          <v-col class="position-relative">
            <v-select :model-value="itemsPerPage" :items="globalStore.perPageOptions"
              :label="$helpers.capitalizeFirstLetter($t('per page'))" density="compact"
              @update:model-value="itemsPerPage = parseInt($event, 10)" class="position-absolute right-0"
              style="min-width: 120px;" />
            <v-pagination :total-visible="7" v-model="store.currentPage" :length="Math.ceil(totalItems / itemsPerPage)"
              rounded="circle" density="compact" active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
          </v-col>
        </v-row>
      </template>
      <!-- #endregion top -->


      <!-- #region headers -->
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th>
              <div class="align-center text-no-wrap"
                v-if="'sortProperty' in column && 'sortable' in column && column.sortable">
                <b class="me-2 text-no-wrap cursor-pointer d-lg-none d-inline" @click="toggleSort(column)">
                  {{ $helpers.capitalizeFirstLetter($t($te(moduleName + '.' + column.key + '_shortag') ? moduleName +
                    '.' +
                    column.key + '_shortag' : $te(moduleName + '.' + column.key) ? moduleName + '.' +
                      column.key : column.key)) }}
                </b>
                <b class="me-2 text-no-wrap cursor-pointer d-none d-lg-inline" @click="toggleSort(column)">
                  {{ $helpers.capitalizeFirstLetter($t($te(moduleName + '.' + column.key) ? moduleName + '.' +
                    column.key : column.key)) }}
                </b>
                <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" color="medium-emphasis"></v-icon>
              </div>
              <div class="align-center" v-else>
                <b class="me-2 text-no-wrap d-lg-none">
                  <span v-if="store.fieldsByType.count.includes(column.key)">#</span>
                  {{ $helpers.capitalizeFirstLetter($t($te(moduleName + '.' + column.key + '_shortag') ? moduleName +
                    '.' +
                    column.key + '_shortag' : $te(moduleName + '.' + column.key) ? moduleName + '.' +
                      column.key : column.key)) }}
                </b>
                <b class="me-2 text-no-wrap d-none d-lg-inline">
                  <span v-if="store.fieldsByType.count.includes(column.key)">#</span>
                  {{ $helpers.capitalizeFirstLetter($t($te(moduleName + '.' + column.key) ? moduleName + '.' +
                    column.key : column.key)) }}
                </b>
              </div>
            </th>
          </template>
        </tr>
      </template>
      <!-- #endregion headers -->

      <!-- #region dynamic keys -->

      <!-- #region specific object keys -->
      <template v-for="object in store.fieldsByType.object" v-slot:[`item.${object.name}`]="{ value }" :key="object">
        <agency-component v-if="object.type == 'agency' && value" :agency="value" />
        <country-component v-else-if="object.type == 'country' && value" :country="value" />
        <society-component v-else-if="object.type == 'society' && value" :society="value" />
        <UtilisateurComponent v-else-if="object.type == 'user' && value" :user="value" />
        <v-chip v-else-if="value" :style="$helpers.getCssForText(value.stringValue)">{{ value.stringValue }}</v-chip>
      </template>
      <!-- #endregion specific object keys-->

      <!-- #region other keys -->
      <template v-for="key in store.fieldsByType.boolean" v-slot:[`item.${key}`]="{ value }">
        <v-icon v-if="value === true" class="text-success" :key="key + 'Check'">
          mdi-check
        </v-icon>
        <v-icon v-else-if="value === false" class="text-error" :key="key + 'Close'">
          mdi-close
        </v-icon>
        <v-icon v-else class="text-warning" :key="key + 'Help'">
          mdi-help
        </v-icon>
      </template>
      <template v-for="key in store.fieldsByType.count" v-slot:[`item.${key}`]="{ value }" :key="key">
        <div class="text-center w-100">{{ value.length }}</div>
      </template>
      <template v-for="key in store.fieldsByType.date" v-slot:[`item.${key}`]="{ value }" :key="key">
        {{ $helpers.formatDate(value) }}
      </template>
      <template v-for="key in store.fieldsByType.datetime" v-slot:[`item.${key}`]="{ value }" :key="key">
        <v-tooltip :text="$helpers.formatDateTime(value)" location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="text-no-wrap">{{ $helpers.formatDate(value) }}</span>
          </template>
        </v-tooltip>
      </template>
      <template v-for="object in store.fieldsByType.progressBar" v-slot:[`item.${object.name}`]="{ value }"
        :key="object">
        <v-progress-linear :model-value="object.store.getValue(value)" :color="object.store.getVariantByValue(value)"
          height="25" :max="object.store.getHighestPosition() - object.store.getLowestPosition()"
          class="text-no-wrap rounded" style="min-width: 7vmin;">
          <template v-slot:default>
            <small :class="object.store.getColorByValue(value)" class="text-no-wrap">
              <span v-if="value">{{ $helpers.capitalizeFirstLetter($t(moduleName + "." + value.stringValue)) }}</span>
              <span v-else>{{ $helpers.capitalizeFirstLetter($t('undefined')) }}</span>
            </small>

          </template>
        </v-progress-linear>
      </template>
      <template v-for="key in store.fieldsByType.string" v-slot:[`item.${key}`]="{ value }" :key="key">
        {{ value }}
      </template>
      <template v-for="key in store.fieldsByType.stringsList" v-slot:[`item.${key}`]="{ value }" :key="key">
        <v-list>
          <v-list-item v-for="element in value" :key="element">{{ element.stringValue }}</v-list-item>
        </v-list>
      </template>
      <!-- #endregion other keys-->

      <!-- #endregion dynamic keys-->

      <template v-slot:bottom>
        <v-row>
          <v-col>
            <v-pagination :total-visible="7" v-model="store.currentPage" :length="Math.ceil(totalItems / itemsPerPage)"
              rounded="circle" density="compact" active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
          </v-col>
        </v-row>
      </template>
    </v-data-table-server>
  </v-container>

  <v-dialog v-model="store.isLoadingWithLock" max-width="320" persistent>
    <v-list class="py-2 bg-blue-darken-4" elevation="12" rounded="lg">
      <v-list-item :title="$helpers.capitalizeFirstLetter($t('loading'))">
        <template v-slot:prepend>
          <div class="pe-4">
            <img src="/images/asd-group-logo-couleur-transparent-white.png" alt="ASD GROUP" title="ASD GROUP"
              height="48" />
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular indeterminate="disable-shrink" size="16" width="2"></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>

  <columns-dialog v-if="store" :defaultColumns="defaultColumns" :moduleName="moduleName" :store="store"
    :visibleColumns="visibleFields" @saveSettings="saveSettings" />

  <filters-dialog v-if="store != null && moduleName != null" :moduleName="moduleName" :store="store"
    @saveFilters="saveFilters" />

</template>

<script setup>
import { computed, onMounted, ref, shallowRef } from "vue";
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useLeadStore } from '@/stores/lead'
import { useCountryStore } from '@/stores/country'
const countryStore = useCountryStore()
import { useSettings } from '@/stores/settings'
const settingsStore = useSettings()

import AgencyComponent from "@/components/AgencyComponent.vue";
import CountryComponent from '@/components/CountryComponent.vue';
import SocietyComponent from '@/components/SocietyComponent.vue';
import ColumnsDialog from "./ColumnsDialog.vue";
import FiltersDialog from "./FiltersDialog.vue";
import UtilisateurComponent from "@/components/UtilisateurComponent.vue";
import { isArray } from "lodash";


const props = defineProps({
  addItem: {
    type: Boolean,
    required: true,
  },
  componentPath: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
})

const store = shallowRef(null);
switch (props.moduleName)
{
  case "lead":
    store.value = useLeadStore()
    break;
}


const itemsPerPage = shallowRef(globalStore.perPage)
const loading = shallowRef(true)
const searchFilters = ref(JSON.parse(JSON.stringify(store.value.getSearchFilters())))
const showColumns = shallowRef(false)
const serverItems = shallowRef([])
const sortBy = ref(JSON.parse(JSON.stringify(store.value.getOrderBy())))
const totalItems = shallowRef(0)

const defaultColumns = computed(() =>
{
  return store.value.getContextKey("visibleFields", true)
})
const visibleFields = computed(() =>
{
  return store.value.getVisibleFields()
})


onMounted(async () =>
{
  settingsStore.findItemsByType(store.value.localStorageName)
  if (countryStore.list.length)
  {
    await countryStore.findAll()
  }
})

function addAnItem()
{
  router.push({ name: props.moduleName + ".page", params: { id: "new" } });
}


async function exportList()
{
  let fields = JSON.parse(JSON.stringify(store.value.visibleFields)).map(e => e.key);

  let exportList = await store.value.exportList(
    sortBy.value[0],
    searchFilters.value,
    fields
  );
  helpers.saveToExcel(props.moduleName, exportList);
}




async function loadItems({ page, itemsPerPage, sortBy, groupBy, search })
{
  loading.value = true;
  if (isArray(sortBy))
  {
    sortBy = sortBy[0] ?? store.value.getOrderBy(true)[0]
  }
  await store.value.findPage(page, itemsPerPage, sortBy, searchFilters.value)
  serverItems.value = store.value.list
  totalItems.value = store.value.listLength
  loading.value = false;
}

function saveFilters(filters)
{
  globalStore.showFiltersDialog = false
  searchFilters.value = filters
  store.value.setSearchFilters(JSON.parse(JSON.stringify(searchFilters.value)))
  store.value.currentPage = 1
  loadItems({ page: store.value.currentPage, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value, groupBy: [], search: searchFilters.value })
}

function saveSettings(clonedVisibleColumns)
{
  if (Object.keys(clonedVisibleColumns).length)
  {
    store.value.setVisibleFields(JSON.parse(JSON.stringify(clonedVisibleColumns)));
  }
  globalStore.showColumnsDialog = false
}

</script>
