<template>
  <v-dialog :model-value="showDialog" max-width="400" @after-leave="$emit('no')">
    <v-card>
      <v-img src="/images/bg-header.png" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" cover>
        <v-card-title class="text-white">
          <img src="/images/asd-group-logo-couleur-transparent-white.png" alt="ASD GROUP" title="ASD GROUP" height="48"
            style="vertical-align: middle;" class="mr-3" />
          {{ $helpers.capitalizeFirstLetter(title) }}
        </v-card-title>
      </v-img>

      <v-card-text>{{ $helpers.capitalizeFirstLetter(message) }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onNo" color="error" :prepend-icon="yesIcon">{{ noText }}</v-btn>
        <v-btn @click="onYes" color="success" :prepend-icon="noIcon">{{ yesText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  dialog: Boolean,
  title: String,
  message: String,
  yesIcon: {
    type: String,
    default: 'mdi-check'
  },
  yesText: {
    type: String,
    default: 'Yes'
  },
  noIcon: {
    type: String,
    default: 'mdi-close'
  },
  noText: {
    type: String,
    default: 'No'
  }
})

const showDialog = ref(false);

watch(() => props.dialog, (newVal) =>
{
  showDialog.value = newVal;
});

const emit = defineEmits(['yes', 'no'])

const onYes = () =>
{
  emit('yes')
}

const onNo = () =>
{
  emit('no')
}
</script>
