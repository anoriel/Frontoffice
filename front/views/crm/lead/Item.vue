<template>
  <v-container fluid class="w-100 h-100 overflow-auto position-relative">
    <v-app-bar density="compact" variant="flat">
      <v-spacer></v-spacer>
      <v-btn v-if="nbModifications && !lead.isLoading" size="x-small" class="bg-warning position-relative p-0 pr-1 mr-1"
        @click="cancelModifications()" :disabled="lead.isLoading">
        <v-icon>mdi-cancel</v-icon>
        {{ $helpers.capitalizeFirstLetter($t('cancel')) }}
      </v-btn>
      <v-badge location="top right" color="warning" :model-value="timeBeforeSave != undefined && timeBeforeSave > 0"
        :content="timeBeforeSave" class="mb-1 mt-1 mr-1"
        :class="{ 'mr-3': timeBeforeSave != undefined && timeBeforeSave > 0 }">
        <v-tooltip :disabled="formIsValid !== false" location="top" color="warning">
          <template v-slot:activator="{ props }" class="ml-1">
            <span v-bind="props">
              <v-btn size="x-small" color="success" variant="flat" @click="save()"
                :disabled="!nbModifications || formIsValid === false || lead.isLoading"
                :class="{ 'cursor-not-allowed': formIsValid === false }">
                <v-icon>mdi-content-save</v-icon>
                {{ $helpers.capitalizeFirstLetter($t('save')) }}
              </v-btn>
            </span>
          </template>
          <span>
            {{ $helpers.capitalizeFirstLetter($t('please check required fields')) }}
          </span>
        </v-tooltip>
      </v-badge>

      <v-menu v-if="lead.id" color="primary" size="x-small">
        <template v-slot:activator="{ props }" :disabled="loading">
          <v-btn v-bind="props" class="bg-secondary" color="white" size="x-small" :disabled="leadStore.isLoading">
            <v-icon>mdi-cog</v-icon>&nbsp;{{ $helpers.capitalizeFirstLetter($t('action')) }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-if="lead.id" @click="duplicateLead()" density="compact">
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
    </v-app-bar>

    <v-row>
      <v-col md="12" lg="8" class="mt-lg-2 mt-xl-0 pb-16">
        <v-sheet>
          <div>
            <div class="arrow_button_cartouche d-flex flex-row-reverse position-relative" border="primary lg">
              <button v-for="leadType, index in getVisibleTypesList()" :key="index"
                :ref="'typeList[' + leadType.name + ']'" class="arrow_button"
                :disabled="leadType.id == lead.leadType?.id" @click="changeType(leadType)">
                {{ $helpers.capitalizeFirstLetter($t('lead.' + leadType.name)) }}
              </button>
            </div>
          </div>
          <v-container fluid class="leadDiv bg-light-blue-lighten-5" :class="lead.leadType?.name" min-height="200">
            <!-- #region leadType tag -->
            <span v-if="lead.leadType?.name == 'won'" class="wonTag text-success">
              {{ $helpers.capitalizeFirstLetter($t('lead.won')) }}
            </span>
            <span v-else-if="lead.leadType?.name == 'lost'" class="lostTag text-error">
              {{ $helpers.capitalizeFirstLetter($t('lead.lost')) }}
            </span>
            <span v-else-if="lead.leadType?.name == 'spam'" class="spamTag text-warning">
              {{ $helpers.capitalizeFirstLetter($t('lead.spam')) }}
            </span>
            <!-- #endregion leadType tag -->

            <v-form v-model="formIsValid" ref="leadForm" @submit.prevent lazy-validation>
              <!-- #region lead name -->
              <v-row>
                <v-col col="10" md="9" class="pt-3 pa-0">
                  <v-text-field v-model="lead.customerName" class="leadName" variant="underlined"
                    :label="$helpers.capitalizeFirstLetter($t('lead.customerName'))"
                    :rules="[() => !!lead.customerName || $helpers.capitalizeFirstLetter($t('field required', { field: $helpers.capitalizeFirstLetter($t('lead.customerName')) }))]"
                    required autocomplete="off" density="compact" />
                </v-col>
                <v-col col="2" md="3" class="pt-3 pl-3 pa-0 d-flex align-center">
                  <v-text-field v-model="lead.createdAt" :value="$helpers.formatDate(lead.createdAt)" readonly
                    :disabled="!securityStore.hasRole('ROLE_CRM_ADMIN')" variant="underlined"
                    :label="$helpers.capitalizeFirstLetter($t('lead.createdAt'))" prepend-inner-icon="mdi-calendar"
                    required icon-color="primary" :title="$helpers.formatDateTime(lead.createdAt)" density="compact"
                    @mousedown:control="dateTimeDialog = true" style="vertical-align: middle;">
                  </v-text-field>
                </v-col>
              </v-row>
              <!-- #endregion lead name -->

              <!-- #region lastUpdatedAt -->
              <v-row class="text-right">
                <v-col class="pa-0">
                  <small>
                    <i>
                      {{ $helpers.capitalizeFirstLetter($t('lastUpdatedAt')) }}{{ $t(":") }}
                      {{ $helpers.formatDateTime(lead.lastUpdatedAt) }}
                    </i>
                  </small>
                </v-col>
              </v-row>
              <!-- #endregion lastUpdatedAt -->

              <!-- #region lead link to customer -->
              <v-row class="text-right">
                <v-col class="pa-0">
                  <div v-if="lead.customer" class="position-relative">
                    <small><i>
                        {{ $helpers.capitalizeFirstLetter($t('lead.linkedTo')) }}
                        {{ $t(':') }}
                      </i></small>
                    <a :href="getCustomerUrl()" target="_blank"
                      :class="{ 'font-italic': lead.customer.customerType?.id == 1000 }">
                      {{ lead.customer.nomSociete }}
                      <span v-if="lead.customer.customerType?.id == 1000">&nbsp;(prospect)</span>
                    </a>
                    <v-btn color="error" size="x-small" @click="lead.customer = null" style="vertical-align: middle;">
                      <v-icon class="font-size-1rem">
                        mdi-link-off
                      </v-icon>
                      {{ $helpers.capitalizeFirstLetter($t('break the link')) }}
                    </v-btn>
                  </div>
                  <div v-else class="position-relative">
                    <v-btn color="success" size="x-small"
                      :disabled="!lead.id || formIsValid === false || lead.isLoading"
                      @click="linkCustomerDialog = true">
                      <v-icon class="font-size-1rem">
                        mdi-link
                      </v-icon>
                      {{ $helpers.capitalizeFirstLetter($t('link customer')) }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <!-- #endregion lead link to customer -->

              <!-- #region refusalReasons -->
              <v-row v-if="lead.refusalReasons && lead.refusalReasons.length">
                <v-col class="pa-0 text-error bg-white">
                  <v-list density="compact">
                    <v-list-subheader class="text-error font-italic">{{
                      $helpers.capitalizeFirstLetter($t('lead.refusalReason')) }}
                      {{ $t(':') }}</v-list-subheader>

                    <v-list-item v-for="(item, index) in lead.refusalReasons" :key="index" :value="item"
                      class="text-error" disabled>
                      <template v-slot:prepend>
                        <v-icon icon="mdi-window-close"></v-icon>
                      </template>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
              <!-- #endregion refusalReasons -->

              <!-- #region Contact -->
              <v-row>
                <v-col class="pa-0 pt-3">
                  <fieldset class="fieldset bg-white mb-4 pa-2">
                    <legend class="ml-3 pl-1 pr-1">
                      <v-icon>mdi-card-account-mail</v-icon>
                      {{ $helpers.capitalizeFirstLetter($t("lead.contact")) }}
                    </legend>
                    <v-row>
                      <v-col column="3">
                        <v-text-field v-model="lead.name" :class="lead.name ? '' : 'opacity-50-for-label'"
                          density="compact" :label="$helpers.capitalizeFirstLetter($t('name'))" type="text"
                          autocomplete="off" />
                      </v-col>
                      <v-col column="3">
                        <v-text-field v-model="lead.firstname" :class="lead.firstname ? '' : 'opacity-50-for-label'"
                          density="compact" :label="$helpers.capitalizeFirstLetter($t('firstname'))" type="text"
                          autocomplete="off" />
                      </v-col>
                      <v-col column="3">
                        <v-text-field v-model="lead.email" :class="lead.email ? '' : 'opacity-50-for-label'"
                          :rules="[v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(v) || $helpers.capitalizeFirstLetter($t('e-mail must be valid'))]"
                          density="compact" :label="$helpers.capitalizeFirstLetter($t('lead.email'))" type="email"
                          autocomplete="off" />
                      </v-col>
                      <v-col column="2">
                        <v-text-field v-model="lead.tel" :class="lead.tel ? '' : 'opacity-50-for-label'"
                          :label="$helpers.capitalizeFirstLetter($t('lead.phone'))" type="text" density="compact"
                          autocomplete="off" />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col column="6">
                        <p class="text-caption">{{ $helpers.capitalizeFirstLetter($t('lead.onNewsletterList')) }}</p>
                        <v-btn-toggle v-model="lead.onNewsletterList" density="compact" border divided>
                          <v-btn v-for="(option, key) in $helpers.optionsNullTrueFalse" :key="key" :value="option.value"
                            :color="$helpers.getVariant(lead.onNewsletterList, option)">
                            {{ $helpers.capitalizeFirstLetter($t(option.text)) }}
                          </v-btn>
                        </v-btn-toggle>
                      </v-col>
                      <v-col column="6">
                        <p class="text-caption">{{ $helpers.capitalizeFirstLetter($t('lead.rgpdAccepted')) }}</p>
                        <v-btn-toggle v-model="lead.rgpdAccepted" density="compact" border divided>
                          <v-btn v-for="(option, key) in $helpers.optionsNullTrueFalse" :key="key" :value="option.value"
                            :color="$helpers.getVariant(lead.rgpdAccepted, option)">
                            {{ $helpers.capitalizeFirstLetter($t(option.text)) }}
                          </v-btn>
                        </v-btn-toggle>
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>
              <!-- #endregion Contact -->

              <!-- #region Adresse client -->
              <v-row>
                <v-col class="pa-0 pt-3">
                  <fieldset class="fieldset bg-white mb-4 pa-2">
                    <legend class="ml-3 pl-1 pr-1">
                      <v-icon>mdi-city</v-icon>
                      {{ $helpers.capitalizeFirstLetter($t("lead.customerAddress")) }}
                    </legend>
                    <v-row>
                      <v-col column="7" class="pa-5">
                        <v-row>
                          <v-col class="pa-0">
                            <v-text-field v-model="lead.address1" density="compact"
                              :label="$helpers.capitalizeFirstLetter($t('lead.address1'))" autocomplete="off" />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="pa-0">
                            <v-text-field v-model="lead.address2" density="compact"
                              :label="$helpers.capitalizeFirstLetter($t('lead.address2'))" autocomplete="off" />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col column="5" class="pa-5">
                        <v-row>
                          <v-col class="pa-0 pe-3" cols="4">
                            <v-text-field v-model="lead.zipCode" density="compact"
                              :label="$helpers.capitalizeFirstLetter($t('lead.zipCode'))" autocomplete="off" />
                          </v-col>
                          <v-col class="pa-0" cols="8">
                            <v-text-field v-model="lead.city" density="compact"
                              :label="$helpers.capitalizeFirstLetter($t('lead.city'))" autocomplete="off" />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="pa-0">
                            <select-object fieldname="lead.countryOfEstablishment" fieldObjectType="country"
                              :label="$helpers.capitalizeFirstLetter($t('lead.countryOfEstablishment'))"
                              v-model="lead.countryOfEstablishment" :multiple="false" />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>
              <!-- #endregion Adresse client -->

              <!-- #region needs -->
              <v-row>
                <v-col class="pa-0 pt-3">
                  <fieldset class="fieldset bg-white mb-4 pa-2">
                    <legend class="ml-3 pl-1 pr-1">
                      <v-icon>mdi-chat-question</v-icon>
                      {{ $helpers.capitalizeFirstLetter($t("lead.customerNeeds")) }}
                    </legend>
                    <v-row>
                      <v-col column="3">
                        <select-object fieldname="lead.businessSector" fieldObjectType="businessSector"
                          :label="$helpers.capitalizeFirstLetter($t('lead.businessSector'))"
                          v-model="lead.businessSector" :multiple="false" />
                      </v-col>
                      <v-col column="3">
                        <select-object fieldname="lead.serviceDomain" fieldObjectType="serviceDomain"
                          :label="$helpers.capitalizeFirstLetter($t('lead.serviceDomain'))" v-model="lead.serviceDomain"
                          :multiple="false" />
                      </v-col>
                      <v-col column="3">
                        <select-object fieldname="lead.serviceType" fieldObjectType="serviceType"
                          :label="$helpers.capitalizeFirstLetter($t('lead.serviceType'))" v-model="lead.serviceType"
                          :multiple="false" />
                      </v-col>
                      <v-col column="3">
                        <select-object fieldname="lead.countryOfDestination" fieldObjectType="country"
                          :label="$helpers.capitalizeFirstLetter($t('lead.countryOfDestination'))"
                          v-model="lead.countryOfDestination" :multiple="false" />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-textarea v-model="lead.needsDescription"
                          :label="$helpers.capitalizeFirstLetter($t('lead.needsDescription'))"
                          :rules="[() => !!lead.needsDescription || $helpers.capitalizeFirstLetter($t('field required', { field: $helpers.capitalizeFirstLetter($t('lead.needsDescription')) }))]"
                          required auto-grow />
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>
              <!-- #endregion needs -->

              <!-- #region société -->
              <v-row>
                <v-col class="pa-0 pt-3">
                  <fieldset class="fieldset bg-white mb-4 pa-2">
                    <legend class="ml-3 pl-1 pr-1">
                      <v-icon>mdi-badge-account-horizontal-outline</v-icon>
                      {{ $helpers.capitalizeFirstLetter($t("lead.customerIdentity")) }}
                    </legend>
                    <v-row>
                      <v-col column="6">
                        <v-text-field v-model="lead.registrationNumber" density="compact"
                          :label="$helpers.capitalizeFirstLetter($t('lead.registrationNumber'))" autocomplete="off" />
                      </v-col>
                      <v-col column="6">
                        <v-text-field v-model="lead.vatNumber" density="compact"
                          :label="$helpers.capitalizeFirstLetter($t('lead.vatNumber'))" autocomplete="off" />
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>
              <!-- #endregion société -->

              <!-- #region lead Parameters  -->
              <v-row>
                <v-col class="pa-0 pt-3">
                  <fieldset class="fieldset bg-white mb-4 pa-2">
                    <legend class="ml-3 pl-1 pr-1">
                      <v-icon>mdi-account-settings</v-icon>
                      {{ $helpers.capitalizeFirstLetter($t("lead.settings")) }}
                    </legend>
                    <v-row>
                      <v-col>
                        <v-number-input control-variant="stacked" v-model="lead.punctualExpectedIncome"
                          density="compact" prepend-inner-icon="mdi-currency-eur" :min="0"
                          :label="$helpers.capitalizeFirstLetter($t('lead.punctualExpectedIncome'))" />
                      </v-col>
                      <v-col>
                        <v-number-input control-variant="stacked" v-model="lead.monthlyExpectedIncome" density="compact"
                          prepend-inner-icon="mdi-currency-eur" :min="0"
                          :label="$helpers.capitalizeFirstLetter($t('lead.monthlyExpectedIncome'))" />
                      </v-col>
                      <v-col>
                        <v-number-input control-variant="stacked" v-model="lead.annualExpectedIncome" density="compact"
                          prepend-inner-icon="mdi-currency-eur" :min="0"
                          :label="$helpers.capitalizeFirstLetter($t('lead.annualExpectedIncome'))" />
                      </v-col>
                      <v-col>
                        <p class="text-caption" style="margin-top: -15px">{{
                          $helpers.capitalizeFirstLetter($t('priority'))
                          }}</p>
                        <v-rating hover :length="5" :size="32" v-model="lead.priority" active-color="primary"
                          density="compact" />
                      </v-col>
                      <v-col>
                        <v-date-input v-model="lead.reminderDate"
                          :label="$helpers.capitalizeFirstLetter($t('lead.reminderDate'))" clearable density="compact"
                          mode-icon="mdi-calendar-edit" />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col column="4">
                        <select-object fieldname="lead.user" fieldObjectType="user"
                          :label="$helpers.capitalizeFirstLetter($t('seller'))" v-model="lead.user" :multiple="false" />
                      </v-col>
                      <v-col column="4">
                        <select-object fieldname="lead.agency" fieldObjectType="agency"
                          :label="$helpers.capitalizeFirstLetter($t('agency'))" v-model="lead.agency"
                          :multiple="false" />
                      </v-col>
                      <v-col column="4">
                        <select-object fieldname="lead.society" fieldObjectType="society"
                          :label="$helpers.capitalizeFirstLetter($t('society'))" v-model="lead.society"
                          :multiple="false" />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <select-object fieldname="lead.origin" fieldObjectType="leadOrigin"
                          :label="$helpers.capitalizeFirstLetter($t('lead.origin'))" v-model="lead.origin"
                          prependIcon="mdi-map-marker-question" :multiple="false" />
                      </v-col>
                      <v-col v-if="securityStore.hasRole('ROLE_CRM_ADMIN')">
                        <v-text-field v-model="lead.originDescription" density="compact"
                          prepend-inner-icon="mdi-map-marker-plus"
                          :label="$helpers.capitalizeFirstLetter($t('lead.originDescription'))" autocomplete="off" />
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>
              <!-- #endregion lead Parameters -->

            </v-form>
          </v-container>
        </v-sheet>
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
                    <v-list-item-title class="text-caption" :title="getFullChangesText(item.history)">
                      <template v-if="item.history">
                        <span class="font-italic">
                          [{{ $helpers.getHourFromDate(item.history.createdAt) }}]
                        </span>
                        <span class="text-blue-darken-4">{{ $helpers.capitalizeFirstLetter($te('lead.' +
                          item.history.updatedField) ? $t('lead.' + item.history.updatedField) :
                          ($t(item.history.updatedField))) }}{{
                            $t(':')
                          }}</span>
                        <span class="activityValues">
                          <span v-if="!item.history.onlyNewValue">
                            <span :class="{ 'emptyCell': !item.history.oldValue }"
                              class="text-decoration-line-through text-error">
                              {{ item.history.oldValue ? ($te(item.history.oldValue) ? $t(item.history.oldValue) :
                                ($te('lead.' +
                                  item.history.oldValue) ? $t('lead.' + item.history.oldValue) : item.history.oldValue)) :
                                '{'
                                + $t('empty') +
                                '}'
                              }}
                            </span>
                            <span>&nbsp;->&nbsp;</span>
                          </span>
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
                        <span class="text-success">
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

  <date-time-dialog :dialog="dateTimeDialog" :model-date="lead.createdAt" :title="$t('lead.createdAt')"
    @saveDateTime="lead.createdAt = $event; dateTimeDialog = false" @cancelDateTime="dateTimeDialog = false" />


  <v-dialog v-model="linkCustomerDialog" max-width="800" @after-leave="resetModal()">
    <v-card>
      <v-img src="/images/bg-header.png" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" cover>
        <v-card-title class="text-white">
          <img src="/images/asd-group-logo-couleur-transparent-white.png" alt="ASD GROUP" title="ASD GROUP" height="48"
            style="vertical-align: middle;" class="mr-3" />
          {{ $helpers.capitalizeFirstLetter($t('link')) + ' ' + $t('customer.label') }}
        </v-card-title>
      </v-img>

      <v-card-text>

        <span class="d-flex justify-center ma-3">
          <v-btn size="small" color="success" variant="flat" @click="transformIntoProspect()"
            :class="{ 'cursor-not-allowed': formIsValid === false }">
            <v-icon>mdi-content-save</v-icon>
            {{ $helpers.capitalizeFirstLetter($t('lead.transform lead into a new prospect')) }}
          </v-btn>
        </span>

        <hr>

        <div class="text-center font-weight-bold">
          {{ $helpers.capitalizeFirstLetter($t('or')) }}
        </div>
        <hr>
        <form ref="customerSearchForm">
          <!-- #region customer -->
          <select-object fieldname="customer.label" fieldObjectType="customer"
            :label="$helpers.capitalizeFirstLetter($t('customer.existing'))" :preloadData="false" v-model="customer"
            :multiple="false" />

          <!-- #endregion customer -->
        </form>

      </v-card-text>


      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="linkCustomerDialog = false" color="error" prepend-icon="mdi-close">{{
          $helpers.capitalizeFirstLetter($t('cancel')) }}</v-btn>
        <v-tooltip :disabled="!customer" location="top" color="warning">
          <template v-slot:activator="{ props }" class="ml-1">
            <span v-bind="props">
              <v-btn color="success" variant="flat" @click="linkCustomer()" :disabled="!customer"
                prepend-icon="mdi-link" :class="{ 'cursor-not-allowed': formIsValid === false }">
                {{ $helpers.capitalizeFirstLetter($t('link')) }}
              </v-btn>
            </span>
          </template>
          <span>
            {{ $helpers.capitalizeFirstLetter($t('field required', {
              field: $helpers.capitalizeFirstLetter($t('customer.label'))
            }))
            }}
          </span>
        </v-tooltip>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import _ from "lodash";
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useLeadStore } from '@/stores/lead';
const leadStore = useLeadStore();
import { useLeadCommentStore } from '@/stores/leadComment';
const leadCommentStore = useLeadCommentStore();
import { useLeadTypeStore } from '@/stores/leadType';
const leadTypeStore = useLeadTypeStore()
import { useMediaObjectStore } from '@/stores/mediaObject';
import { useSecurityStore } from '@/stores/security';
const securityStore = useSecurityStore();
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()


import { CustomerInterface } from '@/interfaces/CustomerInterface';
import { LeadCommentInterface } from '@/interfaces/LeadCommentInterface';
import { LeadHistoryInterface } from '@/interfaces/LeadHistoryInterface';
import { LeadInterface } from '@/interfaces/LeadInterface';
import { LeadTypeInterface } from '@/interfaces/LeadTypeInterface';
import { MediaObjectInterface } from '@/interfaces/MediaObjectInterface';
import { UserInterface } from '@/interfaces/UserInterface';

import DateTimeDialog from '@/components/DateTimeDialog.vue';
import SelectObject from '@/components/searchComponents/SelectObject.vue';
import UtilisateurComponent from '@/components/UtilisateurComponent.vue';
import YesNoDialog from '@/components/YesNoDialog.vue'
import { useGlobalStore } from '@/stores/global';
import { LeadOriginDTO } from '@/models/LeadOriginDTO';


interface MergedLeadCommentLeadHistory
{
  user: UserInterface,
  createdAt: Date,
  comment?: LeadCommentInterface,
  history?: LeadHistoryInterface,
}
interface LeadActivity
{
  user: UserInterface,
  activities: MergedLeadCommentLeadHistory[]
}

const props = defineProps({
  id: {
    type: [String, Number],
    default: null
  }
});

const customer = ref<CustomerInterface | null>(null)
const formIsValid = ref(false);
const leadActivities = ref<Record<string, LeadActivity[]>>({})
const lead = ref<LeadInterface>({});
const leadForm = ref();// form for validation
const clonedLead = ref<LeadInterface>({});
const linkCustomerDialog = ref(false)
const mediaObjects = ref<File[]>([])
const newComment = ref(null);
const savingDelay = ref(3);//delay before saving in seconds
const timeBeforeSave = ref<number | undefined>(undefined)
const timeoutBeforeSave = ref<NodeJS.Timeout | undefined>(undefined)
const yesNoDialog = ref(false)
const dateTimeDialog = ref(false)

const leadTypes = ref<LeadTypeInterface[]>([]);
const watchLeadValue = ref(false);
const nbModifications = ref(0);
const modificationsList = ref<Record<string, any>>({});

watch(
  () => _.cloneDeep(lead.value),
  () =>
  {
    if (!watchLeadValue.value) {
      watchLeadValue.value = true;
      return;
    }
    getModifications();
    if (nbModifications.value > 0 && formIsValid.value !== false) {
      //need to set a tiemout as input rules verification needs a delay
      setTimeout(() =>
      {
        setTimeBeforeSave(true);
      }, 200);
    } else {
      clearCurrentTimeout();
    }
  }
)
watch(() => props.id, itemWatcher)

onMounted(async () =>
{
  if (!leadTypeStore.list.length) {
    await leadTypeStore.findAll();
  }
  leadTypes.value = leadTypeStore.list as LeadTypeInterface[]
  itemWatcher()
})

async function addComment()
{
  clearCurrentTimeout();
  watchLeadValue.value = false;
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

function cancelModifications()
{
  // watchLeadValue.value = false;
  // lead.value = _.cloneDeep(clonedLead.value);
  // getModifications();
  clearCurrentTimeout();
}

function changeType(leadType: LeadTypeInterface)
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

function clearCurrentTimeout()
{
  timeBeforeSave.value = undefined;
  if (timeoutBeforeSave.value != undefined) {
    clearTimeout(timeoutBeforeSave.value);
  }
}

function confirmDelete()
{
  // leadStore.delete(lead.value.id).then(() =>
  // {
  router.push({ name: 'lead.list' });
  // });
}

async function downloadMediaObject(mediaObject: MediaObjectInterface)
{
  useMediaObjectStore().getMediaObject(mediaObject.fileURL, mediaObject.clientOriginalName);
}

function duplicateLead()
{
  if (lead.value.id) {
    router.push({ name: "lead.page", params: { id: "new" }, query: { duplicateLead: lead.value.id } });
  }
}

function duplicateLeadRefresh()
{
  delete lead.value["@id"];
  lead.value.id = undefined;
  lead.value.needsDescription = undefined;
  lead.value.createdAt = new Date(Date.now());
  lead.value.annualExpectedIncome = undefined;
  lead.value.monthlyExpectedIncome = undefined;
  lead.value.punctualExpectedIncome = undefined;
  lead.value.incomeProbability = undefined;
  lead.value.origin = new LeadOriginDTO();
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

  deepArray.forEach((e: LeadHistoryInterface | LeadCommentInterface) =>
  {
    let h: MergedLeadCommentLeadHistory = {
      user: e.user,
      createdAt: e.createdAt,
    }
    if (e['@type'] == "LeadHistory") {
      h.history = JSON.parse(JSON.stringify(e)) as LeadHistoryInterface;
    } else if (e['@type'] == "LeadComment") {
      h.comment = JSON.parse(JSON.stringify(e)) as LeadCommentInterface;
    }
    activitiesList.push(h);
  })

  leadActivities.value = {};
  activitiesList.forEach((e: MergedLeadCommentLeadHistory) =>
  {
    let theDay: string = helpers.formatDate(e.createdAt) as string;

    if (!(theDay in leadActivities.value)) {//new day to group
      leadActivities.value[theDay] = [];
    }

    let lastActivity = leadActivities.value[theDay].slice(-1).pop();
    if (typeof lastActivity == 'undefined') {//no info for this day yet
      leadActivities.value[theDay].push({
        user: e.user,
        activities: [e]
      });
    } else {
      if (lastActivity.user?.id == e.user?.id) {//user is the same
        lastActivity.activities.push(e);
      } else {//new user
        leadActivities.value[theDay].push({
          user: e.user,
          activities: [e]
        });
      }
    }
  })


}

function getCustomerUrl()
{
  return import.meta.env.VITE_INTRANET_LEGACY_URL + '/admin/' + (lead.value.customer?.customerType?.id == 1000 ? 'prospect' : 'client') + '.php?action_suivante=affiche_modifier&id=' + lead.value.customer?.id;
}

function getFullChangesText(history: LeadHistoryInterface | undefined)
{
  if (history == undefined) {
    return
  }
  let fullText = '';

  if (!history.onlyNewValue) {
    fullText += history.oldValue + ' -> ';
  }
  fullText += history.newValue;

  return fullText
}

const fieldsToIgnore = ['leadHistories']
function getModifications()
{
  modificationsList.value = helpers.differencesBetweenObjects(clonedLead.value, lead.value);
  fieldsToIgnore.forEach((field: string) =>
  {
    if (field in modificationsList.value) {
      delete modificationsList.value[field];
    }
  })
  nbModifications.value = Object.keys(modificationsList.value).length;
}

function getVisibleTypesList()
{
  return leadTypes.value.filter(function (el) { return !el.isHidden; }).reverse();
}

async function itemWatcher()
{
  if ((props.id === null || props.id === "new") && route.query.duplicateLead === null) {
    lead.value = {
      createdAt: new Date(Date.now()),
      origin: new LeadOriginDTO(),
      rgpdAccepted: null,
      onNewsletterList: null,
    };
  } else {
    let id = (route.query.duplicateLead ?? props.id) as number;
    lead.value = await leadStore.find(id);
    if (route.query.duplicateLead != null) {
      duplicateLeadRefresh();
    }
  }
  clonedLead.value = _.cloneDeep(lead.value);
  getActivity();
  leadForm.value?.validate();
}

function linkCustomer()
{
  lead.value.customer = customer.value;
  linkCustomerDialog.value = false;
}

function resetModal()
{
  customer.value = null;
}

async function save()
{
  clearCurrentTimeout();
  watchLeadValue.value = false;
  lead.value = await leadStore.save(_.cloneDeep(lead.value)) as LeadInterface;
  if (clonedLead.value.id) {
    clonedLead.value = _.cloneDeep(lead.value);
    getActivity();
    getModifications();
  } else {
    router.push({ name: "lead.page", params: { id: lead.value.id } });
  }
}

function setTimeBeforeSave(reset = false)
{
  if (formIsValid.value === false) {
    clearCurrentTimeout();
    return;
  }
  setTimeoutBeforeSave(reset);

  if (timeBeforeSave.value != undefined && timeBeforeSave.value <= 0) {
    save();
  } else {
    timeoutBeforeSave.value = setTimeout(function ()
    {
      setTimeBeforeSave();
    }, 1000);
  }
}

function setTimeoutBeforeSave(reset = false)
{
  if (timeoutBeforeSave.value != undefined) {
    clearTimeout(timeoutBeforeSave.value);
  }

  if (timeBeforeSave.value == undefined || reset) {
    timeBeforeSave.value = savingDelay.value;
  }
  else {
    timeBeforeSave.value--;
  }
}

async function transformIntoProspect()
{
  useGlobalStore().isLoadingWithLock = true;
  setTimeout(async () =>
  {
    watchLeadValue.value = false;
    lead.value = await leadStore.transformIntoProspect(lead.value);
    clonedLead.value = _.cloneDeep(lead.value);
    linkCustomerDialog.value = false;
  }, 200);
}
</script>


<style lang="scss">
.leadName input {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, "Liberation Sans", Arial, "Odoo Unicode Support Noto", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
  font-size: 24px;
  font-weight: 500 !important;
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
  z-index: 19;
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
  z-index: 9;
}
</style>
