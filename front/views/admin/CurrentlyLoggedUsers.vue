<template>
  <v-container fluid class="w-100 h-100 overflow-auto position-relative">
    <v-data-table-server :hover="true" :headers="visibleColumns" striped="even" :items="currentlyLoggedUsersList"
      :items-length="currentlyLoggedUsersList.length" density="compact" :loading-text="$t('loading')"
      :loading="userStore.isLoading" v-model:page="userStore.currentPage">
      <template v-slot:[`item.stringValue`]="{ item, value }">
        <img :src="$helpers.getGravatarURL(item.email, 24, $gravatarDefaultImage)" class="rounded-circle" />
        {{ value }}
      </template>
      <template v-slot:[`item.lastActivityAt`]="{ value }">
        {{ $helpers.formatDateTime(value) }}
      </template>


      <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination v-model="userStore.currentPage" :length="pageCount" rounded="circle"
            active-color="blue-darken-4" color="blue-darken-4"></v-pagination>
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore();
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()

const currentlyLoggedUsersList = ref([])

onMounted(async () =>
{
  currentlyLoggedUsersList.value = await userStore.getCurrentlyLoggedUsers();
})

const pageCount = computed(() =>
{
  return Math.ceil(currentlyLoggedUsersList.value.length / globalStore.perPage)
})
const visibleColumns = ref([
  { "key": "stringValue", "title": helpers.capitalizeFirstLetter(t("user")), tdClass: 'align-middle' },
  { "key": "lastActivityAt", "title": helpers.capitalizeFirstLetter(t("lastActivityAt")), tdClass: 'align-middle' }
])

</script>
