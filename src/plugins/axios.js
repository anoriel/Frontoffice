// src/plugins/axios.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API base URL
})

export default {
  install: (app) => {
    app.config.globalProperties.$axios = axiosInstance
  },
}
