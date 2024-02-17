// api/index.js

import axios from 'axios'

let host = window.location.hostname
if (host.includes('127') || host.includes('local')) {
  host = 'http://127.0.0.1:5000'
} else {
  host = 'https://' + host + '/'
}

export function register (userData) {
  return axios.post(host + '/api/register', userData)
}

export function authenticate (userData) {
  return axios.post(host + '/api/login', userData)
}
export function ticket (userData) {
  return axios.post(host + '/api/ticket', userData)
}

export function updateRecAPI (payload) {
  return axios.post(host + '/api/updateRecord', payload)
}

export function addAudio (payload) {
  return axios.post(host + '/api/addAudio', payload)
}
export function checkFriend (payload) {
  return axios.post(host + '/api/checkFriend', payload)
}

export function deleteFriend (payload) {
  return axios.post(host + '/api/deleteFriend', payload)
}

export function updateAccount (payload) {
  // update SQL model and save image
  return axios.post(host + '/api/updateAccount', payload)
}

export function getRecordAPI (payload) {
  return axios.post(host + '/api/getRecord', payload)
}

export function getClass (payload) {
  return axios.post(host + '/api/getClass', payload)
}

export function getGroups (payload) {
  return axios.post(host + '/api/getGroups', payload)
}

export function addImage (payload) {
  return axios.post(host + '/api/addImage', payload)
}

export function requestToken (payload) {
  return axios.post(host + '/api/requestToken', payload)
}

export function changePassword (payload) {
  return axios.post(host + '/api/changePassword', payload)
}

export function instructorRedis (payload) {
  return axios.post(host + '/api/instructorRedis', payload)
}

export function classCodes (payload) {
  return axios.post(host + '/api/classCodes', payload)
}
