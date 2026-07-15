import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Accept-Language': 'en',
  },
})

export default axiosInstance
