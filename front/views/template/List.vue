<template>
  <v-app-bar density="compact" variant="flat">
    <v-spacer></v-spacer>

    <v-btn v-if="addItem" class="p-0 pr-1 bg-primary mr-1" size="x-small" @click="addAnItem" :disabled="loading">
      <v-icon>mdi-plus-circle-outline</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('add' +
        $helpers.capitalizeFirstLetter(moduleName))) }}
    </v-btn>
    <v-btn v-if="canExport" class="p-0 pr-1 mr-3 bg-primary" size="x-small" @click="exportList" :disabled="loading">
      <v-icon>mdi-file-excel</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('export')) }}
    </v-btn>



    <v-menu open-delay="10" close-delay="10"
      v-if="canSavetSettings && settingsStore.settingsByStorageName[store.localStorageName] && settingsStore.settingsByStorageName[store.localStorageName].length > 0">
      <template v-slot:activator="{ props }" :disabled="loading">
        <v-btn v-bind="props" class="p-0 pr-1 mr-1 bg-secondary" size="x-small" :disabled="loading">
          <v-icon>mdi-cloud-download</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('load settings')) }}
        </v-btn>
      </template>

      <v-list v-if="getFilteredSettingsByStorageName().length" density="compact">
        <v-list-subheader color="primary">{{ $helpers.capitalizeFirstLetter($t('personal parameters'))
          }}</v-list-subheader>
        <v-list-item v-for="item in getFilteredSettingsByStorageName()" :key="item.id" :value="item.id"
          @click="loadFilters(item)">
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="getPublicSettingsByStorageName().length" density="compact">
        <v-list-subheader color="primary">{{ $helpers.capitalizeFirstLetter($t('public parameters'))
          }}</v-list-subheader>
        <v-list-item v-for="item in getPublicSettingsByStorageName()" :key="item.id" :value="item.id"
          @click="loadFilters(item)">
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn v-if="canSavetSettings" class="p-0 pr-1 mr-1 bg-secondary" size="x-small"
      @click="globalStore.showSettingsDialog = true" :disabled="loading">
      <v-icon>mdi-cloud-upload</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('save settings')) }}
    </v-btn>
    <v-badge location="top right" color="warning" :model-value="store.getNumberOfFilters() > 0"
      :content="store.getNumberOfFilters()" class="mb-1 mt-1 mr-1" :class="{ 'mr-3': store.getNumberOfFilters() > 0 }">
      <v-btn size="x-small" :title="$helpers.capitalizeFirstLetter($t('filters'))"
        class="bg-secondary position-relative p-0 pr-1" @click="globalStore.showFiltersDialog = true"
        :disabled="loading">
        <v-icon>mdi-filter</v-icon>
        &nbsp;{{ $helpers.capitalizeFirstLetter($t('filters')) }}
      </v-btn>
    </v-badge>
    <v-btn v-if="canSavetSettings" class="p-0 pr-1 bg-secondary mr-1" size="x-small"
      :title="$helpers.capitalizeFirstLetter($t('columns'))" @click="globalStore.showColumnsDialog = true"
      :disabled="loading">
      <v-icon>mdi-table-column-plus-after</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('columns')) }}
    </v-btn>
  </v-app-bar>

  <v-container fluid class="w-100">
    <v-data-table-server :hover="true" v-model:items-per-page="itemsPerPage" :headers="visibleFields" striped="even"
      :items="serverItems" :items-length="totalItems" :loading="loading" @update:options="loadItems"
      v-model:page="store.currentPage" density="compact" v-model:sort-by="sortBy" fixed-header style="max-height: 99%;"
      @click:row="(event, { item, index }) => openItemPage(event, item, index)" :row-props="rowClasses">

      <!-- #region top -->
      <template v-slot:top>
        <small class="text-center">
          <i v-if="!store.pageCountIsLoading && totalItems > 0">{{ totalItems.toLocaleString() }} {{ $t("record",
            totalItems) }}</i>
          <span v-else-if="store.pageCountIsLoading">
            <v-progress-circular color="white" indeterminate :size="20" :width="2"></v-progress-circular>&nbsp;{{
              $t('getting total records') }}...
          </span>
        </small>
        <v-row>
          <v-col class="position-relative">
            <v-select :model-value="itemsPerPage" :items="globalStore.perPageOptions"
              :label="$helpers.capitalizeFirstLetter($t('per page'))" density="compact"
              @update:model-value="itemsPerPage = parseInt($event, 10)" class="position-absolute right-0"
              style="min-width: 120px;" />
            <v-pagination v-if="!store.pageCountIsLoading" :total-visible="7" v-model="store.currentPage"
              :length="Math.ceil(totalItems / itemsPerPage)" rounded="circle" density="compact"
              active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
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
        <contact-component v-else-if="object.type == 'contact' && value" :contact="value" />
        <country-component v-else-if="object.type == 'country' && value" :country="value" />
        <society-component v-else-if="object.type == 'society' && value" :society="value" />
        <UtilisateurComponent v-else-if="object.type == 'user' && value" :user="value" />
        <v-chip v-else-if="value" :style="$helpers.getCssForText(value.stringValue)">{{ value.stringValue }}</v-chip>
      </template>
      <!-- #endregion specific object keys-->

      <!-- #region specific object keys -->
      <template v-for="list in store.fieldsByType.objectsList" v-slot:[`item.${list.name}`]="{ value }" :key="list">
        <template v-for="object in value" :key="object">
          <agency-component v-if="list.type == 'agency' && object" :agency="object" />
          <contact-component v-else-if="list.type == 'contact' && object" :contact="object" />
          <country-component v-else-if="list.type == 'country' && object" :country="object" />
          <society-component v-else-if="list.type == 'society' && object" :society="object" />
          <UtilisateurComponent v-else-if="list.type == 'user' && object" :user="object" />
          <v-chip v-else-if="object" :style="$helpers.getCssForText(object.stringValue)">
            {{ object.stringValue }}
          </v-chip>
        </template>
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
            <v-pagination v-if="!store.pageCountIsLoading" :total-visible="7" v-model="store.currentPage"
              :length="Math.ceil(totalItems / itemsPerPage)" rounded="circle" density="compact"
              active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
          </v-col>
        </v-row>
      </template>
    </v-data-table-server>
  </v-container>

  <columns-dialog v-if="store" :defaultColumns="defaultColumns" :moduleName="moduleName" :store="store"
    :visibleColumns="visibleFields" @saveColumns="saveColumns" />

  <filters-dialog v-if="store != null && moduleName != null" :moduleName="moduleName" :store="store"
    @saveFilters="saveFilters" />

  <SaveSettingsDialog v-if="store != null && moduleName != null" :localStorageName="store.localStorageName"
    @saveListSettingsToCloud="saveListSettingsToCloud" />

</template>

<script setup>
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import merge from 'deepmerge-json';
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useCustomerStore } from "@/stores/customer";
import { useLeadStore } from '@/stores/lead'
import { useCountryStore } from '@/stores/country'
const countryStore = useCountryStore()
import { useSettingsStore } from '@/stores/settings'
const settingsStore = useSettingsStore()

import AgencyComponent from "@/components/AgencyComponent.vue";
import ContactComponent from "@/components/ContactComponent.vue";
import CountryComponent from '@/components/CountryComponent.vue';
import SocietyComponent from '@/components/SocietyComponent.vue';
import ColumnsDialog from "./ColumnsDialog.vue";
import FiltersDialog from "./FiltersDialog.vue";
import UtilisateurComponent from "@/components/UtilisateurComponent.vue";
import _ from "lodash";
import SaveSettingsDialog from "./SaveSettingsDialog.vue";
import { useSecurityStore } from "@/stores/security";
import { useVatInvoiceStore } from "@/stores/vatInvoice";


const props = defineProps({
  addItem: {
    type: Boolean,
    required: true,
  },
  additionnalFilters: {
    type: Object,
    required: false,
    default: {},
  },
  canExport: {
    type: Boolean,
    required: false,
    default: true,
  },
  canSavetSettings: {
    type: Boolean,
    required: false,
    default: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
})

const store = shallowRef(null);
switch (props.moduleName)
{
  case "customer":
    store.value = useCustomerStore()
    break;
  case "lead":
    store.value = useLeadStore()
    break;
  case "vatInvoice":
    store.value = useVatInvoiceStore()
    break;
}


const itemsPerPage = shallowRef(globalStore.perPage)
const loading = shallowRef(false)
const rowBeingEdited = shallowRef({})
const searchFilters = ref(JSON.parse(JSON.stringify(store.value.getSearchFilters())))
const showColumns = shallowRef(false)
const serverItems = shallowRef([])
const sortBy = ref(JSON.parse(JSON.stringify(store.value.getOrderBy())))
const totalItems = shallowRef(0)
const isNewQuery = ref(true)//to check if getPageCount must be called

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
  await settingsStore.findSettingsByStorageName(store.value.localStorageName)
  if (countryStore.list.length)
  {
    await countryStore.findAll()
  }
})

watch(() => props.additionnalFilters, (newVal) =>
{
  loadItems({ page: store.value.currentPage, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value, groupBy: [], search: searchFilters.value })
});

function addAnItem()
{
  if (loading.value)
  {
    return;
  }
  globalStore.isLoadingWithLock = true;
  router.push({ name: props.moduleName + ".page", params: { id: "new" } });
}


async function exportList()
{
  if (loading.value)
  {
    return;
  }
  let fields = JSON.parse(JSON.stringify(store.value.visibleFields)).map(e => e.key);

  let exportList = await store.value.exportList(
    sortBy.value[0],
    searchFilters.value,
    fields
  );
  helpers.saveToExcel(props.moduleName, exportList);
}

function getFilteredSettingsByStorageName()
{
  return settingsStore.settingsByStorageName[store.value.localStorageName].filter(e => e.user?.id == useSecurityStore().getId());
}

function getPublicSettingsByStorageName()
{
  return settingsStore.settingsByStorageName[store.value.localStorageName].filter(e => e.user?.id !== useSecurityStore().getId() && e.isPublic);
}

async function getPageCount(search)
{
  let searchValue = searchFilters.value;
  if (props.additionnalFilters)
  {
    searchValue = merge(searchFilters.value, props.additionnalFilters);
  }
  totalItems.value = await store.value.getPageCount(searchValue);
  isNewQuery.value = false;//no need to count again if search does not change
}

function loadFilters(item)
{
  saveFilters(item.context);
}

async function loadItems({ page, itemsPerPage, sortBy, groupBy, search })
{
  let searchValue = _.cloneDeep(searchFilters.value);
  if (props.additionnalFilters)
  {
    let canContinue = true;
    Object.keys(props.additionnalFilters).forEach(key =>
    {
      if (typeof props.additionnalFilters[key] === 'undefined') { canContinue = false; }
    })
    if (!canContinue) { return; }
    searchValue = merge(searchFilters.value, props.additionnalFilters);
  }
  loading.value = true;
  if (_.isArray(sortBy))
  {
    sortBy = sortBy[0] ?? store.value.getOrderBy(true)[0]
  }
  let result = await store.value.findPage(page, itemsPerPage, sortBy, searchValue);
  serverItems.value = store.value.list
  loading.value = false;
  if (isNewQuery.value)//call getCount only if new query, not page changing
  {
    totalItems.value = store.value.totalItems ?? 0
    getPageCount(searchValue)
  }
}

function openItemPage(event, item, index)
{
  if (rowBeingEdited.value[props.moduleName + "-" + item.id])
  {
    rowBeingEdited.value[props.moduleName + "-" + item.id].focus();
    return;
  } else if (('rowIsDisabled' in item && item.rowIsDisabled))
  {
    return;
  }

  const routeData = store.value.getActionOnOpeningItem(item.id);
  if (!('url' in routeData))//if no url, it's a route object, we change the page with router.push or new tab if CTRL key is down
  {
    if (event.ctrlKey)
    {
      let theRoute = router.resolve(routeData);
      // Open in new tab & store rowBeingEdited
      rowBeingEdited.value[props.moduleName + "-" + item.id] = window.open(theRoute.href, '_blank');
    } else
    {
      router.push(routeData);
    }
  } else
  {
    //else it's a url, we open a new window
    //we store the window in rowBeingEdited to avoid opening multiple windows for the same item
    //and to be able to detect when the window is closed
    //so we can reload the item in the list
    //and remove the window from rowBeingEdited
    rowBeingEdited.value[props.moduleName + "-" + item.id] = window.open(routeData.url, '', 'width=1680,height=1024');
  }

  if (props.moduleName + "-" + item.id in rowBeingEdited.value)
  {
    // Later, to detect when myWindow is closed
    var timer = setInterval(function ()
    {
      if (rowBeingEdited.value[props.moduleName + "-" + item.id].closed)
      {
        clearInterval(timer);
        this.reloadItem(item)
      }
    }.bind(this, index), 100);
  }

}

async function reloadItem(item)
{

  if (item != null)
  {
    item._rowVariant = "isBeingEdited font-italic bg-blue-grey-lighten-3 cursor-not-allowed"
    item.rowIsDisabled = true;
    item = await store.value.find(item.id);
    let indexInList = serverItems.value.findIndex(function (el) { return el.id === item.id; });
    if (indexInList > -1)
    {
      item._rowVariant = "blinking bg-red-lighten-3 cursor-pointer"
      serverItems.value.splice(indexInList, 1, item);
      if (props.moduleName + "-" + item.id in rowBeingEdited.value)
      {
        delete rowBeingEdited.value[props.moduleName + "-" + item.id];
      }
      item = serverItems.value[indexInList];
    }
    if ('rowIsDisabled' in item)
    {
      delete indexInList.rowIsDisabled;
    }

    setTimeout(function ()
    {
      this.unblinkRow(item);
    }.bind(this, item), 1500);
  }
}

function rowClasses({ item })
{
  let cssClass = {
  };
  if ('_rowVariant' in item && item._rowVariant)
  {
    cssClass[item._rowVariant] = true;
  } else
  {
    cssClass = { 'cursor-pointer': true }
  }
  return {
    class: cssClass,
  }
}

function saveFilters(filters)
{
  globalStore.showFiltersDialog = false
  Object.keys(filters).forEach((key) =>
  {
    if (_.isArray(filters[key]) && filters[key].length === 0)
    {
      delete filters[key]
    }
  })
  searchFilters.value = filters
  store.value.setSearchFilters(JSON.parse(JSON.stringify(searchFilters.value)))
  store.value.currentPage = 1
  isNewQuery.value = true;//count again as search has changed

  loadItems({ page: store.value.currentPage, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value, groupBy: [], search: searchFilters.value })
}

function saveColumns(clonedVisibleColumns)
{
  if (Object.keys(clonedVisibleColumns).length)
  {
    store.value.setVisibleFields(JSON.parse(JSON.stringify(clonedVisibleColumns)));
  }
  globalStore.showColumnsDialog = false
}

async function saveListSettingsToCloud(selectedListSetting, selectedIsPublic)
{
  let setting = {
    context: searchFilters.value,
    id: null,
    isPublic: selectedIsPublic,
    name: null,
    storageName: store.value.localStorageName,
    user: useSecurityStore().me,
  }
  if (typeof selectedListSetting === 'string')
  {
    setting.name = selectedListSetting.trim();
  } else if (selectedListSetting && 'id' in selectedListSetting)
  {
    setting.id = selectedListSetting.id;
    setting.name = selectedListSetting.name;
  }
  await settingsStore.saveSettingsByStorageName(store.value.localStorageName, setting)

  globalStore.showSettingsDialog = false
}

function unblinkRow(item)
{
  delete item._rowVariant;
}
</script>

<style>
.blinking {
  animation: fastblink 250ms infinite;
}

.isBeingEdited {
  animation: slowblink 2000ms infinite;
}

@keyframes fastblink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes slowblink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
</style>
