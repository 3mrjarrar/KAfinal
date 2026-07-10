import axios from 'axios'
import react from 'react'

var response = axios.get('${vite_burl}/categories')

export default function Footer() {
  return <footer>Final Project</footer>
}
