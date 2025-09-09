<template>
  <v-main>
    <v-row class="flex-row-reverse position-fixed right-0 mt-0 mr-2" style="z-index: 9;">
      <v-badge location="top right" color="error" v-if="timeBeforeSave != null" :content="timeBeforeSave">
        <v-btn :disabled="!originItems.length || !assignmentRulesListIsValid()" color="success" @click="save()"
          class="ml-1">
          <v-icon class="mr-1">mdi-content-save</v-icon>
          {{ $helpers.capitalizeFirstLetter($t('save')) }}
        </v-btn>
      </v-badge>
      <v-btn v-else :disabled="!originItems.length || !assignmentRulesListIsValid()" color="success" @click="save()"
        class="ml-1">
        <v-icon class="mr-1">mdi-content-save</v-icon>
        {{ $helpers.capitalizeFirstLetter($t('save')) }}
      </v-btn>

      <v-btn v-if="timeBeforeSave != null" color="warning" @click="stopTimeBeforeSave()">
        <v-icon color="error">mdi-cancel</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('cancel')) }}
      </v-btn>
    </v-row>

    <v-row>
      <v-btn color="primary" @click="addRule()" size="x-small">
        <v-icon>mdi-text-box-plus</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('add rule')) }}
      </v-btn>
    </v-row>

    <v-dialog max-width="600" v-model="yesNoDialog">
      <v-card :title="$helpers.capitalizeFirstLetter($t('are you sure you want to delete this line?'))">
        <v-card-actions class="bg-surface-light">
          <v-btn :text="$helpers.capitalizeFirstLetter($t('no'))" color="error" @click="removeRowCancelled()" />
          <v-spacer></v-spacer>
          <v-btn :text="$helpers.capitalizeFirstLetter($t('yes'))" color="success" @click="removeRowConfirmed()" />
        </v-card-actions>
      </v-card>
    </v-dialog>>

    <v-row>
      <v-skeleton-loader v-if="!assignmentRulesList.filter(e => !e.isDeleted).length" type="table-row-divider@12" />
      <v-data-table v-else :hover="true" :headers="visibleColumns" striped="even" density="compact"
        :loading-text="$t('loading')" :loading="leadAssignmentRuleStore.isLoading"
        :items="assignmentRulesList.filter(e => !e.isDeleted)" :items-per-page="-1" :hide-default-footer="true"
        class="mb-10">

        <template v-slot:top>
          <small class="text-center" v-if="assignmentRulesList.filter(e => !e.isDeleted).length"><i>{{
            assignmentRulesList.filter(e => !e.isDeleted).length}} {{$t("record",
                assignmentRulesList.filter(e => !e.isDeleted).length)}}</i></small>
        </template>


        <template v-slot:[`item.priority`]="{ index, item, value }">
          <v-row>
            <v-col class="ga-1 pa-0" style="display: flex; flex-direction: column; align-items: center;">
              <small>
                <button v-if="index != 0" @click="priorityUpdate(item, -1)" class="pl-0 pr-0 bg-info">
                  <small>
                    <v-icon>mdi-arrow-up-bold</v-icon>
                  </small>
                </button>
              </small>
              <small>
                <button v-if="index + 1 != assignmentRulesList.length" size="x-small" @click="priorityUpdate(item, 1)"
                  class="pl-0 pr-0 bg-info">
                  <small>
                    <v-icon>mdi-arrow-down-bold</v-icon>
                  </small>
                </button>
              </small>
            </v-col>
            <v-col class="d-flex align-center justify-center pa-0">
              {{ value }}
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.user`]="{ value }">
          <vue-gravatar :email="value.email" :size="24" :default-image="$gravatarDefaultImage" class="gravatar" />
          {{ value.prenom }} {{ value.nom }}
        </template>

        <template v-slot:[`item.rules`]="{ item, value }">
          <v-container>
            <v-row v-for="(key, i) in Object.keys(value)" :key="item.id + '-' + key" align="center"
              :class="{ 'mt-5': i > 0 }">
              <v-card class="w-100 pb-1">
                <template v-slot:subtitle>
                  <small class="left-1 position-absolute top-0 font-weight-bold">{{
                    $helpers.capitalizeFirstLetter($te('lead.' + key) ?
                      $t('lead.' + key) : $t(key)) }}</small>
                </template>
                <span v-for="element in value[key]" :key="element" class="ma-3">
                  <country-component v-if="['countryOfEstablishment', 'countryOfDestination'].includes(key)"
                    :country="countryStore.getById(element)" />
                  <v-chip v-else color="success">{{ getStringValue(key, element) }}</v-chip>
                </span>
              </v-card>
            </v-row>
          </v-container>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="text-info">mdi-pencil-circle</v-icon>
          <v-icon class="text-info" @click="removeRow(item)">mdi-delete-circle</v-icon>
        </template>

      </v-data-table>
    </v-row>

    <v-dialog v-model="showAddRuleFilterModal" max-width="500">
      <v-card :title="$helpers.capitalizeFirstLetter($t('add filter'))">
        <v-form :label="$helpers.capitalizeFirstLetter($t('select filter to add'))" label-for="selectFilterInput">
          <v-select id="selectFilterInput" v-model="selectedFilter" name="selectFilterInput" :items="getRuleFilters()"
            required item-title="value" item-value="key">
          </v-select>
        </v-form>

        <v-card-actions class="bg-surface-light">
          <v-btn :text="$helpers.capitalizeFirstLetter($t('cancel'))" color="error" @click="cancelFilter"></v-btn>
          <v-spacer></v-spacer>
          <v-btn :text="$helpers.capitalizeFirstLetter($t('add'))" color="success" @click="addFilter"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-main>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

import { useGlobalStore } from '@/stores/global'
const globalStore = useGlobalStore()
import { useSecurityStore } from '@/stores/security'
const securityStore = useSecurityStore()
import { useBusinessSectorStore } from '@/stores/businessSector'
const businessSectorStore = useBusinessSectorStore()
import { useCountryStore } from '@/stores/country'
const countryStore = useCountryStore()
import { useServiceDomainStore } from '@/stores/serviceDomain'
const serviceDomainStore = useServiceDomainStore()
import { useServiceTypeStore } from '@/stores/serviceType'
const serviceTypeStore = useServiceTypeStore()
import { useLeadAssignmentRuleStore } from '@/stores/leadAssignmentRule'
const leadAssignmentRuleStore = useLeadAssignmentRuleStore()
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()

import CountryComponent from '@/components/CountryComponent.vue';
import YesNoDialog from '@/components/YesNoDialog.vue';

const assignmentRulesList = ref([])
const currentEditedItem = ref(null)
const currentEditedProperty = ref(null)
const editedItem = ref([])
const originItems = ref([])
const itemIdHover = ref(null)
const rowToRemove = ref(null)
const ruleFilters = ref([
  { "key": "businessSector", "value": helpers.capitalizeFirstLetter(t("lead.businessSector")) },
  { "key": "countryOfDestination", "value": helpers.capitalizeFirstLetter(t("lead.countryOfDestination")) },
  { "key": "countryOfEstablishment", "value": helpers.capitalizeFirstLetter(t("lead.countryOfEstablishment")) },
  { "key": "serviceDomain", "value": helpers.capitalizeFirstLetter(t("lead.serviceDomain")) },
  { "key": "serviceType", "value": helpers.capitalizeFirstLetter(t("lead.serviceType")) },
])
const selectedFilter = ref(null)
const showAddRuleFilterModal = ref(false)
const timeBeforeSave = ref(null)
const timeoutBeforeSave = ref(null)
const visibleColumns = ref([
  { "key": "priority", "title": helpers.capitalizeFirstLetter(t("priority")) },
  { "key": "rules", "title": helpers.capitalizeFirstLetter(t("rules")) },
  { "key": "user", "title": helpers.capitalizeFirstLetter(t("user")) },
  { "key": "actions" }
])
const yesNoDialog = ref(false)

//sort filters by translated values
ruleFilters.value.sort((a, b) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0);



//add id for admin only
onMounted(() =>
{
  if (visibleColumns.value[0]['key'] != 'id' && securityStore.hasRole("ROLE_SUPER_ADMIN"))
  {
    visibleColumns.value.unshift({ "key": "id", "title": "id" });
  }
  fetchData();
})

async function fetchData(reload = false)
{
  if (!businessSectorStore.listLength)
  {
    await businessSectorStore.findAll();
  }
  if (!countryStore.listLength)
  {
    await countryStore.findAll();
  }
  if (!serviceDomainStore.listLength)
  {
    await serviceDomainStore.findAll();
  }
  if (!serviceTypeStore.listLength)
  {
    await serviceTypeStore.findAll();
  }
  if (!leadAssignmentRuleStore.listLength || reload)
  {
    await leadAssignmentRuleStore.findAll();
  }
  if (!userStore.filteredListLength)
  {
    await userStore.findByRole('CRM');
  }
  assignmentRulesList.value = leadAssignmentRuleStore.list;
  sortList();
}

function addFilter()
{
  assignmentRulesList.value[assignmentRulesList.value.indexOf(currentEditedItem.value)].rules[selectedFilter.value] = [];
  currentEditedItem.value = null;
  selectedFilter.value = null;
  showAddRuleFilterModal.value = false;
}

function addItemToEditedItemsList(item)
{
  removeItemAlreadyEdited(item);

  originItems.value.push(JSON.parse(JSON.stringify(item)));

  editedItem.value.push(item);
}

function addRule()
{
  stopTimeBeforeSave();
  let item = {
    "id": getMinId(),
    "user": null,
    "rules": {},
    "priority": getMaxPriority()
  };
  assignmentRulesList.value.push(item);
  currentEditedItem.value = item;
}

function assignmentRuleIsValid(item)
{
  if (!Object.keys(item.rules).length || !item.user)
  {
    return false;
  }
  return true;
}

function assignmentRulesListIsValid()
{
  for (let i in assignmentRulesList.value)
  {
    if (!assignmentRuleIsValid(assignmentRulesList.value[i]))
    {
      return false;
    }
  }
  return true;
}

function cancelFilter()
{
  currentEditedItem.value = null;
  selectedFilter.value = null;
  showAddRuleFilterModal.value = false;
}

async function deleteItem(item)
{
  if (item.id < 0)
  {
    return;
  }
  stopTimeBeforeSave();
  let response = await leadAssignmentRuleStore.delete([item.id]);
  if (response)
  {
    assignmentRulesList.value.splice(assignmentRulesList.value.indexOf(item), 1);

    removeItemAlreadyEdited(item, true);
    sortList(true);
  }
}

function deleteRule(item)
{
  if (item.id < 0)
  {
    assignmentRulesList.value.splice(assignmentRulesList.value.indexOf(item), 1);
    sortList();
    return;
  }
  item.isDeleted = true;
  deleteItem(item);
}

function getItemsList(key)
{
  return getStoreFromKey(key).list;
}

function getStringValue(key, value)
{
  let store = getStoreFromKey(key)
  let item = store.list.find(e => e.id = value);
  return item.stringValue;
}

function getStoreFromKey(key)
{
  let store = null;
  switch (key)
  {
    case "countryOfEstablishment":
    case "countryOfDestination":
      store = countryStore
      break;
    case "serviceDomain":
      store = serviceDomainStore
      break;
    case "serviceType":
      store = serviceTypeStore
      break;
    case "businessSector":
      store = businessSectorStore
      break;
  }
  return store
}

function getMaxPriority()
{
  let max = 1;
  for (let i in assignmentRulesList.value)
  {
    let rule = assignmentRulesList.value[i];
    if (rule.priority >= max)
    {
      max = rule.priority + 1;
    }
  }
  return max;
}

function getMinId()
{
  let min = -1;
  for (let i in assignmentRulesList.value)
  {
    let rule = assignmentRulesList.value[i];
    if (rule.id <= min)
    {
      min = rule.id - 1;
    }
  }
  return min;
}

function getRuleFilters()
{
  let list = this.ruleFilters;
  if (this.currentEditedItem)
  {
    list = list.filter(el => !Object.keys(this.currentEditedItem.rules).includes(el));
  }
  return list;
}

function getUserName(e)
{
  let returnValue = '< ' + $t('not assigned').toUpperCase() + ' >';

  if (e.id == 0)
  {
    returnValue = '< ' + $t('anyone').toUpperCase() + ' >';
  }
  else if (e && e.nom && e.prenom)
  {
    returnValue = e.nom + ", " + e.prenom;
  }
  return returnValue;
}

function priorityUpdate(item, add)
{
  stopTimeBeforeSave();


  let priorityPlus = item.priority + add;
  let foundsList = assignmentRulesList.value.filter(e => e.priority == priorityPlus);
  if (foundsList && foundsList.length)
  {
    for (let i in foundsList)
    {
      let el = foundsList[i];
      el.priority -= add;
      addItemToEditedItemsList(el);
    }
  }
  item.priority += add;
  addItemToEditedItemsList(item);
  sortList(true);
  setTimeBeforeSave(true);
}

function removeItemAlreadyEdited(item, reload = false)
{
  let found = editedItem.value.findIndex(e => e.id == item.id);
  let foundInOrigin = originItems.value.findIndex(e => e.id == item.id);
  if (found >= 0)
  {
    editedItem.value.splice(found, 1);
  }
  //if item is the same as origin we can remove from originItems
  if (foundInOrigin > -1 && helpers.areObjectsEqual(item, originItems.value[foundInOrigin]))
  {
    originItems.value.splice(found, 1);
  }

  if (reload && editedItem.value.length == 0)
  {
    originItems.value = []
    fetchData(true);
  }
}

function removeRow(item)
{
  yesNoDialog.value = true;
  rowToRemove.value = item;
}
function removeRowCancelled()
{
  rowToRemove.value = null;
  yesNoDialog.value = false;
}
async function removeRowConfirmed()
{
  originItems.value.push(rowToRemove.value)
  await deleteItem(rowToRemove.value);
  removeRowCancelled()
}

function rowClass(item, type)
{
  if (!item || type !== 'row') return;
  let classString = [];
  if (itemIdHover.value == item.id)
  {
    classString.push('bg-danger-50');
  }
  if (!assignmentRuleIsValid(item))
  {
    classString.push('bg-danger-20');
  }
  return classString;
}

function setTimeoutBeforeSave(reset = false)
{
  if (timeoutBeforeSave.value != null)
  {
    clearTimeout(timeoutBeforeSave.value);
  }

  if (timeBeforeSave.value == null || reset)
  {
    timeBeforeSave.value = 5;
  }
  else
  {
    timeBeforeSave.value--;
  }
}

function setTimeBeforeSave(reset = false)
{
  if (!assignmentRulesListIsValid())
  {
    return;
  }
  sortList(true);
  setTimeoutBeforeSave(reset);

  if (timeBeforeSave.value <= 0)
  {
    save();
  } else
  {
    timeoutBeforeSave.value = setTimeout(function ()
    {
      setTimeBeforeSave();
    }.bind(this), 1000);
  }
}

function save()
{
  stopTimeBeforeSave();
  for (let i in editedItem.value)
  {
    let rule = editedItem.value[i];
    updated(rule);
  }
}

function displayAddRuleFilterModal(item)
{
  currentEditedItem.value = item;
  showAddRuleFilterModal.value = true;
}

function stopTimeBeforeSave()
{
  if (timeoutBeforeSave.value != null)
  {
    clearTimeout(timeoutBeforeSave.value);
  }

  if (timeBeforeSave.value != null)
  {
    timeBeforeSave.value = null;
  }
}

function sortList(reset = false)
{
  assignmentRulesList.value = assignmentRulesList.value.sort((a, b) => a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0);
  if (reset)
  {
    let priority = 1;
    for (let i in assignmentRulesList.value)
    {
      let item = assignmentRulesList.value[i];
      if (item.priority != priority)
      {
        currentEditedItem.value = item;
        item.priority = priority;
        addItemToEditedItemsList(item);
      }
      priority++;
    }
  }
}

async function updated(item)
{

  let response = await leadAssignmentRuleStore.save(item.id, item);
  if (response)
  {
    removeItemAlreadyEdited(item, true);
  }
}
</script>
