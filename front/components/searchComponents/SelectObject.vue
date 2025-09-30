<template>
  <div v-if="store">
    <v-autocomplete v-model="model" :items="list" :item-title="getObjectName" item-value="id" :label="computedLabel"
      :placeholder="computedPlaceholder" auto-focus clearable auto-select-first min-width="150" density="compact">
      <template v-slot:selection="{ item }">
        <agency-component v-if="fieldname == 'agency'" :agency="item.raw" />
        <country-component v-else-if="fieldtype == 'country'" :country="item.raw" />
        <society-component v-else-if="fieldtype == 'society'" :society="item.raw" />
        <utilisateur-component v-else-if="fieldtype == 'user'" :user="item.raw" />
        <v-chip v-else-if="item.raw" :style="$helpers.getCssForText(item.raw.stringValue)">
          {{ item.raw.stringValue }}
        </v-chip>
      </template>
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props">
          <template v-slot:title>
            <agency-component v-if="fieldname == 'agency'" :agency="item.raw" />
            <country-component v-else-if="fieldtype == 'country'" :country="item.raw" />
            <society-component v-else-if="fieldtype == 'society'" :society="item.raw" />
            <utilisateur-component v-else-if="fieldtype == 'user'" :user="item.raw" />
            <v-chip v-else-if="item.raw" :style="$helpers.getCssForText(item.raw.stringValue)">
              {{ item.raw.stringValue }}
            </v-chip>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed, ref } from 'vue';
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

const props = defineProps({
  fieldname: {
    type: String,
    required: true,
  },
  fieldtype: {
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

const list = ref([]);
const model = shallowRef(null);

const store = shallowRef<any>(null);

async function fetchData()
{
  switch (props.fieldtype) {
    case "agency":
      store.value = useAgencyStore()
      break;
    case "businessSector":
      store.value = useBusinessSectorStore()
      break;
    case "country":
      store.value = useCountryStore()
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
  }
  if (store.value && !store.value.list.length) {
    if (['agency', 'user'].includes(props.fieldtype)) {
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
}

const computedLabel = computed(() =>
{
  return helpers.capitalizeFirstLetter(t(te(props.moduleName + '.' + props.fieldname) ? props.moduleName + '.' +
    props.fieldname : props.fieldname))
});

const computedPlaceholder = computed(() =>
{
  return helpers.capitalizeFirstLetter(t(te(props.moduleName + '.' + props.fieldname) ? props.moduleName + '.' +
    props.fieldname : props.fieldname))
});



function getObjectName(e: any)
{
  if (!('iso3166' in e) && (!('pays' in e) || typeof e.pays !== 'object' || !('iso3166' in e.pays))) return e.stringValue;
  return (e.iso3166 ?? e.pays.iso3166) + e.stringValue;
}

fetchData()
</script>
