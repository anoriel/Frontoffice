// src/plugins/axios.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export default {
  install: (app) => {
    app.config.globalProperties.$axios = axiosInstance
  },
}
