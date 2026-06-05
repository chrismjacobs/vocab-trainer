// src/api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ---- Timing interceptor (no optional chaining)
api.interceptors.request.use(function (cfg) {
  cfg._t0 = performance.now()
  return cfg
})
api.interceptors.response.use(
  function (res) {
    console.log(
      res.config.url,
      Math.round(performance.now() - res.config._t0),
      'ms'
    )
    return res
  },
  function (err) {
    var cfg = err.config || {}
    var elapsed = performance.now() - (cfg._t0 || performance.now())
    console.warn(cfg.url, 'failed', Math.round(elapsed), 'ms')
    throw err
  }
)

// ---- API wrappers
export function register (data)        { return api.post('/register', data) }
export function authenticate (data)    { return api.post('/login', data) }
export function ticket (data)          { return api.post('/ticket', data) }
export function updateRecAPI (p)       { return api.post('/updateRecord', p) }
export function addAudio (p)           { return api.post('/addAudio', p) }
export function addImage (p)           { return api.post('/addImage', p) }
export function checkFriend (p)        { return api.post('/checkFriend', p) }
export function deleteFriend (p)       { return api.post('/deleteFriend', p) }
export function updateAccount (p)      { return api.post('/updateAccount', p) }
export function getRecordAPI (p)       { return api.post('/getRecord', p) }
export function getClass (p)           { return api.post('/getClass', p) }
export function getGroups (p)          { return api.post('/getGroups', p) }
export function requestToken (p)       { return api.post('/requestToken', p) }
export function changePassword (p)     { return api.post('/changePassword', p) }
export function instructorRedis (p)    { return api.post('/instructorRedis', p) }
export function classCodes (p)         { return api.post('/classCodes', p) }

