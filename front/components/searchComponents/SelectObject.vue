<template>
  <div v-if="list && list.length">
    <v-autocomplete v-model="model" :items="list" :item-title="getObjectName" item-value="id" :label="label"
      :placeholder="label" auto-focus clearable auto-select-first min-width="150" density="compact" :chips="chips"
      :closable-chips="closableChips" return-object :multiple="true">
      <template v-slot:selection="{ item }">
        <agency-component v-if="fieldObjectType == 'agency'" :agency="item.raw" />
        <country-component v-else-if="fieldObjectType == 'country'" :country="item.raw" />
        <society-component v-else-if="fieldObjectType == 'society'" :society="item.raw" />
        <utilisateur-component v-else-if="fieldObjectType == 'user'" :user="item.raw" />
        <v-chip v-else-if="item.raw" :style="getCssForText(item.raw)" density="compact">
          {{ getStringValue(item.raw) }}
        </v-chip>
      </template>
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props">
          <template v-slot:title>
            <agency-component v-if="fieldObjectType == 'agency'" :agency="item.raw" />
            <country-component v-else-if="fieldObjectType == 'country'" :country="item.raw" />
            <society-component v-else-if="fieldObjectType == 'society'" :society="item.raw" />
            <utilisateur-component v-else-if="fieldObjectType == 'user'" :user="item.raw" />
            <v-chip v-else-if="item.raw" :style="getCssForText(item.raw)" density="compact">
              {{ getStringValue(item.raw) }}
            </v-chip>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
  <v-skeleton-loader v-else type="list-item-avatar" />
</template>

<script setup lang="ts">
import { shallowRef, ref, onMounted } from 'vue';
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useI18n } from "vue-i18n";
const { t, te } = useI18n({ useScope: "global" });
import { useAgencyStore } from '@/stores/agency';
import { useBusinessSectorStore } from '@/stores/businessSector';
import { useCountryStore } from '@/stores/country';
import { useLeadTypeStore } from '@/stores/leadType';
import { useServiceDomainStore } from '@/stores/serviceDomain';
import { useServiceTypeStore } from '@/stores/serviceType';
import { useSocietyStore } from '@/stores/society';
import { useUserStore } from '@/stores/user';

import AgencyComponent from "@/components/AgencyComponent.vue";
import CountryComponent from '@/components/CountryComponent.vue';
import SocietyComponent from '@/components/SocietyComponent.vue';
import UtilisateurComponent from '@/components/UtilisateurComponent.vue'
import { Item } from '@/interfaces/item';
import { useCustomerTypeStore } from '@/stores/customerType';

const props = defineProps({
  fieldname: {
    type: String,
    required: true,
  },
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
  moduleName: {
    type: String,
    required: true,
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
  withSlots: {
    type: Boolean,
    required: false,
    default: false
  },
})

const list = ref<Array<any>>([]);
const model = defineModel<any>()


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
    case "customerType":
      store.value = useCustomerTypeStore()
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
  if (store.value && !store.value.list.length) {
    if (['agency', 'society', 'user'].includes(props.fieldObjectType)) {
      await store.value.findAllActive();
    } else {
      await store.value.findAll();
    }
  }
  if (store.value && store.value.list.length) {
    list.value = JSON.parse(JSON.stringify(store.value.list));
  } else {
    console.log(props.fieldname)
  }
})



function getObjectName(e: any)
{
  if (typeof e.pays !== 'object' || !('iso3166' in e) && (!('pays' in e) || typeof e.pays !== 'object' || !('iso3166' in e.pays))) return e.stringValue;
  return (e.iso3166 ?? e.pays.iso3166) + e.stringValue;
}

function getCssForText(item: Item)
{
  return helpers.getCssForText(getStringValue(item));
}

function getStringValue(item: Item)
{
  let text = item.stringValue ?? '<unknown>'
  return helpers.capitalizeFirstLetter(te(text) ? t(text) : text);
}
</script>
