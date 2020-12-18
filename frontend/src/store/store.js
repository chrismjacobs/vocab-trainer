import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import { isValidJwt, parseLocal, checkDevice } from '@/utils'
import { authenticate, register, updateRecAPI, updateAccount, getRecordAPI, ticket, getClass, addAudio } from '@/api'
import tourism1 from '../assets/json/tourism1.json'
import tourism from '../assets/json/tourism.json'
import digital1 from '../assets/json/digital1.json'
import culinary1 from '../assets/json/culinary1.json'
import culinary2 from '../assets/json/culinary2.json'
import generalY from '../assets/json/generalY.json'
import generalW from '../assets/json/generalW.json'
import generalD from '../assets/json/generalD.json'
import generalV from '../assets/json/generalV.json'
import generalT from '../assets/json/generalT.json'
import generalG from '../assets/json/generalG.json'
import food from '../assets/json/food.json'
// import vqc from '../assets/json/vqc2.json'
import test from '../assets/json/vqc2.json'
// import cul from '../assets/json/cul.json'

let dictionaries = {
  'tourism1': tourism1,
  'tourism': tourism,
  'digital1': digital1,
  'culinary2': culinary2,
  'culinary1': culinary1,
  'generalY': generalY,
  'generalW': generalW,
  'generalD': generalD,
  'generalV': generalV,
  'generalT': generalT,
  'generalG': generalG,
  'high': null,
  'food': food
}

Vue.use(Vuex)

const state = {
  userProfile: parseLocal(localStorage.userProfile) || {},
  userRecord: null,
  currentRecord: parseLocal(localStorage.currentRecord) || {},
  logsRecord: null,
  setRecord: { dictRecord: {}, starRecord: {}, addRecord: {} },
  updateStatus: true,
  skeleton: false,
  jwt: localStorage.token || '',
  testJ: test,
  master: dictionaries[parseLocal(localStorage.userProfile).vocab],
  testActive: false,
  device: localStorage.device || '',
  loginTime: localStorage.loginTime || '',
  classRecords: null,
  audioLinks: {
    t: 'audio',
    f: 'foodio',
    d: 'digital',
    c: 'culinary',
    g: 'general'
  },
  scheme: {
    prime: 'prime',
    second: 'second',
    third: 'third',
    fourth: 'fourth',
    warn: 'warn',
    peel: 'peel',
    cream: 'cream'
  }
}

const actions = {
  // communicate with backend API
  login (context, userData) {
    // mutation action to set userData after login
    return authenticate(userData)
      .then(function (response) {
        // console.log(response)
        // console.log(response.data)
        if (response.data.err) {
          return response.data
        } else {
          context.commit('setJwtToken', { jwt: response.data.token })
          context.commit('setProfile', {
            userProfile: response.data.userProfile,
            userRecord: response.data.userRecord,
            logsRecord: response.data.logsRecord,
            setRecord: response.data.setRecord,
            skeleton: response.data.skeleton
          })
          context.commit('setMaster', { userProfile: response.data.userProfile })
          // console.log(response.data)
          return response.data
        }
      })
      .catch(error => {
        console.log('Error Authenticating: ', error)
      })
  },
  register (context, userData) {
    // console.log(context)
    return register(userData)
      .then(function (response) {
        return response.data
      })
      .catch(error => {
        console.log('Error Registering: ', error)
      })
  },
  ticket (context, userData) {
    // console.log(context)
    console.log(userData)
    return ticket(userData)
      .then(function (response) {
        return response.data
      })
      .catch(error => {
        console.log('Error Ticketing: ', error)
      })
  },
  account (context, userData) {
    // console.log(context, userData)
    return updateAccount(userData)
      .then(function (response) {
        console.log('account', response)
        if (response.data.err) {
          return response.data
        } else {
          context.commit('setAccount', {dataReturn: response.data.dataReturn, newVocab: response.data.newVocab})
          return response.data
        }
      })
      .catch(error => {
        alert('An error has occured - your account has not been updated')
        router.push('/account')
        console.log('Error Updating: ', error)
      })
  },
  updateRecord (context, payload) {
    console.log('record', payload)
    context.commit('setNewRecord', payload)
  },
  updateMatch (context, payload) {
    // console.log('match', payload)
    context.commit('setNewMatch', payload)
  },
  logout (context) {
    // console.log('logout...')
    context.commit('destroyToken')
  },
  checkLogin () {
    // console.log('check login...')
    return isValidJwt(state.jwt)
  },
  testActive (context, bol) {
    context.commit('setTestActive', bol)
  },
  openSocket (context) {
    context.commit('setSocket')
  },
  closeSocket (context) {
    context.commit('closeSocket')
  },
  saveData (context) {
    // console.log('save data...')
    context.commit('sendRecords')
  },
  addFriend (context, payload) {
    // console.log('friend data...')
    context.commit('setFriend', payload)
  },
  newPicture (context, payload) {
    console.log('new picture data...', payload)
    context.commit('setNewPicture', payload)
  },
  newStar (context, payload) {
    console.log('new star data...', payload)
    context.commit('setNewStar', payload)
  },
  newAdd (context, payload) {
    console.log('new add data...', payload)
    context.commit('setNewAdd', payload)
  },
  newAudio (context, payload) {
    console.log('new audio data...', payload)
    return addAudio(payload)
      .then(function (response) {
        console.log(response.data)
        return response.data
      })
      .catch(error => {
        console.log('Error Audio: ', error)
      })
  },
  deletePict (context, payload) {
    context.commit('setDeletePict', payload)
  },
  apiRecords (context, payload) {
    // console.log('record request...')
    return getRecordAPI(payload)
      .then(function (response) {
        // console.log(response.data)
        context.commit('setRecords', response.data)
      })
      .catch(error => {
        console.log('Error Registering: ', error)
      })
  },
  classRecords (context, payload) {
    // console.log('record request...')
    return getClass(payload)
      .then(function (response) {
        console.log(response.data)
        context.commit('setClassRecords', response.data.classRecords)
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
    // console.log('setJwtToken payload = ', payload.jwt)
    localStorage.token = payload.jwt
    state.jwt = payload.jwt
  },
  setProfile (state, payload) {
    console.log('setProfile payload = ', payload)

    localStorage.setItem('userProfile', JSON.stringify(payload.userProfile))
    state.userProfile = payload.userProfile
    state.setRecord = payload.setRecord
    state.userRecord = payload.userRecord

    if (Object.keys(state.setRecord.dictRecord).length === 0) {
      console.log('dictString')
      state.setRecord.dictRecord['add'] = {
        chinese: '加',
        def: 'to contribute more / build on / include',
        link: 'add',
        text: 'You can add pictures and definition to your words to help you remember and test them.',
        vocab: 'none',
        word: 'add'
      }
    }

    if (Object.keys(state.setRecord.addRecord).length === 0) {
      console.log('addString')
      state.setRecord.addRecord['add'] = {
        defch1: '加',
        defch2: '',
        gl: 'v.'
      }
    }

    if (Object.keys(state.setRecord.starRecord).length === 0) {
      console.log('addStar')
      state.setRecord.addRecord['add'] = 1
    }

    state.logsRecord = payload.logsRecord
    state.loginTime = new Date()
    localStorage.setItem('loginTime', new Date())
    state.logsRecord.logs[state.loginTime] = {}

    var device = checkDevice()

    localStorage.setItem('device', device)
    state.device = device
    state.logsRecord.logs['device'] = device

    localStorage.setItem('currentRecord', JSON.stringify({}))
    state.currentRecord = {}
    state.updateStatus = true
    state.testActive = false
    state.skeleton = payload.skeleton
  },
  setMaster (state, payload) {
    // console.log('setMaster payload = ', payload.userProfile.vocab)
    state.master = dictionaries[payload.userProfile.vocab]
  },
  setRecords (state, payload) {
    /// set records on page refresh
    // not equal to {} means the students has records already
    if (state.logsRecord !== {}) {
      state.logsRecord = payload.logsRecord
    }
    if (!state.logsRecord.logs[state.loginTime]) {
      Vue.set(state.logsRecord.logs, state.loginTime, {})
    }
    if (state.userRecord !== {}) {
      state.userRecord = payload.userRecord
    }
    if (state.setRecord !== {}) {
      state.setRecord = payload.setRecord
    }
  },
  setClassRecords (state, payload) {
    state.classRecords = payload
  },
  setAccount (state, payload) {
    console.log('setAccount payload = ', payload.dataReturn)
    for (let item in payload.dataReturn) {
      if (item !== 'imageData') {
        state[item] = payload.dataReturn[item]
      }
    }
    state.userProfile = {...state.userProfile}
    localStorage.setItem('userProfile', JSON.stringify(state.userProfile))
  },
  setNewPicture (state, payload) {
    let parseData = JSON.parse(payload['newWord'])
    console.log('setNewWord payload = ', payload)
    console.log('setNewWord parse = ', parseData)
    let newLink
    if (parseData.link === null) {
      newLink = parseData.code
    } else {
      newLink = parseData.link
    }
    state.setRecord.dictRecord[parseData.word] = {
      'word': parseData.word,
      'text': parseData.text,
      'link': newLink,
      'def': parseData.def,
      'chinese': parseData.chinese,
      'vocab': parseData.vocab
    }
    state.setRecord = {...state.setRecord}
    state.updateStatus = false
  },
  setNewStar (state, payload) {
    console.log('setNewStar payload = ', payload)
    if (payload.set === 0) {
      console.log('delete')
      delete state.setRecord.starRecord[payload.word]
      state.setRecord = {...state.setRecord}
    } else {
      console.log('set')
      state.setRecord.starRecord[payload.word] = 1
      state.setRecord = {...state.setRecord}
    }
    state.updateStatus = false
  },
  setNewAdd (state, payload) {
    console.log('setNewAdd payload = ', payload)
    if (payload.set === 0) {
      console.log('delete add')
      delete state.setRecord.addRecord[payload.word]
      console.log(state.setRecord.addRecord)
      state.setRecord = {...state.setRecord}
    } else {
      console.log('set add')
      state.setRecord.addRecord[payload.word] = payload.details
      state.setRecord = {...state.setRecord}
    }
    state.updateStatus = false
  },
  setDeletePict (state, payload) {
    console.log('setDeletePict payload = ', payload)
    delete state.setRecord.dictRecord[payload.word]
    state.setRecord = {...state.setRecord}
    console.log(state.setRecord.dictRecord, state.setRecord.dictRecord[payload.word])
    state.updateStatus = false
  },
  destroyToken (state) {
    // console.log('destroyToken')
    state.userProfile = {}
    state.userRecord = {}
    state.currentRecord = {}
    state.logsRecord = {}
    state.setRecord = {dictRecord: {}, starRecord: {}, addRecord: {}}
    state.jwt = ''
    localStorage.clear()
    router.push('login')
  },
  setTestActive (state, bol) {
    state.testActive = bol
    // console.log('testActive', state.testActive)
  },
  sendRecords (state) {
    if (state.updateStatus || state.skeleton) {
      return false
    }
    let _state = state
    updateRecAPI({userRecord: state.userRecord, userID: state.userProfile.userID, logsRecord: state.logsRecord, setRecord: state.setRecord})
      .then(function (response) {
        _state.updateStatus = true
        // localStorage.settings = JSON.stringify({})
        localStorage.setItem('userProfile', JSON.stringify(state.userProfile))
        localStorage.setItem('currentRecord', JSON.stringify(state.currentRecord))
        // console.log('RECORDS UPDATED', response)
      })
      .catch(error => {
        // log and signal to app
        if (_state.jwt !== '') {
          alert('Sorry, an updating error has occured', error)
        }
        // console.log('Error Authenticating: ', error)
      })
  },
  setNewRecord (state, payload) {
    // console.log('setNewRecord payload = ', payload)
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
    state.logsRecord.settings[mode] = payload.settingsData

    // console.log('LOGSRECORD', state.logsRecord, state.logsRecord.settings, state.logsRecord.logs)

    if (!state.logsRecord.logs[state.loginTime]['vocab']) {
      Vue.set(state.logsRecord.logs[state.loginTime], 'vocab', state.userProfile.vocab)
    }
    if (!state.logsRecord.logs[state.loginTime].mode) {
      Vue.set(state.logsRecord.logs[state.loginTime], mode, {words: 0, tests: 0})
    }

    // console.log('logs', state.logsRecord.logs[state.loginTime][mode])

    state.logsRecord.logs[state.loginTime][mode]['words'] += (payload.answerData).length
    state.logsRecord.logs[state.loginTime][mode]['tests'] += 1

    localStorage.setItem('currentRecord', JSON.stringify(state.currentRecord))
    // data is waiting to be updated
    state.updateStatus = false
  },
  setNewMatch (state, payload) {
    // console.log('setNewMatch payload = ', payload)
    let mode = payload.mode
    if (!state.currentRecord[mode]) {
      Vue.set(state.currentRecord, mode, {})
    }

    Vue.set(state.currentRecord[mode], new Date(), payload.winnerStatus)

    if (!state.logsRecord.logs[state.loginTime].mode) {
      Vue.set(state.logsRecord.logs[state.loginTime], mode, {words: 0, tests: 0})
    }

    state.logsRecord.logs[state.loginTime][mode]['words'] += payload.winnerStatus
    state.logsRecord.logs[state.loginTime][mode]['tests'] += 1

    state.updateStatus = false
  },
  setFriend (state, payload) {
    // console.log(payload)
    // state.logsRecord.friends = {}
    state.logsRecord.friends = payload.friendData
    state.updateStatus = false
  }
}

const getters = {
  // reusable data accessors
  classRecords (state) {
    // console.log(state.jwt)
    return state.classRecords
  },
  isAuthenticated (state) {
    // console.log(state.jwt)
    return isValidJwt(state.jwt)
  },
  isActive (state) {
    // console.log('getterActive', state.testActive)
    return state.testActive
  },
  pictGet (state) {
    return state.setRecord.dictRecord
  },
  starGet (state) {
    return state.setRecord.starRecord
  },
  generalGet () {
    let totalDict = {}
    for (let d in dictionaries) {
      if (d[0] === 'g') {
        for (let v in dictionaries[d]) {
          totalDict[v] = 1
        }
      }
    }
    return totalDict
  },
  makeList (state) {
    let tableItems = []
    let dict = {...state.master}

    // console.log('check add ', state.setRecord.addRecord)
    for (let v in state.setRecord.addRecord) {
      // console.log(v)
      dict[v] = state.setRecord.addRecord[v]
    }

    for (let vocab in dict) {
      let chinese
      let chineseExt
      if (dict[vocab].defch2) {
        if (dict[vocab].defch2[0].match(/[\u3400-\u9FBF]/)) {
          chinese = dict[vocab].defch1 + ';' + dict[vocab].defch2
        } else {
          chinese = dict[vocab].defch1
        }
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
      if (!state.userRecord.typeTest) {
        // pass
      } else if (state.userRecord.typeTest[vocab]) {
        // note that this word has been tested
        tested = true
        spellScore = state.userRecord.typeTest[vocab]
        if (spellScore > 2) {
          spellScore = 2
        } else if (spellScore < -2) {
          spellScore = -2
        }
      }
      let matchScore = 0
      if (!state.userRecord.matchTrans) {
        // pass
      } else if (state.userRecord.matchTrans[vocab]) {
        // note that this word has been tested
        tested = true
        matchScore = state.userRecord.matchTrans[vocab]
        if (matchScore > 2) {
          matchScore = 2
        } else if (matchScore < -2) {
          matchScore = -2
        }
      }
      if (!state.userRecord.matchType) {
        // pass
      } else if (state.userRecord.matchType[vocab]) {
        // note that this word has been tested
        tested = true
        matchScore = state.userRecord.matchType[vocab]
        if (matchScore > 2) {
          matchScore = 2
        } else if (matchScore < -2) {
          matchScore = -2
        }
      }
      let variant = null
      let total = transEngScore + spellScore + transChScore + matchScore
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

      console.log('vocab', state.userProfile.vocab)

      let vc = state.userProfile.vocab[0]
      let s3root = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/'
      let s3 = s3root + state.audioLinks[vc]
      let mp3en = s3 + '_en/' + vocab + '.mp3'
      let mp3ch = s3 + '_ch/' + vocab + '.mp3'
      let origin = 'master'

      if (!state.setRecord.addRecord) {
        // make sure there is addRecord
        state.setRecord['addRecord'] = {}
      } else if (vocab in state.setRecord.addRecord) {
        origin = 'new'
        if (state.setRecord.addRecord[vocab].added === true) {
          mp3en = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/added_en/' + vocab + '.mp3'
          mp3ch = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/added_ch/' + vocab + '.mp3'
        }
      }

      let star = false
      let picture = false
      let added = false

      if (vocab in state.setRecord.starRecord) {
        star = true
      }

      if (vocab in state.setRecord.dictRecord) {
        picture = true
      }

      if (vocab in state.setRecord.dictRecord) {
        added = true
      }

      tableItems.push({
        English: vocab,
        Chinese: chinese,
        ChineseExt: chineseExt,
        Gr: dict[vocab].gl,
        mp3en: mp3en,
        mp3ch: mp3ch,
        Origin: origin,
        Star: star,
        Picture: picture,
        Added: added,
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
