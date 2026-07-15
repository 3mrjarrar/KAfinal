import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || 'https://knowledgeshop.runasp.net/api'

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Accept-Language': 'en',
  },
})

export default axiosInstance
