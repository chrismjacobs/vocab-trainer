import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import { isValidJwt, parseLocal } from '@/utils'
import { authenticate, register, updateRecAPI } from '@/api'
import tourism from '../assets/json/master.json'

let dictionaries = {
  'tourism': tourism,
  'high': null,
  'foodViet': null
}

Vue.use(Vuex)

const state = {
  userProfile: parseLocal(localStorage.userProfile) || {},
  userRecord: parseLocal(localStorage.userRecord) || {},
  settings: parseLocal(localStorage.settings) || {},
  currentRecord: parseLocal(localStorage.currentRecord) || {},
  jwt: localStorage.token || '',
  master: null,
  check: 'check'
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
  updateRecord (context, answerData) {
    console.log('record', answerData)
    context.commit('setNewRecord', answerData)
  },
  logout (context) {
    console.log('logout...')
    context.commit('destroyToken')
  },
  checkLogin (context) {
    console.log('check...')
    return isValidJwt(state.jwt)
  },
  saveData (context) {
    if (state.settings === {}) {
      console.log('No new Settings')
      return false
    } else {
      return updateRecAPI({userRecord: state.userRecord, jwt: state.jwt, settings: state.settings})
        .then(function (response) {
          context.commit('resetSettings')
          console.log('RECORD UPDATED', response, context)
        })
        .catch(error => {
          // log and signal to app
          alert('An error has occured', error)
          console.log('Error Authenticating: ', error)
        })
    }
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
    console.log('setMaster payload = ', payload)
    state.master = dictionaries[payload.vocab]
  },
  resetSettings (state) {
    state.settings = {}
    localStorage.settings = JSON.stringify({})
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
    console.log('SETTINGS', state.settings)

    localStorage.setItem('settings', JSON.stringify(state.settings))
    localStorage.setItem('userRecords', JSON.stringify(state.userRecords))
    localStorage.setItem('currentRecord', JSON.stringify(state.currentRecord))
  },
  destroyToken (state) {
    console.log('destroyToken')
    state.jwt = ''
    localStorage.clear()
  }
}

const getters = {
  // reusable data accessors
  isAuthenticated (state) {
    console.log(state.jwt)
    return isValidJwt(state.jwt)
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

      let transScore = 0
      if (!state.userRecord.trans) {
        // pass
      } else if (state.userRecord.trans[vocab]) {
        // console.log('trans', vocab)
        transScore = state.userRecord.trans[vocab]
        if (transScore > 2) {
          transScore = 2
        } else if (transScore < -2) {
          transScore = -2
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
      let total = transScore + spellScore
      if (total >= 2) {
        variant = 'success'
      } else if (total === 1) {
        variant = 'primary'
      } else if (total === 0) {
        variant = null
      } else if (total === -1) {
        variant = 'warning'
      } else {
        variant = 'danger'
      }

      // state.currentRecord.trans.vocab
      tableItems.push({
        English: vocab,
        Category: vocab[0].toUpperCase(),
        Chinese: chinese,
        ChineseExt: chineseExt,
        Gr: dict[vocab].gl,
        mp3en: dict[vocab].mp3en,
        mp3ch: dict[vocab].mp3ch,
        transScore: transScore,
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
