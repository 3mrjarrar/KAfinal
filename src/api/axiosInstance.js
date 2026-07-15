import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept-Language': 'en',
  },
})

export default axiosInstance
