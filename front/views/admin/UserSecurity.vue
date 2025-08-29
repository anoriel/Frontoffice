<template>
  <v-container>
    <h1>
      <FlagIcon v-if="router.currentRoute.value.meta && router.currentRoute.value.meta.flag"
        :code="router.currentRoute.value.meta.flag" />
      <v-icon v-if="router.currentRoute.value.meta && router.currentRoute.value.meta.icon">
        {{ router.currentRoute.value.meta.icon }}
      </v-icon>
      {{ $helpers.capitalizeFirstLetter($t(router.currentRoute.value.name)) }}
    </h1>
    <v-row>
      <v-col>
        <v-text-field v-model="userFilter" :label="$helpers.capitalizeFirstLetter($t('userFilter'))"
          prepend-icon="mdi-magnify" clearable />
      </v-col>
      <v-col>
        <v-checkbox v-model="showInactiveUsers" :label="$helpers.capitalizeFirstLetter($t('admin.showInactiveUsers'))"
          class="d-inline-block" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-data-table :hover="true" :headers="visibleColumns" striped="even" density="compact"
          :loading-text="$t('loading')" :loading="userStore.isLoading" :row-props="rowProps" :search="userFilter"
          :custom-filter="customFilter" :items="filteredList" @click:row="selectUser">
          <template v-slot:[`item.stringValue`]="{ item, value }">
            <span :class="{ 'font-italic': !item.actif }">
              <UserCircle :nom="item.nom" :prenom="item.prenom" />
              {{ value }}
            </span>
          </template>
          <template v-slot:[`item.lastActivityAt`]="{ item, value }">
            {{ $helpers.formatDateTime(value) }}&nbsp;
            <v-icon v-if="item.selected" class="position-absolute right-0">mdi-menu-right</v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="6">
        <v-card v-if="activeItem">
          <v-card-title>{{ activeItem.stringValue }}</v-card-title>
          <v-checkbox v-model="activeItem.actif" :label="$helpers.capitalizeFirstLetter($t('active'))"
            class="d-inline-block" @change="updated" />
          <v-autocomplete v-model="activeItem.roles" :items="securityStore.roles"
            :label="$helpers.capitalizeFirstLetter($t('roles'))" return-object multiple chips closable-chips clearable
            item-color="success" @update:modelValue="updated">
            <template #selection="{ item }">
              <v-chip color="green">
                {{ item }}
              </v-chip>
            </template>
          </v-autocomplete>
          <v-btn block color="primary" @click="impersonate()">
            <v-icon>mdi-login</v-icon>
            {{ $helpers.capitalizeFirstLetter($t('impersonate user')) }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import UserCircle from '@/components/UserCircle.vue';
import FlagIcon from 'vue3-flag-icons'
import { useGlobalStore } from '@/stores/global'
const globalStore = useGlobalStore()
import { useSecurityStore } from '@/stores/security'
const securityStore = useSecurityStore()
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
import { useRouter } from 'vue-router'
import { isString } from 'lodash';
const router = useRouter()
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()

const activeItem = ref(null)
const showInactiveUsers = ref(true)
const userFilter = ref(null)
const filteredList = ref([])

watch(showInactiveUsers, async (newValue, oldValue) =>
{
  let list = JSON.parse(JSON.stringify(userStore.list));
  if (newValue === false)
  {
    list = list.filter(e => e.actif);
  }
  filteredList.value = list
})

const visibleColumns = ref([
  { "key": "stringValue", "title": helpers.capitalizeFirstLetter(t("user")), tdClass: 'align-middle' },
  { "key": "lastActivityAt", "title": helpers.capitalizeFirstLetter(t("lastActivityAt")), tdClass: 'align-middle' }
])



const pageCount = computed(() =>
{
  return Math.ceil(getUsersList.length / globalStore.perPage)
})

function customFilter(value, query, item)
{
  if (!showInactiveUsers.value && !item.raw.actif)
  {
    return false
  }
  return value != null && query != null && typeof value === 'string' && value.toLowerCase().indexOf(query.toLowerCase()) !== -1
}


async function getUsersList()
{
  await userStore.findAll()
  let list = JSON.parse(JSON.stringify(userStore.list));
  if (!showInactiveUsers.value)
  {
    list = list.filter(e => e.actif);
  }
  if (userFilter.value != null && isString(userFilter.value))
  {
    list = list.filter(e => `${e.nom} ${e.prenom}`.toLowerCase().indexOf(userFilter.value.toLowerCase()) >= 0);
  }
  filteredList.value = list
}
getUsersList()

function getUserName(e)
{
  if (e && e.nom && e.prenom)
    return e.nom + ", " + e.prenom;
  return "";
}


function disabledRowStyle(item)
{
  let classNames = [];
  if (!item?.actif)//disable item so opacity
  {
    classNames.push("opacity-50");
  }
  if (item?.id == activeItem?.value?.id)//item is selected so background color
  {
    classNames.push("selectedItem bg-blue-darken-4");
  }
  return classNames.join(" ");
}
function rowProps({ item })
{
  return {
    class: disabledRowStyle(item),
  };
}

function impersonate()
{
  securityStore.switchUser(activeItem.value);
  $store.dispatch("crmListSettings/reset", activeItem.value);
  router.push({ path: "/" });
}

function selectUser(click, row)
{
  //hide previously selected row icon
  let foundItemInFilteredList = filteredList.value.find(e => e.id == activeItem?.value?.id);
  let index = filteredList.value.indexOf(foundItemInFilteredList);
  if (index > -1)
  {
    filteredList.value[index].selected = false;
  }

  let item = row.item

  if (activeItem.value && activeItem.value.id == item.id)
  {
    activeItem.value = null;
  }
  else
  {
    activeItem.value = JSON.parse(JSON.stringify(item));
    activeItem.value.roles = JSON.parse(activeItem.value.rolesJson).roles;

    foundItemInFilteredList = filteredList.value.find(e => e.id == item.id);
    index = filteredList.value.indexOf(foundItemInFilteredList);
    if (index > -1)
    {
      filteredList.value[index].selected = true;
    }
  }
}

async function updated()
{
  let foundItemInFilteredList = filteredList.value.find(e => e.id == activeItem.value.id);
  let index = filteredList.value.indexOf(foundItemInFilteredList);
  activeItem.value.rolesJson = JSON.stringify({
    'roles': activeItem.value.roles
  });
  globalStore.setIsBackgroundLoading(true)
  let request = await userStore.save(activeItem.value.id, activeItem.value);
  filteredList.value[index] = request;
  globalStore.setIsBackgroundLoading(false);
}
</script>

<style scoped>
.v-data-table__tr::after {
  font-family: 'Material Design Icons';
  content: "\f062";
  -webkit-font-feature-settings: 'liga';
  font-feature-settings: 'liga';
}
</style>
