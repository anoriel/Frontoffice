import { defineStore } from 'pinia'
import { security } from 'security'

export default defineStore('counter', () => {
  return {
    modules: {
      security: security,
    },
  }
})
