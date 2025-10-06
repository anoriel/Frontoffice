<template>
  <span :class="{ 'font-italic opacity-50': !user.actif }" class="text-no-wrap">
    <img v-if="user.email" :src="$helpers.getGravatarURL(user.email, iconSize, $gravatarDefaultImage)"
      style="vertical-align: bottom;" class="rounded-circle" />
    {{ user.stringValue }}
  </span>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { Utilisateur } from '@/interfaces/utilisateur';

defineProps({
  user: {
    type: Object as PropType<Utilisateur>,
    required: true,
  },
  iconSize: {
    type: Number,
    required: false,
    default: 24
  },
})
</script>

<style scoped></style>
