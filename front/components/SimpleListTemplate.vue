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
      <v-skeleton-loader v-if="!list.length" type="table-row-divider@12" />
      <v-list density="compact" v-else>
        <v-list-subheader>
          <i v-if="list.length">{{ list.length }} {{ $t("record",
            list.length) }}</i>
          <i v-else>{{ $helpers.capitalizeFirstLetter($t("no result")) }}</i>
        </v-list-subheader>
        <v-list-item v-for="(item) in filteredList" :key="item.id"
          :value="item" color="primary" :class="{ 'disabled': item.isDeleted }">
          <template v-slot:prepend>
            <v-icon>mdi-vector-point</v-icon>
          </template>

          <v-list-item-title @click="editItem(item)">{{ item.name }}</v-list-item-title>

          <template v-slot:append>
            <v-icon v-if="item.isDeleted" @click="undeleteItem(item)" color="success">mdi-delete-restore</v-icon>
            <v-icon v-else @click="deleteItem(item)" color="error">mdi-trash-can</v-icon>
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

<script setup lang="ts">
import { ref, shallowRef, toRef, computed, type PropType } from 'vue';

import { BaseStoreInterface } from '@/interfaces/baseStoreInterface'


const props = defineProps({
  currentItemDescription: {
    type: String,
    required: true,
  },
  currentItemsStore: {
    type: Object as PropType<BaseStoreInterface>,
    required: true,
  },
})

const list = ref([]) as any;
const showDeleted = ref(false);

const filteredList = computed(() => {
  return list.value.filter((e: any) => showDeleted.value || showDeleted.value == e.isDeleted)
})

const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => (formModel.value?.id ?? 0) > 0)

async function fetchData()
{
  if (!props.currentItemsStore.list.length) {
    await props.currentItemsStore.findAll();
  }
  list.value = props.currentItemsStore.list;
  sortList();
}
fetchData();

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

async function deleteItem(item: any)
{
  if (!item.id) {
    const index = list.value.findIndex((element: { id: number; }) => element.id === item.id)
    await props.currentItemsStore.save(item.id, item);
    list.value.splice(index, 1);
    return;
  }
  item.isDeleted = true;
  saveItem(item);
}

function editItem(item: any)
{
  formModel.value = JSON.parse(JSON.stringify(item));

  dialog.value = true
}

async function saveItem(item: any)
{
  let savedItem = await props.currentItemsStore.save(item.id, item);
  if (item.id != null) {
    const index = list.value.findIndex((element: { id: number; }) => element.id === item.id)
    list.value[index] = savedItem
  } else {
    list.value.push(savedItem)
  }
  sortList();

  dialog.value = false
}

function sortList()
{
  list.value = list.value.sort((a: { name: String; }, b: { name: String; }) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
}

function undeleteItem(item: any)
{
  item.isDeleted = false;
  saveItem(item);
}
</script>


<style scoped>
.v-list-item.disabled .v-list-item-title {
  font-style: italic;
  text-decoration: line-through red;
}
</style>
