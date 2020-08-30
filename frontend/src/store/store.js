import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import { isValidJwt, parseLocal } from '@/utils'
import { openSocket } from '@/sockets'
import { authenticate, register, updateRecAPI, updateAccount } from '@/api'
import tourism from '../assets/json/master.json'
import food from '../assets/json/food.json'

let dictionaries = {
  'tourism': tourism,
  'high': null,
  'food': food
}

Vue.use(Vuex)

const state = {
  userProfile: parseLocal(localStorage.userProfile) || {},
  userRecord: parseLocal(localStorage.userRecord) || {},
  settings: parseLocal(localStorage.settings) || {},
  currentRecord: parseLocal(localStorage.currentRecord) || {},
  updateStatus: true,
  jwt: localStorage.token || '',
  master: dictionaries[parseLocal(localStorage.userProfile).vocab],
  testActive: false,
  socket: null
}

const actions = {
  // communicate with backend API
  login (context, userData) {
    // mutation action to set userData after login
    return authenticate(userData)
      .then(function (response) {
        context.commit('setJwtToken', { jwt: response.data.token, msg: response.data.msg })
        context.commit('setProfile', { userProfile: response.data.userProfile, userRecord: response.data.userRecord })
        context.commit('setMaster', { userProfile: response.data.userProfile })
        router.push('/home')
      })
      .catch(error => {
        // log and signal to app
        alert('An error has occured', error)
        console.log('Error Authenticating: ', error)
      })
  },
  register (context, userData) {
    console.log(context)
    return register(userData)
      .then(function (response) {
        alert(response.data.msg)
        if (!response.data.err) {
          router.push('/login')
        }
      })
      .catch(error => {
        console.log('Error Registering: ', error)
      })
  },
  account (context, userData) {
    console.log(context, userData)
    return updateAccount(userData)
      .then(function (response) {
        alert(response.data.msg)
        location.reload(true)
      })
      .catch(error => {
        alert('An error has occured - your account has not been updated')
        router.push('/account')
        console.log('Error Registering: ', error)
      })
  },
  updateRecord (context, answerData) {
    console.log('record', answerData)
    context.commit('setNewRecord', answerData)
  },
  logout (context) {
    console.log('logout...')
    context.commit('destroyToken')
  },
  checkLogin () {
    console.log('check login...')
    return isValidJwt(state.jwt)
  },
  testActive (context) {
    context.commit('setTestActive')
  },
  openSocket (context) {
    context.commit('setSocket')
  },
  saveData (context) {
    console.log('save data...')
    context.commit('sendRecords')
  }
}

const mutations = {
  // mutation can change the state variables
  // set token into local storage and store state
  setJwtToken (state, payload) {
    console.log('setJwtToken payload = ', payload.jwt)
    alert(payload.msg)
    localStorage.token = payload.jwt
    state.jwt = payload.jwt
  },
  setProfile (state, payload) {
    console.log('setProfile payload = ', payload)

    localStorage.setItem('userProfile', JSON.stringify(payload.userProfile))
    state.userProfile = payload.userProfile

    localStorage.setItem('userRecord', JSON.stringify(payload.userRecord))
    state.userRecord = payload.userRecord
  },
  setMaster (state, payload) {
    console.log('setMaster payload = ', payload.userProfile.vocab)
    state.master = dictionaries[payload.userProfile.vocab]
  },
  setSocket (state) {
    console.log('setSocket')
    state.socket = openSocket()
  },
  sendRecords (state) {
    updateRecAPI({userRecord: state.userRecord, jwt: state.jwt, settings: state.settings})
      .then(function (response) {
        state.settings = {}
        localStorage.settings = JSON.stringify({})
        console.log('RECORDS UPDATED', response)
      })
      .catch(error => {
        // log and signal to app
        if (state.jwt !== '') {
          alert('A recording error has occured', error)
        }
        console.log('Error Authenticating: ', error)
      })
  },
  setNewRecord (state, payload) {
    console.log('setNewEC payload = ', payload)
    // localStorage.userProfile = payload.userProfile
    for (let index in payload.answerData) {
      let mode = payload.mode
      let ans = payload.answerData[index]

      // set data in currentRecord Object
      if (!state.currentRecord[mode]) {
        Vue.set(state.currentRecord, mode, {})
      }
      if (!state.currentRecord[mode][ans.English]) {
        Vue.set(state.currentRecord[mode], ans.English, 0)
      }
      state.currentRecord[mode][ans.English] += ans.Score

      // set data in currentRecord Object
      if (!state.userRecord[mode]) {
        Vue.set(state.userRecord, mode, {})
      }
      if (!state.userRecord[mode][ans.English]) {
        Vue.set(state.userRecord[mode], ans.English, 0)
      }
      state.userRecord[mode][ans.English] += ans.Score
    }

    if (!state.settings[JSON.stringify(payload.settingsData)]) {
      Vue.set(state.settings, JSON.stringify(payload.settingsData), 1)
    } else {
      state.settings[JSON.stringify(payload.settingsData)] += 1
    }

    localStorage.setItem('settings', JSON.stringify(state.settings))
    localStorage.setItem('userRecord', JSON.stringify(state.userRecord))
    localStorage.setItem('currentRecord', JSON.stringify(state.currentRecord))
    // data is waiting to be updated
    state.updateStatus = false
  },
  destroyToken (state) {
    console.log('destroyToken')
    state.jwt = ''
    localStorage.clear()
  },
  setTestActive (state) {
    state.testActive = !state.testActive
    console.log('testActive', state.testActive)
    return true
  }
}

const getters = {
  // reusable data accessors
  isAuthenticated (state) {
    console.log(state.jwt)
    return isValidJwt(state.jwt)
  },
  isActive (state) {
    console.log('getterActive', state.testActive)
    return state.testActive
  },
  makeList (state) {
    let tableItems = []
    let dict = state.master
    for (let vocab in dict) {
      let chinese
      let chineseExt
      if (dict[vocab].defch2) {
        chinese = dict[vocab].defch1
        chineseExt = dict[vocab].defch1 + ';' + dict[vocab].defch2
      } else {
        chinese = dict[vocab].defch1
        chineseExt = dict[vocab].defch1
      }

      let transEngScore = 0
      if (!state.userRecord.transEng) {
        // pass
      } else if (state.userRecord.transEng[vocab]) {
        // console.log('trans', vocab)
        transEngScore = state.userRecord.transEng[vocab]
        if (transEngScore > 2) {
          transEngScore = 2
        } else if (transEngScore < -2) {
          transEngScore = -2
        }
      }
      let transChScore = 0
      if (!state.userRecord.transCh) {
        // pass
      } else if (state.userRecord.transCh[vocab]) {
        // console.log('trans', vocab)
        transChScore = state.userRecord.transCh[vocab]
        if (transChScore > 2) {
          transChScore = 2
        } else if (transChScore < -2) {
          transChScore = -2
        }
      }
      let spellScore = 0
      if (!state.userRecord.spell) {
        // pass
      } else if (state.userRecord.spell[vocab]) {
        spellScore = state.userRecord.spell[vocab]
        if (spellScore > 2) {
          spellScore = 2
        } else if (spellScore < -2) {
          spellScore = -2
        }
      }
      let variant = null
      let total = transEngScore + spellScore + transChScore
      if (total >= 2) {
        variant = 'safe'
      } else if (total === 1) {
        variant = 'prime'
      } else if (total === 0) {
        variant = null
      } else if (total === -1) {
        variant = 'warn'
      } else {
        variant = 'alert'
      }

      let s3
      if (state.userProfile.vocab === 'tourism') {
        s3 = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/audio_'
      } else if (state.userProfile.vocab === 'food') {
        s3 = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/foodio_'
      }

      // state.currentRecord.trans.vocab
      tableItems.push({
        English: vocab,
        Category: vocab[0].toUpperCase(),
        Chinese: chinese,
        ChineseExt: chineseExt,
        Gr: dict[vocab].gl,
        mp3en: s3 + 'en/' + vocab + '.mp3',
        mp3ch: s3 + 'ch/' + vocab + '.mp3',
        transEngScore: transEngScore,
        transChScore: transChScore,
        spellScore: spellScore,
        totalScore: total,
        _rowVariant: variant
      })
    }
    return tableItems
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

export default store
