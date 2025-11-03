<template>
  <v-dialog :model-value="showDialog" max-width="800" @after-leave="$emit('cancelDateTime')">
    <v-card>
      <v-img src="/images/bg-header.png" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" cover>
        <v-card-title class="text-white">
          <img src="/images/asd-group-logo-couleur-transparent-white.png" alt="ASD GROUP" title="ASD GROUP" height="48"
            style="vertical-align: middle;" class="mr-3" />
          {{ $helpers.capitalizeFirstLetter(title) }}
        </v-card-title>
      </v-img>

      <v-card-text>
        <v-row>
          <v-col>
            <v-date-picker color="primary" v-model="datePicker" />
          </v-col>
          <v-col>
            <v-time-picker color="primary" v-model="timePicker" format="24hr" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onCancel" color="error" :prepend-icon="cancelIcon">{{ $helpers.capitalizeFirstLetter(cancelText)
          }}</v-btn>
        <v-btn @click="onSave" color="success" :prepend-icon="saveIcon">{{ $helpers.capitalizeFirstLetter(saveText)
          }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import moment from "moment";

const props = defineProps({
  dialog: Boolean,
  title: String,
  modelDate: String,
  saveIcon: {
    type: String,
    default: 'mdi-content-save'
  },
  saveText: {
    type: String,
    default: 'save'
  },
  cancelIcon: {
    type: String,
    default: 'mdi-close'
  },
  cancelText: {
    type: String,
    default: 'cancel'
  }
})

const showDialog = ref(false);
const datePicker = ref(null);
const timePicker = ref(null);

watch(() => props.dialog, (newVal) =>
{
  showDialog.value = newVal;
});
watch(() => props.modelDate, (newVal) =>
{
  let theDate = props.modelDate;
  if (!theDate)
  {
    theDate = new Date().toIso();
  }
  datePicker.value = moment(new Date(props.modelDate)).format("YYYY-MM-DD");
  timePicker.value = moment(new Date(props.modelDate)).format("HH:mm");
});

const emit = defineEmits(['saveDateTime', 'cancelDateTime'])

const onSave = () =>
{
  emit('saveDateTime', moment(moment(new Date(datePicker.value)).format("YYYY-MM-DD") + ' ' + timePicker.value, "YYYY-MM-DD HH:mm").toISOString())
}

const onCancel = () =>
{
  emit('cancelDateTime')
}
</script>
