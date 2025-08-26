<template>
  <v-alert
    :text="$helpers.capitalizeFirstLetter($t(getMessage(error)))"
    :title="$helpers.capitalizeFirstLetter($t('connection error'))"
    density="compact"
    type="error"
  >
  </v-alert>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
})

function getMessage(error) {
  if (
    error &&
    error.data &&
    ['Expired JWT Token', 'JWT Token not found', 'Invalid JWT Token'].includes(error.data.message)
  ) {
    return 'expired session'
  } else if (
    error &&
    error.data &&
    ['Unable to create a signed JWT from the given configuration.'].includes(error.data.detail)
  ) {
    return 'server error, please try later'
  } else if (error && error.data && ['Invalid credentials.'].includes(error.data.message)) {
    return 'invalid credentials'
  } else if (error && 'data' in error && 'status' in error.data && error.data.status == 500) {
    return 'server error, please try later'
  } else {
    return error
  }
}
</script>
