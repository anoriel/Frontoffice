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
      @click="showSettings = !showSettings">
      <v-icon>mdi-table-column-plus-after</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('columns')) }}
    </v-btn>
  </v-app-bar>

  <v-main>
    <v-data-table-server :hover="true" v-model:items-per-page="itemsPerPage" :headers="visibleFields" striped="even"
      :items="serverItems" :items-length="totalItems" :loading="loading" @update:options="loadItems"
      v-model:page="store.currentPage" density="compact" v-model:sort-by="sortBy">


      <template v-slot:top>
        <small class="text-center" v-if="totalItems"><i>{{ totalItems }} {{ $t("record",
          totalItems) }}</i></small>
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
            <small>{{ $helpers.capitalizeFirstLetter($t("lead." + value.stringValue)) }}</small>
          </template>
        </v-progress-linear>
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
          <v-col cols="5" sm="4" md="3" lg="2" xl="1">
            <v-select :model-value="itemsPerPage" :items="globalStore.perPageOptions"
              :label="$helpers.capitalizeFirstLetter($t('per page'))" density="compact"
              @update:model-value="itemsPerPage = parseInt($event, 10)" />
          </v-col>
          <v-col class="text-center pt-2" cols="7" sm="8" md="9" lg="10" xl="10" offset-xl="1">
            <v-pagination v-model="store.currentPage" :length="Math.ceil(totalItems / itemsPerPage)" rounded="circle"
              density="compact" active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
          </v-col>
        </v-row>
      </template>
    </v-data-table-server>
  </v-main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });
import { useLeadStore } from '@/stores/lead'
import { useLeadTypeStore } from '@/stores/leadType'
const leadTypeStore = useLeadTypeStore()
import { useCountryStore } from '@/stores/country'
const countryStore = useCountryStore()
import { useCrmListSettings } from '@/stores/crmListSettings'
const crmListStore = useCrmListSettings()

import CountryComponent from '@/components/CountryComponent.vue';
import SocietyComponent from '@/components/SocietyComponent.vue';


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

const store = ref(null);
switch (props.moduleName)
{
  case "lead":
    store.value = useLeadStore()
    break;
}

leadTypeStore.findAll()

const showFilters = ref(false)

const itemsPerPage = ref(globalStore.perPage)
const serverItems = ref([])
const loading = ref(true)
const sortBy = ref([{ key: 'createdAt', order: 'desc' }])
const totalItems = ref(0)


const lowestLeadTypePosition = computed(() => { return leadTypeStore.getLowestPosition() })
const highestLeadTypePosition = computed(() => { return leadTypeStore.getHighestPosition() })

const visibleFields = computed(() =>
{
  let visibleFields = store.value.getVisibleFields()
  for (let i in visibleFields)
  {
    if (!('title' in visibleFields[i]) || visibleFields[i].title === null)
    {
      visibleFields[i].title = helpers.capitalizeFirstLetter(t(visibleFields[i].key))
    }
  }
  return visibleFields
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
  let fields = JSON.parse(JSON.stringify(store.customFields)).map(e => e.key);

  let exportList = await this.$store.dispatch(props.moduleName + "/export", [
    store.getSortBy,
    store.getSortDesc,
    store.getSearchFilters,
    fields
  ]);
  this.saveToExcel(props.moduleName, exportList);
}

function getLeadTypeValue(value) { return value.position - lowestLeadTypePosition.value }

function getLeadTypeVariant(typeName)
{
  switch (typeName)
  {
    case 'lost':
      return 'error';

    case 'spam':
      return 'black';

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


</script>
