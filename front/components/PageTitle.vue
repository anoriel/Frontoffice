<template>
  <div class="row col">
    <h1>
      <FlagIcon v-if="router.currentRoute.value.meta && router.currentRoute.value.meta.flag"
        :code="router.currentRoute.value.meta && router.currentRoute.value.meta.flag" />
      <v-icon v-if="router.currentRoute.value.meta && router.currentRoute.value.meta.icon">
        {{ router.currentRoute.value.meta.icon }}
      </v-icon>
      {{ $helpers.capitalizeFirstLetter($t(router.currentRoute.value.name)) }}
    </h1>
  </div>
</template>

<script setup>
import FlagIcon from 'vue3-flag-icons'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
