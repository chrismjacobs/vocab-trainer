import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import { isValidJwt, parseLocal } from '@/utils'
import { authenticate, register, updateRecAPI, updateAccount, getRecordAPI } from '@/api'
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
  userRecord: null,
  currentRecord: parseLocal(localStorage.currentRecord) || {},
  logsRecord: null,
  dictRecord: null,
  updateStatus: true,
  jwt: localStorage.token || '',
  master: dictionaries[parseLocal(localStorage.userProfile).vocab],
  testActive: false,
  alert: 'null'
}

const actions = {
  // communicate with backend API
  login (context, userData) {
    // mutation action to set userData after login
    return authenticate(userData)
      .then(function (response) {
        context.commit('setJwtToken', { jwt: response.data.token, msg: response.data.msg })
        context.commit('setProfile', { userProfile: response.data.userProfile, userRecord: response.data.userRecord, logsRecord: response.data.logsRecord, dictRecord: response.data.dictRecord })
        context.commit('setMaster', { userProfile: response.data.userProfile })
        alert(response.data.msg)
        let pushList = {
          false: '/account',
          true: '/home'
        }
        router.push(pushList[response.data.init])
      })
      .catch(error => {
        // log and signal to app
        alert('An error has occured - please check your email and password', error)
        router.push('/home')
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
        context.commit('setAlert', {msg: response.data.msg})
        context.commit('setAccount', {dataReturn: response.data.dataReturn, newVocab: response.data.newVocab})
        console.log('new', response.data.dataReturn)
        if (response.data.newVocab) {
          alert('Your are changing your word list to ' + response.data.dataReturn['vocab'] + '. Please log in again to update')
          context.dispatch('logout')
        }
      })
      .catch(error => {
        alert('An error has occured - your account has not been updated')
        router.push('/account')
        console.log('Error Registering: ', error)
      })
  },
  updateRecord (context, payload) {
    // this.$store.dispatch('updateRecord', { mode: 'transEng', answerData: this.answerData, settingsData: this.settings })
    console.log('record', payload)
    context.commit('setNewRecord', payload)
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
  closeSocket (context) {
    context.commit('closeSocket')
  },
  saveData (context) {
    console.log('save data...')
    context.commit('sendRecords')
  },
  addFriend (context, payload) {
    console.log('friend data...')
    context.commit('setFriend', payload)
  },
  newWord (context, payload) {
    console.log('new word data...')
    context.commit('setNewWord', payload)
  },
  deleteWord (context, payload) {
    console.log('new word data...')
    context.commit('setDeleteWord', payload)
  },
  apiRecords (context, payload) {
    console.log('record request...')
    return getRecordAPI(payload)
      .then(function (response) {
        console.log(response.data)
        context.commit('setRecords', response.data)
      })
      .catch(error => {
        console.log('Error Registering: ', error)
      })
  }
}

const mutations = {
  // mutation can change the state variables
  // set token into local storage and store state
  setJwtToken (state, payload) {
    console.log('setJwtToken payload = ', payload.jwt)
    localStorage.token = payload.jwt
    state.jwt = payload.jwt
  },
  setProfile (state, payload) {
    console.log('setProfile payload = ', payload)

    localStorage.setItem('userProfile', JSON.stringify(payload.userProfile))
    state.userProfile = payload.userProfile

    state.userRecord = payload.userRecord

    state.logsRecord = payload.logsRecord

    state.dictRecord = payload.dictRecord

    localStorage.setItem('currentRecord', JSON.stringify({}))
    state.currentRecord = {}
    state.updateStatus = true
    state.testActive = false
  },
  setMaster (state, payload) {
    console.log('setMaster payload = ', payload.userProfile.vocab)
    state.master = dictionaries[payload.userProfile.vocab]
  },
  setAlert (state, payload) {
    console.log('setAlert payload = ', payload)
    state.alert = payload.msg
    // state.alert = null
  },
  setRecords (state, payload) {
    /// set records on page refresh
    // not equal to {} means the students has records already
    if (state.logsRecord !== {}) {
      state.logsRecord = payload.logsRecord
    }
    if (state.userRecord !== {}) {
      state.userRecord = payload.userRecord
    }
    if (state.dictRecord !== {}) {
      state.dictRecord = payload.dictRecord
    }
  },
  setAccount (state, payload) {
    console.log('setAccount payload = ', payload.dataReturn)
    for (let item in payload.dataReturn) {
      if (item !== 'imageData') {
        state[item] = payload.dataReturn[item]
      }
    }
    localStorage.setItem('userProfile', JSON.stringify(state.userProfile))
  },
  setNewWord (state, payload) {
    console.log('setNewWord payload = ', payload)
    state.dictRecord[payload.newWord.word] = payload.newWord.text
    state.updateStatus = false
  },
  setDeleteWord (state, payload) {
    console.log('setDeleteWord payload = ', payload)
    delete state.dictRecord[payload.word]
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
  },
  sendRecords (state) {
    let _state = state
    updateRecAPI({userRecord: state.userRecord, userID: state.userProfile.userID, logsRecord: state.logsRecord, dictRecord: state.dictRecord})
      .then(function (response) {
        _state.updateStatus = true
        // localStorage.settings = JSON.stringify({})
        localStorage.setItem('userProfile', JSON.stringify(state.userProfile))
        localStorage.setItem('currentRecord', JSON.stringify(state.currentRecord))
        console.log('RECORDS UPDATED', response)
      })
      .catch(error => {
        // log and signal to app
        if (_state.jwt !== '') {
          alert('Sorry, an updating error has occured', error)
        }
        console.log('Error Authenticating: ', error)
      })
  },
  setNewRecord (state, payload) {
    console.log('setNewEC payload = ', payload)
    let mode = payload.mode

    for (let index in payload.answerData) {
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

    if (!state.logsRecord.settings[mode]) {
      Vue.set(state.logsRecord.settings, mode)
    }

    console.log('LOGSRECORD', state.logsRecord, state.logsRecord.settings, state.logsRecord.logs)

    state.logsRecord.settings[mode] = payload.settingsData

    if (!state.logsRecord.logs.mode) {
      Vue.set(state.logsRecord.logs, mode, {words: 0, tests: 0})
    }
    console.log('logs', state.logsRecord.logs[mode])

    state.logsRecord.logs[mode]['words'] += (payload.answerData).length
    state.logsRecord.logs[mode]['tests'] += 1

    localStorage.setItem('currentRecord', JSON.stringify(state.currentRecord))
    // data is waiting to be updated
    state.updateStatus = false
  },
  setFriend (state, payload) {
    console.log(payload)
    state.logsRecord.friends.push(payload.friendData)
    state.updateStatus = false
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
  isAlert (state) {
    console.log('getterAlert', state.testActive)
    return state.alert
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

      let tested = false

      let transEngScore = 0
      if (!state.userRecord.transEng) {
        // pass
      } else if (state.userRecord.transEng[vocab]) {
        // note that this word has been tested
        tested = true
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
        // note that this word has been tested
        tested = true
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
        // note that this word has been tested
        tested = true
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
        variant = 'second'
      } else if (total === 0 && tested === true) {
        variant = 'smoke'
      } else if (total === 0 && tested === false) {
        variant = 'null'
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
        _rowVariant: variant,
        tested: tested
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
