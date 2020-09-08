// api/index.js

import axios from 'axios'

let host = window.location.hostname
if (host.includes('127') || host.includes('local')) {
  host = 'http://127.0.0.1:5000'
} else {
  host = 'https://vocab-lms.herokuapp.com'
}

export function register (userData) {
  return axios.post(host + '/api/register', userData)
}

export function authenticate (userData) {
  return axios.post(host + '/api/login', userData)
}

export function updateRecAPI (payload) {
  return axios.post(host + '/api/updateRecord', payload)
}
export function checkFriend (payload) {
  return axios.post(host + '/api/checkFriend', payload)
}

export function updateAccount (payload) {
  // update SQL model and save image
  return axios.post(host + '/api/updateAccount', payload)
}

export function getRecordAPI (payload) {
  return axios.post(host + '/api/getRecord', payload)
}

export function addImage (payload) {
  return axios.post(host + '/api/addImage', payload)
}
