<template>
  <v-dialog :model-value="dialog" max-width="400">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onNo">No</v-btn>
        <v-btn @click="onYes" color="primary">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  dialog: Boolean,
  title: String,
  message: String
})

const emit = defineEmits(['yes', 'no'])

const onYes = () => {
  emit('yes')
}

const onNo = () => {
  emit('no')
}
</script>