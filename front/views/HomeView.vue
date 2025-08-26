<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ $helpers.capitalizeFirstLetter($t('only a manager can modify this field')) }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="getLongRequest" :disabled="btnDisabled">getLongRequest {{ count }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useSecurityStore } from '@/stores/security'
import { ref } from 'vue';

const securityStore = useSecurityStore()

const count = ref(0)
const btnDisabled = ref(false)


async function getLongRequest() {
  count.value++
  btnDisabled.value = true
  await securityStore.getLongRequest()
  btnDisabled.value = false
}
</script>
