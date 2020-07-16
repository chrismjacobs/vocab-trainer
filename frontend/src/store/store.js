import Vue from 'vue'
import Vuex from 'vuex'
import { isValidJwt, EventBus } from '@/utils'
import { authenticate, register } from '@/api'
import master from '../assets/json/PVQCmaster.json'

Vue.use(Vuex)
console.log('store')

const state = {
  user: {},
  jwt: '',
  masterPVQC: master
}

const actions = {
  // communicate with backend API
  login (context, userData) {
    // mutation action to set userData after login
    context.commit('setUserData', { userData })
    return authenticate(userData)
      .then(response => context.commit('setJwtToken', { jwt: response.data }))
      .catch(error => {
        // log and signal to app
        console.log('Error Authenticating: ', error)
        EventBus.$emit('failedAuthentication', error)
      })
  },
  register (context, userData) {
    // mutation action to set user data??
    context.commit('setUserData', { userData })
    return register(userData)
      .then(context.dispatch('login', userData))
      .catch(error => {
        console.log('Error Registering: ', error)
        EventBus.$emit('failedRegistering: ', error)
      })
  }
}

const mutations = {
  // mutation can change the state variables
  setUserData (state, payload) {
    console.log('setUserData payload = ', payload)
    state.userData = payload.userData
  },
  // set token into local storage and store state
  setJwtToken (state, payload) {
    console.log('setJwtToken payload = ', payload)
    alert(payload.jwt.msg)
    localStorage.token = payload.jwt.token
    console.log(state.jwt)
    state.jwt = payload.jwt.token
    console.log(state.jwt)
  }
}

const getters = {
  // reusable data accessors
  isAuthenticated (state) {
    console.log(state.jwt)
    return isValidJwt(state.jwt)
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

export default store
