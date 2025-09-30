<script setup lang="ts">
import type { CountryCode } from '@/types/CountryCode'

const props = defineProps<{
  code: CountryCode
  size?: string | number
  square?: boolean
  circle?: boolean
  title?: string | ((country: string) => string)
}>()

const country: string =
  new Intl.DisplayNames(['en'], { type: 'region' }).of(props.code.slice(0, 2).toUpperCase()) || 'Unknown'
const computedTitle: string =
  props.title instanceof Function ? props.title(country) : props.title || country
</script>

<template>
  <span class="fi" :class="[props.square || props.circle ? 'fis' : '', `fi-${props.code.toLowerCase()}`, props.circle ? 'round' : '']"
    :style="props.size ? `font-size:${props.size}px` : undefined" :title="computedTitle" />
</template>

<style scoped>
@import 'flag-icons/css/flag-icons.min.css';

.round {
  border-radius: 50%;
}
</style>
