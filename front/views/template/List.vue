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
    <v-btn class="p-0 pr-1 mr-1 bg-secondary" size="x-small" @click="displaySaveCRMListSettingsModal()">
      <v-icon>mdi-cloud-upload</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('save settings')) }}
    </v-btn>
    <v-btn size="x-small" :title="$helpers.capitalizeFirstLetter($t('filters'))"
      class="bg-secondary position-relative p-0 pr-1 mb-1 mt-1 mr-1" @click="showFilters = !showFilters">
      <span v-if="store.getNumberOfFilters()"
        class="badge badge-pill badge-danger z-index999 position-absolute top-5 right-5">{{
          store.getNumberOfFilters() }}</span>
      <v-icon v-if="showFilters">
        mdi-filter-off
      </v-icon>
      <v-icon v-else>
        mdi-filter
      </v-icon>
      &nbsp;{{ $helpers.capitalizeFirstLetter($t('filters')) }}
    </v-btn>
    <v-btn class="p-0 pr-1 bg-secondary mr-1" size="x-small" :title="$helpers.capitalizeFirstLetter($t('columns'))"
      @click="globalStore.showColumnsDialog = true">
      <v-icon>mdi-table-column-plus-after</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('columns')) }}
    </v-btn>
  </v-app-bar>

  <v-main class="w-100">
    <v-data-table-server :hover="true" v-model:items-per-page="itemsPerPage" :headers="visibleFields" striped="even"
      :items="serverItems" :items-length="totalItems" :loading="loading" @update:options="loadItems"
      v-model:page="store.currentPage" density="compact" v-model:sort-by="sortBy">


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


      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th>
              <div class="d-flex align-center">
                <span class="me-2 cursor-pointer" @click="toggleSort(column)">
                  {{ $helpers.capitalizeFirstLetter($t($te(moduleName + '.' + column.key) ? moduleName + '.' +
                    column.key : column.key)) }}
                </span>

                <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" color="medium-emphasis"></v-icon>
              </div>
            </th>
          </template>
        </tr>
      </template>

      <template v-slot:[`item.countryOfDestination`]="{ value }">
        <country-component v-if="value" :country="value" />
      </template>
      <template v-slot:[`item.countryOfEstablishment`]="{ value }">
        <country-component v-if="value" :country="value" />
      </template>
      <template v-slot:[`item.createdAt`]="{ value }">
        <span :title="$helpers.formatDateTime(value)">
          {{ $helpers.formatDate(value) }}
        </span>
      </template>
      <template v-slot:[`item.leadType`]="{ value }">
        <v-progress-linear v-if="value" :model-value="getLeadTypeValue(value)" :color="getLeadTypeVariant(value.name)"
          height="25" :max="highestLeadTypePosition - lowestLeadTypePosition" rounded>
          <template v-slot:default>
            <small :class="getLeadTypeColor(value.name)">{{ $helpers.capitalizeFirstLetter($t("lead." +
              value.stringValue)) }}</small>
          </template>
        </v-progress-linear>
      </template>
      <template v-for="key in ['rgpdAccepted', 'onNewsletterList']" v-slot:[`item.${key}`]="{ value }">
        <v-icon v-if="value === true" class="text-success" :key="key + 'Check'">
          mdi-check
        </v-icon>
        <v-icon v-else-if="value === false" class="text-danger" :key="key + 'Close'">
          mdi-close
        </v-icon>
        <v-icon v-else class="text-warning" :key="key + 'Help'">
          mdi-help
        </v-icon>
      </template>
      <template v-slot:[`item.society`]="{ value }">
        <society-component v-if="value" :society="value" />
      </template>
      <template v-slot:[`item.user`]="{ value }">
        <span v-if="value?.email" :class="{ 'font-italic opacity-50': !value.actif }">
          <img :src="$helpers.getGravatarURL(value.email, 24, $gravatarDefaultImage)" style="vertical-align: bottom;" />
          {{ value.stringValue }}
        </span>
      </template>

      <template v-slot:bottom>
        <v-row>
          <v-col>
            <v-pagination :total-visible="7" v-model="store.currentPage" :length="Math.ceil(totalItems / itemsPerPage)"
              rounded="circle" density="compact" active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
          </v-col>
        </v-row>
      </template>
    </v-data-table-server>
  </v-main>

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

  <columns-dialog v-if="store" :moduleName="moduleName" :store="store" :visibleColumns="visibleFields"
    @saveSettings="saveSettings" />
</template>

<script setup>
import { computed, onMounted, shallowRef } from "vue";
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useLeadStore } from '@/stores/lead'
import { useLeadTypeStore } from '@/stores/leadType'
const leadTypeStore = useLeadTypeStore()
import { useCountryStore } from '@/stores/country'
const countryStore = useCountryStore()
import { useCrmListSettings } from '@/stores/crmListSettings'
const crmListStore = useCrmListSettings()

import CountryComponent from '@/components/CountryComponent.vue';
import SocietyComponent from '@/components/SocietyComponent.vue';
import ColumnsDialog from "./ColumnsDialog.vue";


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

leadTypeStore.findAll()

const itemsPerPage = shallowRef(globalStore.perPage)
const loading = shallowRef(true)
const searchFilters = shallowRef([])
const showColumns = shallowRef(false)
const showFilters = shallowRef(false)
const serverItems = shallowRef([])
const sortBy = shallowRef([{ key: 'createdAt', order: 'desc' }])
const totalItems = shallowRef(0)

const lowestLeadTypePosition = computed(() => { return leadTypeStore.getLowestPosition() })
const highestLeadTypePosition = computed(() => { return leadTypeStore.getHighestPosition() })
const visibleFields = computed(() =>
{
  return store.value.getVisibleFields()
})

onMounted(() =>
{
  crmListStore.findItemsByType(store.value.localStorageName)
})

function addAnItem()
{
  router.push({ name: props.moduleName + ".page", params: { id: "new" } });
}


async function exportList()
{
  let fields = JSON.parse(JSON.stringify(store.value.visibleFields)).map(e => e.key);

  let exportList = await store.value.exportList(
    sortBy.value,
    searchFilters.value,
    fields
  );
  helpers.saveToExcel(props.moduleName, exportList);
}

function getLeadTypeValue(value) { return value.position - lowestLeadTypePosition.value }

function getLeadTypeColor(typeName)
{
  switch (typeName)
  {
    case 'lost':
      return 'text-white';

    case 'spam':
      return 'text-white';

    case 'won':
      return 'text-white';

    default:
      return 'grey-darken-4';
  }
}

function getLeadTypeVariant(typeName)
{
  switch (typeName)
  {
    case 'lost':
      return 'error';

    case 'spam':
      return 'grey-darken-4';

    case 'won':
      return 'success';

    default:
      return 'warning';
  }
}

async function loadItems({ page, itemsPerPage, sortBy, groupBy, search })
{
  loading.value = true;
  let sortByKey = "id"
  let sortByOrder = true
  if (sortBy.length)
  {
    sortByKey = sortBy[0].key
    sortByOrder = sortBy[0].order == 'desc'
  }
  await store.value.findPage(page, itemsPerPage, sortByKey, sortByOrder, [])
  serverItems.value = store.value.list
  totalItems.value = store.value.listLength
  loading.value = false;
}

function saveSettings(clonedAvailableColumns, clonedVisibleColumns)
{
  if (Object.keys(clonedVisibleColumns).length)
  {
    store.value.availableFields = JSON.parse(JSON.stringify(clonedAvailableColumns));
    store.value.visibleFields = JSON.parse(JSON.stringify(clonedVisibleColumns));
  }
  globalStore.showColumnsDialog = false
}

</script>
