// front/plugins/axios.ts
import axios, { type AxiosInstance } from 'axios'
import type { App } from 'vue'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export default {
  install: (app: App) => {
    app.config.globalProperties.$axios = axiosInstance
  },
}