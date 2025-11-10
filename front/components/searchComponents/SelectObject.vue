<template>
  <div v-if="!preloadData || (list && list.length)">
    <v-autocomplete v-model="model" :items="list" :item-title="getObjectName" item-value="id" :label="label" auto-focus
      clearable auto-select-first min-width="150" density="compact" :chips="chips" :closable-chips="closableChips"
      return-object :multiple="multiple" @update:search="searchItem" :loading="store?.isLoading ? 'error' : false"
      :prepend-inner-icon="prependIcon" autocomplete="off" ref="selectBox">
      <template v-slot:selection="{ item }">
        <agency-component v-if="fieldObjectType == 'agency'" :agency="item.raw" />
        <country-component v-else-if="fieldObjectType == 'country'" :country="item.raw" />
        <customer-component v-else-if="fieldObjectType == 'customer'" :customer="item.raw" />
        <invoice-condition-component v-else-if="fieldObjectType == 'invoiceCondition'" :invoice-condition="item.raw" />
        <society-component v-else-if="fieldObjectType == 'society'" :society="item.raw" />
        <utilisateur-component v-else-if="fieldObjectType == 'user'" :user="item.raw" />
        <v-chip v-else-if="item.raw" :style="getCssForText(item.raw)" density="compact" class="text-no-wrap">
          {{ getStringValue(item.raw) }}
        </v-chip>
      </template>
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" :disabled="store?.isLoading">
          <template v-slot:title>
            <agency-component v-if="fieldObjectType == 'agency'" :agency="item.raw" />
            <country-component v-else-if="fieldObjectType == 'country'" :country="item.raw" />
            <invoice-condition-component v-else-if="fieldObjectType == 'invoiceCondition'"
              :invoice-condition="item.raw" />
            <customer-component v-else-if="fieldObjectType == 'customer'" :customer="item.raw" />
            <society-component v-else-if="fieldObjectType == 'society'" :society="item.raw" />
            <utilisateur-component v-else-if="fieldObjectType == 'user'" :user="item.raw" />
            <v-chip v-else-if="item.raw" :style="getCssForText(item.raw)" density="compact">
              {{ getStringValue(item.raw) }}
            </v-chip>
          </template>
        </v-list-item>
      </template>
      <template v-slot:no-data>
        <v-list-item v-bind="props" v-if="store?.isLoading">
          <v-progress-circular color="white" indeterminate :size="20" :width="2"></v-progress-circular>&nbsp;{{
            $t('loading') }}...
        </v-list-item>
        <v-list-item class="text-no-wrap" v-else>{{ $helpers.capitalizeFirstLetter($t('no data available'))
          }}</v-list-item>
      </template>
    </v-autocomplete>
  </div>
  <v-skeleton-loader v-else type="list-item-avatar" />
</template>

<script setup lang="ts">
import { shallowRef, ref, onMounted, watch } from 'vue';
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useI18n } from "vue-i18n";
const { t, te } = useI18n({ useScope: "global" });
import { useAgencyStore } from '@/stores/agency';
import { useBusinessSectorStore } from '@/stores/businessSector';
import { useCountryStore } from '@/stores/country';
import { useCustomerStore } from '@/stores/customer';
import { useInvoiceConditionStore } from '@/stores/invoiceCondition';
import { useLeadTypeStore } from '@/stores/leadType';
import { useLeadOriginStore } from '@/stores/leadOrigin';
import { useServiceDomainStore } from '@/stores/serviceDomain';
import { useServiceTypeStore } from '@/stores/serviceType';
import { useSocietyStore } from '@/stores/society';
import { useUserStore } from '@/stores/user';

import AgencyComponent from "@/components/AgencyComponent.vue";
import CountryComponent from '@/components/CountryComponent.vue';
import CustomerComponent from '@/components/CustomerComponent.vue';
import InvoiceConditionComponent from '../InvoiceConditionComponent.vue';
import SocietyComponent from '@/components/SocietyComponent.vue';
import UtilisateurComponent from '@/components/UtilisateurComponent.vue'
import { ItemInterface } from '@/interfaces/ItemInterface';
import { useCustomerTypeStore } from '@/stores/customerType';
import _ from 'lodash';

const props = defineProps({
  fieldObjectType: {
    type: String,
    required: true,
  },
  fieldObjectEnum: {
    type: Array,
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
  multiple: {
    type: Boolean,
    required: false,
    default: true
  },
  chips: {
    type: Boolean,
    required: false,
    default: false
  },
  closableChips: {
    type: Boolean,
    required: false,
    default: false
  },
  initialValue: {
    type: Array,
    required: false,
    default()
    {
      return []
    }
  },
  parent: {//parent is a potential filter to find items
    type: Object,
    required: false,
    default: undefined
  },
  preloadData: {
    type: Boolean,
    required: false,
    default: true
  },
  prependIcon: {
    type: String,
    required: false
  },
  withSlots: {
    type: Boolean,
    required: false,
    default: false
  },
})

const list = ref<Array<any>>([]);
const model = defineModel<any>()
const selectBox = ref<(HTMLElement & { focus: () => void }) | null>(null);

const store = shallowRef<any>(null);

onMounted(async () =>
{
  switch (props.fieldObjectType) {
    case "agency":
      store.value = useAgencyStore()
      break;
    case "businessSector":
      store.value = useBusinessSectorStore()
      break;
    case "country":
      store.value = useCountryStore()
      break;
    case "customer":
      store.value = useCustomerStore()
      break;
    case "customerType":
      store.value = useCustomerTypeStore()
      break;
    case "invoiceCondition":
      store.value = useInvoiceConditionStore()
      break;
    case "leadOrigin":
      store.value = useLeadOriginStore()
      break;
    case "leadType":
      store.value = useLeadTypeStore()
      break;
    case "serviceDomain":
      store.value = useServiceDomainStore()
      break;
    case "serviceType":
      store.value = useServiceTypeStore()
      break;
    case "society":
      store.value = useSocietyStore()
      break;
    case "user":
      store.value = useUserStore()
      break;
    default:
      if (props.fieldObjectEnum && props.fieldObjectEnum.length) {
        list.value = props.fieldObjectEnum;
      }
      break;
  }
  if (store.value && !store.value.list.length && props.preloadData) {
    if (['agency', 'society', 'user'].includes(props.fieldObjectType)) {
      await store.value.findAllActive();
    } else {
      await store.value.findAll();
    }
  }
  if (store.value && store.value.list.length) {
    list.value = JSON.parse(JSON.stringify(store.value.list));
  } else if (!store.value) {
    console.log('module for ' + props.label + ' is unknown')
  }
})

watch(() => props.parent, parentWatcher)

function getCssForText(item: ItemInterface)
{
  return helpers.getCssForText(getStringValue(item));
}

function getObjectName(e: any)
{
  if (typeof e.pays !== 'object' || !('iso3166' in e) && (!('pays' in e) || typeof e.pays !== 'object' || !('iso3166' in e.pays))) return e.stringValue;
  return (e.iso3166 ?? e.pays.iso3166) + e.stringValue;
}


function getStringValue(item: ItemInterface)
{
  let text = item.stringValue ?? '<unknown>'
  return helpers.capitalizeFirstLetter(te(text) ? t(text) : text);
}

const loadData = async (text: string) =>
{
  if (props.preloadData || props.parent) return;
  list.value = [];
  if (text.length < 3) return;
  list.value = await store.value.findByName(text);
}

async function parentWatcher()
{
  model.value = null;
  list.value = [];
  if (props.parent) {
    list.value = await store.value.findByParent(props.parent);
    if (selectBox.value) {
      selectBox.value.focus();
    }
  }
}

const searchItem = _.debounce(loadData, 1000);
</script>
