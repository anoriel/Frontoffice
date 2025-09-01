<template>
  <v-container>
    <v-row>
      <v-checkbox v-model="showDeleted" :label="$helpers.capitalizeFirstLetter($t('showDeleted'))" />
    </v-row>

    <v-row>
      <v-btn density="compact" prepend-icon="mdi-plus" :text="$helpers.capitalizeFirstLetter($t('add'))" color="primary"
        variant="elevated" @click="addItem()" />
    </v-row>
    <v-row>
      <v-list density="compact">
        <v-list-subheader>
          <i v-if="leadsRefusalReasonsList.length">{{ leadsRefusalReasonsList.length }} {{ $t("record",
            leadsRefusalReasonsList.length) }}</i>
          <i v-else>{{ $helpers.capitalizeFirstLetter($t("no result")) }}</i>
        </v-list-subheader>
        <v-list-item v-for="(item) in leadsRefusalReasonsList.filter(e => showDeleted || showDeleted == e.isDeleted)"
          :key="item.id" :value="item" color="primary" :class="{ 'disabled': item.isDeleted }">
          <template v-slot:prepend>
            <v-icon>mdi-vector-point</v-icon>
          </template>

          <v-list-item-title @click="editItem(item)">{{ item.name }}</v-list-item-title>

          <template v-slot:append>
            <v-icon v-if="item.isDeleted" @click="undeleteItem(item)">mdi-delete-restore</v-icon>
            <v-icon v-else @click="deleteItem(item)">mdi-trash-can</v-icon>
          </template>

        </v-list-item>
      </v-list>
    </v-row>


    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="$helpers.capitalizeFirstLetter($t(isEditing ? 'update' : 'add')) + ' ' + $t('a reason')">
        <template v-slot:text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="formModel.name"
                :label="$helpers.capitalizeFirstLetter($t('lead.refusalReasonsList'))"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-checkbox v-model="formModel.isDeleted" :label="$helpers.capitalizeFirstLetter($t('deleted'))" />
            </v-col>
          </v-row>
        </template>

        <v-card-actions class="bg-surface-light">
          <v-btn :text="$helpers.capitalizeFirstLetter($t('cancel'))" color="error" @click="dialog = false"></v-btn>

          <v-spacer></v-spacer>

          <v-btn :text="$helpers.capitalizeFirstLetter($t('save'))" color="success"
            @click="saveItem(formModel)"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, ref, shallowRef, toRef } from 'vue';
import { useLeadRefusalReasonStore } from '@/stores/leadRefusalReason'
const leadRefusalReasonStore = useLeadRefusalReasonStore()
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore();

const leadsRefusalReasonsList = ref([]);
const showDeleted = ref(false);

const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => formModel.value?.id > 0)

async function fetchData()
{
  if (!leadRefusalReasonStore.list.length)
  {
    await leadRefusalReasonStore.findAll();
  }
  leadsRefusalReasonsList.value = leadRefusalReasonStore.list;
}
fetchData();

sortList();

function addItem()
{
  formModel.value = createNewRecord()
  dialog.value = true
}

function createNewRecord()
{
  return {
    id: null,
    name: null,
    isDeleted: false,
  }
}

async function deleteItem(item)
{
  if (!item.id)
  {
    const index = leadsRefusalReasonsList.value.findIndex(refus => refus.id === item.id)
    let response = await leadRefusalReasonStore.save(item.id, item);
    leadsRefusalReasonsList.value.splice(index, 1);
    isEditing.value = false;
    return;
  }
  item.isDeleted = true;
  saveItem(item);
}

function editItem(item)
{
  formModel.value = JSON.parse(JSON.stringify(item));

  dialog.value = true
}

async function saveItem(item)
{
  console.log((item.id, item));
  let savedItem = await leadRefusalReasonStore.save(item.id, item);
  if (item.id != null)
  {
    const index = leadsRefusalReasonsList.value.findIndex(element => element.id === savedItem.id)
    leadsRefusalReasonsList.value[index] = savedItem
  } else
  {
    leadsRefusalReasonsList.value.push(formModel.value)
  }
  sortList();

  dialog.value = false
}

function sortList()
{
  leadsRefusalReasonsList.value = leadsRefusalReasonsList.value.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
}

function undeleteItem(item)
{
  item.isDeleted = false;
  save(item);
}
</script>


<style scoped>
.v-list-item.disabled .v-list-item-title {
  font-style: italic;
  text-decoration: line-through red;
}
</style>
