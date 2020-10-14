<template>
  <div class="matchBar" v-if="!toolbarShow">
    <div>

      <div class="bg-third p-3" v-if="testType !== 'TypeMatch'">
            <h3 align="center">
              {{ gameNames[testType] }}
            </h3>
      </div>

      <div align="center" class="bg-prime p-2" style="height:60px">
        <div v-if="waiting === 0" :class="'buttonDiv text-prime bg-' + player" style="width: 60%" @click="playerReady(), emitWaiting(1)">
          <h5 class="mt-1"> Ready </h5>
        </div>

        <div v-if="waiting === 1" :class="'mb-2 text-center text-'+ player" style="height:60px">
          <b-icon icon="three-dots" animation="cylon" font-scale="3"></b-icon>
        </div>

        <div v-if="waiting === 2" :class="'mt-2 text-center text-'+ player" style="height:60px">
          <b-spinner class="align-middle"></b-spinner> &nbsp;&nbsp; <strong>Loading...</strong>
        </div>
      </div>

      <div class="bg-grey p-2 pb-4" v-if="waiting === 0">
        <b-row>
          <b-col class="mt-3">
              <div align="center">
                <div class="headDiv">
                  Words
                </div>
                <div class="spinDiv">
                  <b-form-spinbutton v-if="player === 'p1'" v-model="words" min="6" max="30" step=2 vertical style="height:125px"></b-form-spinbutton>
                  <b-form-spinbutton v-else disabled v-model="words" vertical style="height:125px;color:red"></b-form-spinbutton>
                </div>
              </div>
            </b-col>
          <b-col class="mt-3" v-if="testType === 'TransEng' || testType === 'TransCh'">
              <div align="center">
                <div class="headDiv">
                  Choices
                </div>
                <div class="spinDiv">
                <b-form-spinbutton v-if="player === 'p1'" v-model="choices" min="2" max="6" vertical style="height:125px"></b-form-spinbutton>
                <b-form-spinbutton v-else disabled v-model="choices" min="2" max="6" vertical style="height:125px;color:red"></b-form-spinbutton>
                </div>
              </div>
          </b-col>
           <!--
          <b-col class="mt-3">
            <h6 align="center">Sound</h6>
            <div align="center">
              <b-form-radio-group
                v-model="sound"
                :options="soundOptions"
                button-variant="outline-danger"
                buttons
                class="radioBTN"
                stacked
              ></b-form-radio-group>
            </div>
          </b-col>
          -->
          <b-col class="mt-3" v-if="testType === 'TypeMatch'">
             <div class="headDiv">
                  Feedback
            </div>
            <div align="center">
            <b-dropdown style="width:100%" v-if="player === 'p1'" variant="warn-light" :text="feedbackText">
              <div>
                  <b-dropdown-item  v-for="(btn, index) in feedbackOptions" :key="index" @click="feedback=btn.value; feedbackText=btn.text "> {{ btn.text }} </b-dropdown-item>
              </div>
            </b-dropdown>
            <div v-else align="center" style="width:100%">
                  <button class="buttonDiv bg-warn-light text-alert" disabled> {{feedbackText}} </button>
            </div>
            </div>

            <br>

            <div class="headDiv">
                  Assist
            </div>
            <div align="center">
            <b-dropdown style="width:100%;text-overflow:ellipsis" v-if="player === 'p1'" variant="third" :text="spellingText">
              <div>
                  <b-dropdown-item  v-for="(btn, index) in optionsO" :key="index" @click="spelling=btn.value; spellingText=btn.text "> {{ btn.text }} </b-dropdown-item>
              </div>
            </b-dropdown>
              <div v-else align="center" style="width:100%">
                  <button class="buttonDiv bg-third text-alert" disabled> {{spellingText}} </button>
              </div>
            </div>
          </b-col>

          <b-col class="mt-3">
              <div align="center">
                <div class="headDiv">
                  Timer
                </div>
                <div class="spinDiv">
                <b-form-spinbutton v-if="player === 'p1' && testType[1] === 'r'" v-model="timeReset" min="4" max="12" step=2 vertical style="height:125px"></b-form-spinbutton>
                <b-form-spinbutton v-else-if="player === 'p1' && testType[1] === 'y'" v-model="timeReset" min="15" max="60" step=5 vertical style="height:125px"></b-form-spinbutton>
                <b-form-spinbutton v-else disabled v-model="timeReset" min="4" max="12" vertical step=2 style="height:125px;color:red"></b-form-spinbutton>
                </div>
              </div>
          </b-col>

        </b-row>
      </div>

    </div>
  </div>
</template>

<script>
import { getTypos, wordFix } from '@/utils'

export default {
  name: 'ToolbarMatch',
  props: {
    toolbarShow: Boolean,
    showToolbar: Boolean,
    showAnswers: Boolean,
    testType: String,
    p1: Number,
    p1name: String,
    p2: Number,
    p2name: String,
    player: String,
    waiting: Number,
    socket: Object
  },
  data () {
    return {
      wordsReset: '12',
      words: 12,
      choices: 4,
      timeReset: 6,
      retry: false,
      testItemsRoot: [],
      amendedList: [],
      toolbarSettings: {},
      optionsA: [{ value: null, text: '---' }],
      sound: 'sdEx',
      soundOptions: [
        { text: 'exam mode', value: 'sdEx' },
        { text: 'auto play', value: 'sdOn' },
        { text: 'None', value: 'sdOff' }
      ],
      spelling: null,
      spellingText: 'None',
      optionsO: [
        { value: null, text: 'None' },
        { value: 'const', text: 'Vowels' },
        { value: 'vowels', text: 'Consonants' },
        { value: 'blanks', text: 'Blanks' },
        { value: 'all', text: 'Show all' },
        { value: 'showFL', text: 'Show gaps' },
        { value: 'scramble', text: 'Scramble' }
      ],
      feedback: 'fbConst',
      feedbackText: 'Constant',
      feedbackOptions: [
        { text: 'Constant', value: 'fbConst' },
        { text: 'Complete', value: 'fbComp' },
        { text: 'None', value: 'fbNone' }
      ],
      gameNames: {
        null: 'No Game Type',
        TransEng: 'English -> Chinese',
        TransCh: 'Chinese -> English',
        TypeMatch: 'Typing'
      }
    }
  },
  methods: {
    makeTest: function () {
      // reset variables
      // console.log('make test', this.sort)
      this.testItemsRoot = []

      // prepare amended list
      let vocabList = JSON.parse(this.stringItems)
      this.amendedList = vocabList

      if (this.testType === 'TypeMatch') {
        this.makeSpelling()
      } else {
        this.makeChoices()
      }
    },
    makeChoices: function () {
      let question
      let answer
      let sdAns
      let sdQue

      if (this.testType === 'TransEng') {
        question = 'English'
        answer = 'Chinese'
        sdQue = 'mp3en'
        sdAns = 'mp3ch'
      } else {
        question = 'Chinese'
        answer = 'English'
        sdQue = 'mp3ch'
        sdAns = 'mp3en'
      }

      let i = 0
      while (i < this.words) {
        var randomItem = this.amendedList[Math.floor(Math.random() * this.amendedList.length)]
        // console.log(this.testItems, randomItem)

        if (!this.checkDuplicate(randomItem)) {
          // console.log('pass', randomItem)
        } else {
          let choices = [{
            Question: randomItem[question],
            Answer: randomItem[answer],
            Gr: randomItem.Gr,
            sdQue: randomItem[sdQue],
            sdAns: randomItem[sdAns]
          }]
          let j = 1
          while (j < this.choices) {
            if (this.sound === 'sdTy') {
              choices.push({
                // typo mode not used yet but will need editting
                English: this.typoFix(randomItem.English),
                Gr: randomItem.Gr,
                sdEn: randomItem.mp3en,
                sdCh: randomItem.mp3ch,
                Chinese: randomItem.Chinese
              })
              j++
            } else {
              let randomChoice = this.amendedList[Math.floor(Math.random() * this.amendedList.length)]

              if (!choices.includes(randomChoice)) {
                choices.push({
                  Question: randomChoice[question],
                  Answer: randomChoice[answer],
                  Gr: randomChoice.Gr,
                  sdQue: randomChoice[sdQue],
                  sdAns: randomChoice[sdAns]
                })
                j++
              }
            }
          }
          let shuffChoices = this.shuffle(choices)
          this.testItemsRoot.push({
            Question: randomItem[question],
            Answer: randomItem[answer],
            Gr: randomItem.Gr,
            sdQue: randomItem[sdQue],
            sdAns: randomItem[sdAns],
            Choices: shuffChoices
          })
          i++
        }
      }

      this.socket.emit('ready', {room: this.p1, player: this.player, testItems: this.testItemsRoot, timeReset: this.timeReset})
      // console.log(this.testItemsRoot)
    },
    makeSpelling: function () {
      let i = 0
      while (i < this.words) {
        var randomItem = this.amendedList[Math.floor(Math.random() * this.amendedList.length)]
        // console.log(this.testItems, randomItem)
        if (!this.checkDuplicate(randomItem)) {
          // console.log('pass', randomItem)
        } else {
          // CHANGE MADE new code for spelling set up
          let spell = '              '
          if (this.spelling) {
            spell = wordFix(randomItem.English, this.spelling)
          }

          // console.log('SPELL', spell)
          this.testItemsRoot.push({
            English: randomItem.English,
            Chinese: randomItem.Chinese,
            Spelling: spell,
            Gr: randomItem.Gr,
            sdQue: randomItem.mp3en,
            sdAns: randomItem.mp3ch
          })
          i++
        }
      }

      this.socket.emit('ready', {room: this.p1, player: this.player, testItems: this.testItemsRoot, timeReset: this.timeReset})
      // console.log(this.testItemsRoot)

      if (this.words < 6) {
        this.words = parseInt(this.wordsReset)
      }
    },
    typoFix: function (english) {
      // console.log('typos', english)
      let words = english.split(' ')
      let newString = ''
      for (let index in words) {
        newString += getTypos(words[index])
        newString += ' '
      }
      return newString
    },
    retryTest: function () {
      this.$emit('retry', null)
    },
    alphabet: function () {
      let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let letter in alphabet) {
        this.optionsA.push({ value: alphabet[letter], text: alphabet[letter] })
      }
    },
    checkDuplicate: function (rand) {
      for (let testEntry in this.testItems) {
        //  console.log(this.testItems[testEntry].English, rand.English)
        if (this.testItems[testEntry].English === rand.English) {
          // console.log('found', rand)
          return false
        }
      }
      return true
    },
    shuffle: function (array) {
      // Fisher-Yates shuffle
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    },
    goTo: function (arg) {
      this.$router.push(arg)
    },
    playerReady: function () {
      if (this.player === 'p1') {
        this.makeTest()
      } else {
        this.socket.emit('ready', {room: this.p1, player: this.player, testItems: this.testItemsRoot, timeReset: null})
      }
    },
    settingsSend: function (arg) {
      console.log('settingsSend')
      let toolbarSettings = {
        type: this.testType,
        sound: this.sound,
        label: this.label,
        words: this.words,
        timeReset: this.timeReset,
        choices: this.choices,
        spelling: this.spelling,
        spellingText: this.spellingText,
        feedbackText: this.feedbackText,
        display: this.display,
        feedback: this.feedback
      }
      this.socket.emit('settingsData', {room: this.p1, settingsData: toolbarSettings})
    },
    emitWaiting: function (arg) {
      this.$emit('waitUpdate', {
        wait: arg
      })
    }
  },
  watch: {
    words: function () {
      if (this.player === 'p1') {
        this.settingsSend()
      }
    },
    choices: function () {
      if (this.player === 'p1') {
        this.settingsSend()
      }
    },
    timeReset: function () {
      if (this.player === 'p1') {
        this.settingsSend()
      }
    },
    feedback: function () {
      if (this.player === 'p1') {
        this.settingsSend()
      }
    },
    spelling: function () {
      if (this.player === 'p1') {
        this.settingsSend()
      }
    }
  },
  created () {
    this.tableItems = this.$store.getters.makeList
    this.stringItems = JSON.stringify(this.tableItems)
  },
  mounted () {
    if (this.testType[1] === 'r') {
      this.timeReset = 6
    } else {
      this.timeReset = 30
    }
    let _this = this
    _this.socket.on('newSettings', function (data) {
      console.log('settingsReceived', data, _this.feedback)
      _this.$emit('settings', {feedback: _this.feedback, sound: _this.sound})
      if (_this.player === 'p2') {
        for (let set in data.settingsData) {
          _this[set] = data.settingsData[set]
        }
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.form-control {
  background-color:lightgrey;
}
</style>
