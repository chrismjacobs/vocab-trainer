// api/index.js

import axios from 'axios'

let host = window.location.hostname
if (host.includes('127') || host.includes('local')) {
  host = 'http://127.0.0.1:5000'
} else {
  host = 'https://vocab-lms.herokuapp.com'
}

export function register (userData) {
  console.log('register_test', host)
  return axios.post(host + '/api/register', userData)
}

export function authenticate (userData) {
  console.log('login', host)
  return axios.post(host + '/api/login', userData)
}

export function updateRecAPI (payload) {
  console.log('update', host)
  return axios.post(host + '/api/updateRecord', payload)
}

export function updateAccount (payload) {
  // update SQL model and save image
  console.log('account', host)
  console.log(payload)
  return axios.post(host + '/api/updateAccount', payload)
}
