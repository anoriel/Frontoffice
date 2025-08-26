import axios, { type AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
export default axiosInstance
