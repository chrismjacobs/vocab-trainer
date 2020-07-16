// api/index.js

import axios from 'axios'

let host = window.location.hostname
if (host.includes('127') || host.includes('local')) {
  host = 'http://127.0.0.1:5000'
}

export function register (userData) {
  return axios.post(host + '/api/register', userData)
}

export function authenticate (userData) {
  return axios.post(host + '/api/login', userData)
}
