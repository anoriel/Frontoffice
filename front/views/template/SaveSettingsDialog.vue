<template>
  <v-dialog v-model="globalStore.showSettingsDialog">
    <v-form>
      <v-card :title="$helpers.capitalizeFirstLetter($t('save settings'))" prepend-icon="mdi-cloud-upload"
        class="flex-nowrap">
        <template v-slot:text>
          <v-combobox v-model="selectedListSetting" :items="getFilteredSettingsByStorageName()" item-title="name"
            :label="$helpers.capitalizeFirstLetter($t('save name'))" clearable return-object :rules="[checkName()]"
            @update:modelValue="selectListSettings" autocomplete="off" />
          <v-switch v-model="selectedIsPublic" :label="$helpers.capitalizeFirstLetter($t('public'))" color="primary" />
        </template>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :text="$helpers.capitalizeFirstLetter($t('cancel'))" color="error"
            @click="globalStore.showSettingsDialog = false" prepend-icon="mdi-close-circle" />
          <v-btn :text="$helpers.capitalizeFirstLetter($t('save'))" color="success"
            @click="$emit('saveListSettingsToCloud', selectedListSetting, selectedIsPublic)"
            :disabled="isSaveDisabled()" prepend-icon="mdi-content-save" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });
import { useSettingsStore } from '@/stores/settings';
import { SettingInterface } from '@/interfaces/SettingInterface';
import { useSecurityStore } from '@/stores/security';
import { isObject, isString } from 'lodash';
const settingsStore = useSettingsStore()


const props = defineProps({
  localStorageName: {
    type: String,
    required: true,
  },
})

const selectedListSetting = ref<SettingInterface | String | null>(null)
const selectedIsPublic = ref(false);

function checkName()
{
  return (v: SettingInterface | String | null) =>
  {
    if (!v || (typeof v === 'string' && !v.trim().length) || (isObject(v) && 'name' in v && !v.name.trim().length)) {
      return helpers.capitalizeFirstLetter(t('please give a name'));
    }
    return true;
  };
}

function isSaveDisabled()
{
  return selectedListSetting.value == null || isString(checkName());
}

function getFilteredSettingsByStorageName()
{
  return settingsStore.getSettingsByStorageName(props.localStorageName).filter(e => e.user?.id == useSecurityStore().getId());
}

function selectListSettings()
{
  if (typeof selectedListSetting.value === 'string') {
    selectedIsPublic.value = false;
  } else if (isObject(selectedListSetting.value) && 'isPublic' in selectedListSetting.value) {
    selectedIsPublic.value = selectedListSetting.value.isPublic;
  }
}
</script>
