<template>
  <span class="text-no-wrap">
    <v-icon style="vertical-align: bottom;">mdi-calendar</v-icon>
    {{ $helpers.formatDateTime(item) }}
  </span>
</template>

<script setup lang="ts">

defineProps({
  item: {
    type: Date,
    required: false,
  },
})
</script>

<style scoped></style>
