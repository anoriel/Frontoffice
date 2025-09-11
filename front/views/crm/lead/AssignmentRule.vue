<template>
  <v-main>
    <v-row class="flex-row-reverse position-fixed right-0 mt-0 mr-2" style="z-index: 9;">
      <v-badge location="top right" color="error" v-if="timeBeforeSave != null" :content="timeBeforeSave">
        <v-btn :disabled="!originItems.length || !assignmentRulesListAreValid()" color="success" @click="save()"
          class="ml-1">
          <v-icon class="mr-1">mdi-content-save</v-icon>
          {{ $helpers.capitalizeFirstLetter($t('save')) }}
        </v-btn>
      </v-badge>
      <v-btn v-else :disabled="!originItems.length || !assignmentRulesListAreValid()" color="success" @click="save()"
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

    <v-row v-if="editedItem.length">
      <span class="mr-1" v-for="item in editedItem" :key="item.id">{{ item.id }}</span>
    </v-row>

    <v-dialog max-width="600" v-model="yesNoDialog">
      <v-card :title="$helpers.capitalizeFirstLetter($t('are you sure you want to delete this line?'))">
        <v-card-actions class="bg-surface-light">
          <v-btn :text="$helpers.capitalizeFirstLetter($t('no'))" color="error" @click="removeRowCancelled()" />
          <v-spacer></v-spacer>
          <v-btn :text="$helpers.capitalizeFirstLetter($t('yes'))" color="success" @click="removeRowConfirmed()" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="500">
      <v-card :title="$helpers.capitalizeFirstLetter($t('modify data'))">
        <v-card-text>
          <v-autocomplete v-model="currentEditedItem.user" :items="userStore.filteredList" :item-title="getUserName"
            :label="$helpers.capitalizeFirstLetter($t('lead.user'))"
            :placeholder="$helpers.capitalizeFirstLetter($t('lead.user'))" return-object auto-focus clearable
            auto-select-first>
            <template v-slot:selection="{ item }">
              <v-list-item :prepend-avatar="$helpers.getGravatarURL(item.raw.email, 40, $gravatarDefaultImage)"
                :title="item.raw.prenom + ' ' + item.raw.nom"></v-list-item>
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props"
                :prepend-avatar="$helpers.getGravatarURL(item.raw.email, 40, $gravatarDefaultImage)"
                :title="item.raw.prenom + ' ' + item.raw.nom"></v-list-item>
            </template>
          </v-autocomplete>

          <v-row v-for="(key, i) in Object.keys(currentEditedItem.rules)" :key="currentEditedItem.id + '-' + key"
            :class="{ 'mt-1': i }">
            <v-col cols="1" class="align-center d-flex">
              <v-btn variant="outlined" color="error" size="x-small" @click="deleteRuleFilter(key)">
                <v-icon>
                  mdi-trash-can-outline
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="11">
              <v-autocomplete v-model="currentEditedItem.rules[key]" :items="getItemsList(key)"
                :label="$helpers.capitalizeFirstLetter($te('lead.' + key) ? $t('lead.' + key) : $t(key))"
                :item-title="['countryOfEstablishment', 'countryOfDestination'].includes(key) ? 'nom' : 'name'"
                item-value="id" multiple chips closable-chips clearable>
                <template v-slot:chip="{ props, item }">
                  <v-chip v-bind="props" v-if="['countryOfEstablishment', 'countryOfDestination'].includes(key)">
                    <country-component :country="item.raw" />
                  </v-chip>
                  <v-chip v-else color="success">{{ item.raw.stringValue }}</v-chip>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" subtitle="" title="">
                    <v-list-item-title>
                      <country-component v-if="['countryOfEstablishment', 'countryOfDestination'].includes(key)"
                        :country="item.raw" />
                      <v-chip v-else color="success">{{ item.raw.stringValue }}</v-chip>
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <small v-if="!currentEditedItem.rules[key].length" class="text-danger">
                {{ $helpers.capitalizeFirstLetter($t('field required', {
                  field: $helpers.capitalizeFirstLetter($te('lead.' + key) ?
                    $t('lead.' +
                      key) : $t(key))
                })) }}
              </small>
            </v-col>
          </v-row>

          <v-row v-if="!Object.keys(currentEditedItem.rules).length" class="bg-error">
            <v-alert color="error" density="compact" class="">{{ $helpers.capitalizeFirstLetter($t('please add filter'))
              }}</v-alert>
          </v-row>

          <v-row v-if="Object.keys(currentEditedItem.rules).length != ruleFilters.length">
            <v-col offset="2">
              <v-btn color="info" @click="displayAddRuleFilterModal()" rounded>
                <v-icon>mdi-flask-plus-outline</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('add filter')) }}
              </v-btn>
            </v-col>
          </v-row>

        </v-card-text>

        <v-card-actions>
          <v-btn :text="$helpers.capitalizeFirstLetter($t('cancel'))" color="error" @click="editItemCancelled()" />
          <v-spacer></v-spacer>
          <v-btn :text="$helpers.capitalizeFirstLetter($t('save'))" color="success" @click="editItemConfirmed()"
            :disabled="!Object.keys(currentEditedItem.rules).length" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addFilterDialog" max-width="600">
      <v-card :title="$helpers.capitalizeFirstLetter($t('add filter'))">
        <v-form :label="$helpers.capitalizeFirstLetter($t('select filter to add'))" label-for="selectFilterInput">
          <v-select id="selectFilterInput" v-model="selectedFilter" name="selectFilterInput" :items="getRuleFilters()"
            required item-title="value" item-value="key">
          </v-select>
        </v-form>

        <v-card-actions class="bg-surface-light">
          <v-btn :text="$helpers.capitalizeFirstLetter($t('cancel'))" color="error" @click="cancelFilter"></v-btn>
          <v-spacer></v-spacer>
          <v-btn :text="$helpers.capitalizeFirstLetter($t('add'))" color="success" @click="addFilter"
            :disabled="!selectedFilter"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-skeleton-loader v-if="!dataAreFetched" type="table-row-divider@12" />
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

        <template v-slot:[`item.user`]="{ item }">
          <v-container>
            <v-card class="w-100 pb-1">
              <v-list-item :prepend-avatar="$helpers.getGravatarURL(item.user.email, 40, $gravatarDefaultImage)"
                :title="item.user.prenom + ' ' + item.user.nom"></v-list-item>
            </v-card>
          </v-container>
        </template>

        <template v-slot:[`item.rules`]="{ item, value }">
          <v-container>
            <v-row v-for="(key, i) in Object.keys(value)" :key="item.id + '-' + key" align="center"
              :class="{ 'mt-5': i > 0 }">
              <v-container>
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
              </v-container>
            </v-row>
          </v-container>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="text-info" @click="editItem(item)">mdi-pencil-circle</v-icon>
          <v-icon class="text-info" @click="removeRow(item)">mdi-delete-circle</v-icon>
        </template>

      </v-data-table>
    </v-row>


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
import { update } from 'lodash';

const addFilterDialog = ref(false)
const assignmentRulesList = ref([])
const confirmEdit = ref(null)
const currentEditedItem = ref(null)
const currentEditedProperty = ref(null)
const dataAreFetched = ref(false)
const editDialog = ref(false)
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
onMounted(async () =>
{
  if (visibleColumns.value[0]['key'] != 'id' && securityStore.hasRole("ROLE_SUPER_ADMIN"))
  {
    visibleColumns.value.unshift({ "key": "id", "title": "id" });
  }

  if (!businessSectorStore.listLength)
  {
    await businessSectorStore.findAll();
  }
  if (!countryStore.listLength)
  {
    await countryStore.findAll();
  }
  if (!serviceTypeStore.listLength)
  {
    await serviceTypeStore.findAll();
  }
  if (!userStore.filteredListLength)
  {
    await userStore.findByRole('CRM');
  }
  if (!serviceDomainStore.listLength)
  {
    await serviceDomainStore.findAll();
  }

  await fetchData();
})

function closeInput(e) { e.srcElement.blur(); }


async function fetchData()
{
  await leadAssignmentRuleStore.findAll();

  assignmentRulesList.value = leadAssignmentRuleStore.list;
  sortList();
  dataAreFetched.value = true;
}

function addFilter()
{
  currentEditedItem.value.rules[selectedFilter.value] = [];
  selectedFilter.value = null;
  addFilterDialog.value = false;
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

function assignmentRulesListAreValid()
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
  selectedFilter.value = null;
  addFilterDialog.value = false;
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

function deleteRuleFilter(key)
{
  delete currentEditedItem.value.rules[key]
}

function editItem(item)
{
  stopTimeBeforeSave();
  editDialog.value = true;

  currentEditedItem.value = JSON.parse(JSON.stringify(item))
}

function editItemCancelled()
{
  editDialog.value = false;
}

async function editItemConfirmed()
{
  await updated(currentEditedItem.value);
  editItemCancelled()
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
  let item = store.list.find(e => e.id == value);
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
  let list = ruleFilters.value;
  if (currentEditedItem.value)
  {
    list = list.filter(el => !Object.keys(currentEditedItem.value.rules).includes(el.key));
  }
  return list;
}

function getUserName(e)
{
  let returnValue = '< ' + t('not assigned').toUpperCase() + ' >';

  if (e.id == 0)
  {
    returnValue = '< ' + t('anyone').toUpperCase() + ' >';
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
    fetchData();
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
  if (!assignmentRulesListAreValid())
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

function displayAddRuleFilterModal()
{
  addFilterDialog.value = true;
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
  if (reset)
  {
    let priority = 1;
    for (let i in assignmentRulesList.value)
    {
      let item = assignmentRulesList.value[i];
      if (item.priority != priority)
      {
        item.priority = priority;
        addItemToEditedItemsList(item);
      }
      priority++;
    }
  } else
  {
    assignmentRulesList.value = assignmentRulesList.value.sort((a, b) => a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0);
  }
}

async function updated(item)
{

  let response = await leadAssignmentRuleStore.save(item.id, item);
  if (response)
  {
    let index = assignmentRulesList.value.findIndex((element) => element.id === item.id)
    if (index > -1)
    {
      assignmentRulesList.value[index] = item;
    }

    removeItemAlreadyEdited(item, true);
  }
}
</script>
