<template>
  <v-container fluid class="w-100 h-100 overflow-auto position-relative">
    <v-app-bar density="compact" variant="flat">
      <v-spacer></v-spacer>
      <v-menu v-if="lead.id" color="primary" size="sm">
        <template v-slot:activator="{ props }" :disabled="loading">
          <v-btn v-bind="props" class="bg-secondary" color="white" size="small" :disabled="leadStore.isLoading">
            <v-icon>mdi-cog</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('action')) }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-if="lead.leadType?.name != 'lost'" @click="duplicateLead()" density="compact">
            <v-icon class="text-primary">
              mdi-content-copy
            </v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('duplicate')) }}
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item v-if="lead.leadType?.name != 'lost'" @click="changeTypeToLost()" density="compact">
            <v-icon class="text-primary">
              mdi-thumb-down-outline
            </v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('mark as', { "status": $t('lead.lost') })) }}
          </v-list-item>
          <v-list-item v-if="lead.leadType?.name != 'spam'" @click="changeTypeByName('spam')" density="compact">
            <v-icon class="text-primary">
              mdi-alert-circle-outline
            </v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('mark as', { "status": $t('lead.spam') })) }}
          </v-list-item>
          <v-list-item v-if="securityStore.hasRole('ROLE_CRM_ADMIN')" @click="yesNoDialog = true" density="compact">
            <v-icon class="text-error">
              mdi-trash-can
            </v-icon>&nbsp;
            {{ $helpers.capitalizeFirstLetter($t('delete')) }}
          </v-list-item>
          <v-list-item v-else :title="$helpers.capitalizeFirstLetter($t('only for manager'))" disabled
            density="compact">
            <v-icon class="text-error">
              mdi-trash-can
            </v-icon>&nbsp;
            {{ $helpers.capitalizeFirstLetter($t('delete')) }}
          </v-list-item>
        </v-list>
      </v-menu>

      <v-tooltip v-else :disabled="formIsValid" location="top" color="warning">
        <template v-slot:activator="{ props }" class="ml-1">
          <span v-bind="props">
            <v-btn color="success" @click="save(true)" :disabled="!formIsValid"
              :class="{ 'cursor-not-allowed': !formIsValid }" size="small">
              <v-icon>mdi-content-save</v-icon>
              {{ $helpers.capitalizeFirstLetter($t('save')) }}
            </v-btn>
          </span>
        </template>
        <span>
          {{ $helpers.capitalizeFirstLetter($t('please check required fields')) }}
        </span>
      </v-tooltip>
    </v-app-bar>

    <v-row>
      <v-col md="12" lg="8" class="mt-lg-2 mt-xl-0 pb-16">
        <div>
          <div class="arrow_button_cartouche d-flex flex-row-reverse" border="primary lg">
            <button v-for="leadType, index in getVisibleTypesList()" :key="index"
              :ref="'typeList[' + leadType.name + ']'" class="arrow_button" :disabled="leadType.id == lead.leadType?.id"
              @click="changeType(leadType)">
              {{ $helpers.capitalizeFirstLetter($t('lead.' + leadType.name)) }}
            </button>
          </div>
        </div>
        <v-container class="leadDiv" :class="lead.leadType?.name" min-height="200">
          <span v-if="lead.leadType?.name == 'won'" class="wonTag text-success">
            {{ $helpers.capitalizeFirstLetter($t('lead.won')) }}
          </span>
          <span v-else-if="lead.leadType?.name == 'lost'" class="lostTag text-danger">
            {{ $helpers.capitalizeFirstLetter($t('lead.lost')) }}
          </span>
          <span v-else-if="lead.leadType?.name == 'spam'" class="spamTag text-warning">
            {{ $helpers.capitalizeFirstLetter($t('lead.spam')) }}
          </span>

          <v-form ref="leadForm" v-model="formIsValid" @submit.prevent>
            <div class="leadDivContent">
              <v-row class="mb-8 border-b">
                <v-col col="10" md="9" class="pt-3 pa-0">
                  <h1>
                    <v-text-field v-model="lead.customerName" class="leadName"
                      :label="$helpers.capitalizeFirstLetter($t('lead.customerName'))"
                      :rules="[() => !!lead.customerName || $helpers.capitalizeFirstLetter($t('field required', { field: $helpers.capitalizeFirstLetter($t('lead.customerName')) }))]"
                      required @keydown.enter.prevent="$event.target.blur()" density="compact" />
                  </h1>
                </v-col>
                <v-col col="2" md="3" class="pt-3 pa-0 bg-white-opacity-50">
                  <v-text-field v-if="creationDateIsLocked" :value="$helpers.formatDate(lead.createdAt)"
                    :class="lead.createdAt ? '' : 'opacity-50-for-label'"
                    :label="$helpers.capitalizeFirstLetter($t('lead.createdAt'))" prepend-icon="mdi-calendar" readonly
                    :rules="[() => !!lead.createdAt || $helpers.capitalizeFirstLetter($t('field required', { field: $helpers.capitalizeFirstLetter($t('lead.createdAt')) }))]"
                    required disabled :title="$helpers.formatDateTime(lead.createdAt)" density="compact">
                    <template v-slot:append>
                      <v-icon @click="creationDateIsLocked = !creationDateIsLocked">
                        {{ creationDateIsLocked ? 'mdi-lock' : 'mdi-lock-open-variant' }}
                      </v-icon>
                    </template>
                  </v-text-field>
                  <v-menu v-else ref="menu" v-model="showDatePicker" :close-on-content-click="false"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ props }">
                      <v-text-field :value="$helpers.formatDate(lead.createdAt)"
                        :label="$helpers.capitalizeFirstLetter($t('lead.createdAt'))" prepend-icon="mdi-calendar"
                        readonly v-bind="props"
                        :append-outer-icon="creationDateIsLocked ? 'mdi-lock' : 'mdi-lock-open-variant'"
                        @click:append-outer="creationDateIsLocked = !creationDateIsLocked" density="compact" />
                    </template>
                    <v-date-input v-model="lead.createdAt" min="2020-01-01" clearable density="compact"
                      mode-icon="mdi-calendar-edit" @input="showDatePicker = false; creationDateIsLocked = true" />
                  </v-menu>
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-container>
      </v-col>

      <v-col md="12" lg="4" class="mt-lg-2 mt-xl-0 pb-16" :class="lead.id ? '' : 'opacity-50'">
        <v-container fluid class="border pa-0 bg-light-blue-lighten-5">
          <h5 class="bg-blue-darken-4 text-center pa-1">
            <v-icon>mdi-history</v-icon>
            {{ $helpers.capitalizeFirstLetter($t('lead.activity')) }}
          </h5>
          <v-row>
            <v-col>
              <v-card class="ma-5">
                <v-card-text>
                  <v-textarea v-model="newComment" :placeholder="$helpers.capitalizeFirstLetter($t('comment'))" rows="3"
                    max-rows="6" density="compact" />
                  <v-file-input v-model="mediaObjects" multiple class="mt-3" density="compact" />
                  <div v-for="(file, index) in mediaObjects" :key="index">
                    <v-icon>mdi-file</v-icon>
                    {{ file.name }}<i>&nbsp;({{ $helpers.formatBytesArray(file.size, true) }})</i>
                  </div>
                  <v-btn color="success" :disabled="!newComment ||
                    !lead.id" @click="addComment()">
                    {{ $helpers.capitalizeFirstLetter($t('add comment')) }}
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="!Object.keys(leadActivities).length" class="text-center">
            <v-col class="mb-5">
              {{ $helpers.capitalizeFirstLetter($t('lead.no activity')) }}
              {{ newComment ? 'true' : 'false' }}
              {{ lead.id ? 'true' : 'false' }}
            </v-col>
          </v-row>
          <template v-else>
            <v-sheet v-for="(leadActivitiesList, theDay) in leadActivities" :key="theDay" class="ma-1">
              <div class="text-center border-b bg-blue-darken-3">{{ theDay }}</div>
              <div v-for="(leadActivity, index) in leadActivitiesList" :key="index" density="compact" class="pa-1">
                <UtilisateurComponent :user="leadActivity.user" class="ml-1 text-blue-darken-4" />
                <v-list density="compact" class="pa-0">
                  <v-list-item v-for="item in leadActivity.activities">
                    <v-list-item-title class="text-caption">
                      <template v-if="item.history">
                        <span>{{ $helpers.capitalizeFirstLetter($te('lead.' +
                          item.history.updatedField) ? $t('lead.' + item.history.updatedField) :
                          ($t(item.history.updatedField))) }}{{
                            $t(':')
                          }}</span>
                        <span class="activityValues">
                          <span v-if="!item.history.onlyNewValue" :class="{ 'emptyCell': !item.history.oldValue }"
                            class="text-decoration-line-through text-danger">
                            {{ item.history.oldValue ? ($te(item.history.oldValue) ? $t(item.history.oldValue) :
                              ($te('lead.' +
                                item.history.oldValue) ? $t('lead.' + item.history.oldValue) : item.history.oldValue)) : '{'
                                + $t('empty') +
                            '}'
                            }}
                          </span>
                          <span v-if="!item.history.onlyNewValue">&nbsp;->&nbsp;</span>
                          <span :class="{ 'emptyCell': !item.history.newValue }" class="text-success">
                            {{ item.history.newValue ? ($te(item.history.newValue) ? $t(item.history.newValue) :
                              ($te('lead.' +
                                item.history.newValue) ? $t('lead.' + item.history.newValue) : item.history.newValue)) : '{'
                                + $t('empty') +
                            '}'
                            }}
                          </span>
                        </span>
                      </template>
                      <template v-else-if="item.comment">
                        <span class="font-italic">
                          [{{ $helpers.getHourFromDate(item.comment.createdAt) }}]
                        </span>
                        <span class="text-blue-darken-4">
                          {{ $helpers.capitalizeFirstLetter($t('comment')) }}{{ $t(':') }}
                        </span>
                        <span class="">
                          {{ item.comment.comment }}
                        </span>
                        <span v-if="item.comment.mediaObjects.length">
                          <div v-for="mediaObject in item.comment.mediaObjects" :key="mediaObject.id">
                            <v-icon>mdi-file</v-icon>
                            <a class="cursor-pointer" @click="downloadMediaObject(mediaObject)">
                              <span>{{ mediaObject.clientOriginalName }}</span><i>&nbsp;({{
                                $helpers.formatBytesArray(mediaObject.size, true) }})</i>
                            </a>
                          </div>
                        </span>
                      </template>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </v-sheet>
          </template>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

  <yes-no-dialog ref="deleteDialog" :dialog="yesNoDialog" :title="$t('confirm deletion')"
    :message="$t('are you sure you want to delete this item?')" :yes-text="$t('delete')" :no-text="$t('cancel')"
    @yes="confirmDelete" @no="yesNoDialog = false" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore();
import { useLeadStore } from '@/stores/lead';
const leadStore = useLeadStore();
import { useLeadCommentStore } from '@/stores/leadComment';
const leadCommentStore = useLeadCommentStore();
import { useLeadTypeStore } from '@/stores/leadType';
const leadTypeStore = useLeadTypeStore()
import { useSecurityStore } from '@/stores/security';
const securityStore = useSecurityStore();
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()


import YesNoDialog from '@/components/YesNoDialog.vue'
import { Lead } from '@/interfaces/lead';
import { isNumber } from 'lodash';
import { LeadType } from '@/interfaces/leadtype';
import UtilisateurComponent from '@/components/UtilisateurComponent.vue';
import { MediaObject } from '@/interfaces/mediaobject';
import { useMediaObjectStore } from '@/stores/mediaObject';
import { Utilisateur } from '@/interfaces/utilisateur';
import { LeadComment } from '@/interfaces/leadcomment';
import { LeadHistory } from '@/interfaces/leadhistory';



interface MergedLeadCommentLeadHistory
{
  user: Utilisateur,
  createdAt: Date,
  comment?: LeadComment,
  history?: LeadHistory,
}
interface LeadActivity
{
  user: Utilisateur,
  activities: MergedLeadCommentLeadHistory[]
}

const props = defineProps({
  id: {
    type: [String, Number],
    default: null
  },
  duplicateLead: {
    type: String,
    default: null,
  }
});

const creationDateIsLocked = ref(true)
const formIsValid = ref(false);
const leadActivities = ref<Record<string, LeadActivity[]>>({})
const lead = ref<Lead>({});
const mediaObjects = ref<File[]>([])
const newComment = ref(null);
const showDatePicker = ref(false);
const yesNoDialog = ref(false)

const leadTypes = ref<LeadType[]>([]);

onMounted(async () =>
{
  if (!leadTypeStore.list.length) {
    await leadTypeStore.findAll();
  }
  leadTypes.value = leadTypeStore.list as LeadType[]
  if (props.id === null || props.id === "new") {
    lead.value = {
      createdAt: new Date(Date.now()),
      origin: { "@id": "/api/lead_origins/4", "@type": "LeadOrigin", "id": 4, "name": "ajout manuel", "isDeleted": false, "stringValue": "ajout manuel" },
    };
    if (props.duplicateLead != null) {
      duplicateLeadRefresh()
    }
  } else {
    lead.value = await leadStore.find(isNumber(props.id) ? props.id : parseInt(props.id));
  }
  getActivity();

  globalStore.isLoadingWithLock = false
})

async function addComment()
{
  let comment = {
    "comment": newComment.value,
    "lead": lead.value['@id'],
    "mediaObjects": mediaObjects.value,
  };
  let newLeadComment = await leadCommentStore.save(comment);
  newComment.value = null;
  mediaObjects.value = [];
  lead.value.leadHistories.unshift(newLeadComment);
  getActivity();
}

function changeType(leadType: LeadType)
{
  lead.value.refusalReasons = [];
  lead.value.leadType = leadType;
}

function changeTypeByName(leadTypeName: string)
{
  lead.value.leadType = leadTypes.value.find(function (el) { return el.name === leadTypeName; });
}

function changeTypeToLost()
{
  // $refs['refusalReasonsModal'].show();
  console.log("changeTypeToLost")
  //TODO: terminer la fonction marqué comme perdu
}

function confirmDelete()
{
  // leadStore.delete(lead.value.id).then(() =>
  // {
  router.push({ name: 'lead.list' });
  // });
}

async function downloadMediaObject(mediaObject: MediaObject)
{
  useMediaObjectStore().getMediaObject(mediaObject.fileURL, mediaObject.clientOriginalName);
}

function duplicateLead()
{
  router.push({ name: "lead.page", params: { id: "new", duplicateLead: JSON.stringify(lead.value) } });
}

function duplicateLeadRefresh()
{
  lead.value = JSON.parse(props.duplicateLead);
  delete lead.value["@id"];
  lead.value.id = 0;
  lead.value.needsDescription = undefined;
  lead.value.createdAt = new Date(Date.now());
  lead.value.annualExpectedIncome = undefined;
  lead.value.monthlyExpectedIncome = undefined;
  lead.value.punctualExpectedIncome = undefined;
  lead.value.incomeProbability = undefined;
  lead.value.origin = { "@id": "/api/lead_origins/4", "@type": "LeadOrigin", "id": 4, "name": "ajout manuel", "isDeleted": false, "stringValue": "ajout manuel" };
  lead.value.refusalReasons = [];
  lead.value.leadHistories = [];
  lead.value.leadComments = [];
  lead.value.leadType = undefined;
  getActivity();
}

function getActivity()
{
  let deepArray: any[] = [];

  //#region activities
  if (lead.value && lead.value.leadHistories && lead.value.leadHistories.length) {
    deepArray = [...deepArray, ...lead.value.leadHistories];
  }
  //#endregion

  //#region comments
  if (lead.value && lead.value.leadComments && lead.value.leadComments.length) {
    deepArray = [...deepArray, ...lead.value.leadComments];
  }
  //#endregion

  //sorting
  deepArray = deepArray.sort((a: { createdAt: Date }, b: { createdAt: Date }) => a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0);

  let activitiesList: MergedLeadCommentLeadHistory[] = [];

  deepArray.forEach((e: LeadHistory | LeadComment) =>
  {
    let h: MergedLeadCommentLeadHistory = {
      user: e.user,
      createdAt: e.createdAt,
    }
    if (e['@type'] == "LeadHistory") {
      h.history = JSON.parse(JSON.stringify(e)) as LeadHistory;
    } else if (e['@type'] == "LeadComment") {
      h.comment = JSON.parse(JSON.stringify(e)) as LeadComment;
    }
    activitiesList.push(h);
  })
  leadActivities.value = {};
  let currentLeadActivity: LeadActivity | null = null;//to group by user
  let theDay: string | null = null;
  let lastDay: string | null = null;

  activitiesList.forEach((e: MergedLeadCommentLeadHistory) =>
  {
    theDay = helpers.formatDate(e.createdAt) as string;
    if (theDay) {

      if (currentLeadActivity != null) {
        if (currentLeadActivity.user?.id != e.user?.id) {
          leadActivities.value[theDay].push(currentLeadActivity);
        }
        if (lastDay && lastDay != theDay) {
          leadActivities.value[lastDay].push(currentLeadActivity);
        }
      }

      if (!(theDay in leadActivities.value)) {
        leadActivities.value[theDay] = [];
        currentLeadActivity = null;
      }

      if (currentLeadActivity == null || currentLeadActivity.user?.id != e.user?.id) {
        currentLeadActivity = {
          user: e.user,
          activities: []
        }
      }

      currentLeadActivity.activities.push(e)
      lastDay = theDay
    }
  })
  if (theDay && currentLeadActivity) {
    leadActivities.value[theDay].push(currentLeadActivity);
  }

  currentLeadActivity = null;
}

function getVisibleTypesList()
{
  return leadTypes.value.filter(function (el) { return !el.isHidden; }).reverse();
}

function save(value: boolean)
{
  console.log("save :" + value);
}
</script>


<style lang="scss">
.leadName input {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, "Liberation Sans", Arial, "Odoo Unicode Support Noto", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
}
</style>

<style lang="scss" scoped>
.arrow_button {
  border-top: 1px solid rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
  font-size: 0.69rem;
  min-width: 7rem;
  padding: 0.5rem;
  padding-left: 1.1rem;
  position: relative;
  text-transform: uppercase;
  z-index: 2;
}

.arrow_button:disabled {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.arrow_button:first-child {
  border-right: 1px solid rgb(var(--v-theme-primary));
}

.arrow_button:last-child {
  border-left: 1px solid rgb(var(--v-theme-primary));
}

.arrow_button:not(:first-child):before,
.arrow_button:not(:first-child):after {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  right: -1rem;
  bottom: auto;
  border-top: 1rem solid transparent;
  border-bottom: 1rem solid transparent;
  border-right: none;
  border-left: 1rem solid white;
}

.arrow_button:disabled:not(:first-child):after {
  border-left-color: rgb(var(--v-theme-primary)) !important;
}

.arrow_button:not(:first-child):before {
  right: -1.1rem;
  border-left-color: #C9CCD2 !important;
}

.fieldset legend {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.fieldset legend i.v-icon.v-icon,
.fieldset legend .dropdown-item i.v-icon.v-icon,
.fieldset legend .b-nav-dropdown i.v-icon.v-icon,
.fieldset legend .nav-link.active i.v-icon.v-icon {
  color: white;
}

.leadDiv {
  border: 1px solid rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.07);
  color: #000;
  position: relative;
}

.leadDiv.won {
  background-color: rgba(var(--v-theme-success), .15) !important;
}

.leadDiv.lost {
  background-color: rgba(#DC3645, .15) !important;
}

.leadDiv.spam {
  background-color: rgba(#FFC10F, .15) !important;
}

.leadDiv .wonTag,
.leadDiv .spamTag,
.leadDiv .lostTag {
  position: absolute;
  top: 50%;
  transform: rotate(-30deg) scale(10);
  width: 100%;
  text-align: center;
  opacity: 0.3;
  text-transform: uppercase;
  font-weight: bolder;
  z-index: 999;
}
</style>
