<template>
  <div class="text-no-wrap">
    {{ contact.stringValue }}

    <v-tooltip v-if="contact.contactDeb" :text="$helpers.capitalizeFirstLetter($t('contactDEG'))" location="bottom">
      <template v-slot:activator="{ props }">
        <v-chip v-bind="props" variant="elevated" size="x-small" density="compact" color="primary" class="ml-1">
          {{ $t('abbreviation.DEG') }}
        </v-chip>
      </template>
    </v-tooltip>
    <v-tooltip v-if="contact.contactFiscal" :text="$helpers.capitalizeFirstLetter($t('contactFiscal'))"
      location="bottom">
      <template v-slot:activator="{ props }">
        <v-chip v-bind="props" variant="elevated" size="x-small" density="compact" color="primary" class="ml-1">
          {{ $t('abbreviation.fiscal') }}
        </v-chip>
      </template>
    </v-tooltip>
    <v-tooltip v-if="contact.contactFacture" :text="$helpers.capitalizeFirstLetter($t('contactInvoicing'))"
      location="bottom">
      <template v-slot:activator="{ props }">
        <v-chip v-bind="props" variant="elevated" size="x-small" density="compact" color="primary" class="ml-1">
          {{ $t('abbreviation.invoicing') }}
        </v-chip>
      </template>
    </v-tooltip>
    <v-tooltip v-if="contact.contactAutofac" :text="$helpers.capitalizeFirstLetter($t('contactAutoInvoicing'))"
      location="bottom">
      <template v-slot:activator="{ props }">
        <v-chip v-bind="props" variant="elevated" size="x-small" density="compact" color="primary" class="ml-1">
          {{ $t('abbreviation.auto') }}
        </v-chip>
      </template>
    </v-tooltip>
    <v-tooltip v-if="contact.contactRelance" :text="$helpers.capitalizeFirstLetter($t('contactRecovery'))"
      location="bottom">
      <template v-slot:activator="{ props }">
        <v-chip v-bind="props" variant="elevated" size="x-small" density="compact" color="primary" class="ml-1">
          {{ $t('abbreviation.recovery') }}
        </v-chip>
      </template>
    </v-tooltip>

    <v-tooltip v-if="contact.keynews" :text="$helpers.capitalizeFirstLetter($t('contact.keynews'))" location="bottom">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" color="success" class="ml-1">mdi-newspaper-check</v-icon>
      </template>
    </v-tooltip>
    <v-tooltip v-if="contact.keynews === false"
      :text="$helpers.capitalizeFirstLetter($t('refuses to be') + ' ' + $t('contact.keynews'))" location="bottom">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" color="error" class="ml-1">mdi-newspaper-remove</v-icon>
      </template>
    </v-tooltip>
    <v-tooltip v-if="contact.mailingList" :text="$helpers.capitalizeFirstLetter($t('contact.mailingList'))"
      location="bottom">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" color="success" class="ml-1">mdi-email-check</v-icon>
      </template>
    </v-tooltip>
    <v-tooltip v-if="contact.mailingList === false"
      :text="$helpers.capitalizeFirstLetter($t('refuses to be') + ' ' + $t('contact.mailingList'))" location="bottom">
      <template v-slot:activator="{ props }" class="ml-1">
        <v-icon v-bind="props" color="error">mdi-email-remove</v-icon>
      </template>
    </v-tooltip>

  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { Interlocuteur } from '@/interfaces/interlocuteur';

defineProps({
  contact: {
    type: Object as PropType<Interlocuteur>,
    required: true,
  },
})
</script>
