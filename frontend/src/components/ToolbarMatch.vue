<template>
  <div class="toolbar" v-if="!toolbarShow">
    <div>

      <div class="mt-2 bg-secondary p-2">
            <h2 class="text-sand" align="center">
              {{ testType }}
            </h2>
      </div>
      <div class="mt-2 bg-info p-2">
             <b-avatar :src="s3 + p1.toString() + '.jpg'" :text="p1name[0]" class="mr-3" variant='p1'></b-avatar>
              <span class="mr-auto">{{ p1name }}</span>
             <b-avatar :src="s3 + p2.toString() + '.jpg'" :text="p2name[0]" class="mr-3" variant='p2'></b-avatar>
              <span class="mr-auto">{{ p2name }}</span>
      </div>
      <div class="bg-primary p-2 mt-0">
        <b-row>
          <b-col>
            <b-button :variant="player" block class="md-3" @click="playerReady(), waiting=1">Ready</b-button>
          </b-col>
        </b-row>
      </div>

      <b-card v-if="waiting === 1" align="center">
        <b-icon icon="three-dots" animation="cylon" font-scale="6" :variant="player"></b-icon>
      </b-card>

      <b-card v-if="waiting === 2" align="center">
        <b-icon icon="caret-right-square-fill" animation="throb" font-scale="6" :variant="player"></b-icon>
      </b-card>

      <div class="bg-grey p-2 pb-4" v-if="waiting === 0 && player==='p1'">
        <b-row cols="2" cols-md="4" cols-lg="6" >
          <b-col class="mt-3">
              <h6 align="center">Words</h6>
              <!--<div align="center" class="d-block d-lg-none">
                <b-form-spinbutton v-model="words" min="6" max="30" step=2 ></b-form-spinbutton>
              </div> -->
              <div align="center">
                <b-form-spinbutton v-model="words" min="6" max="30" step=2 vertical style="height:125px"></b-form-spinbutton>
              </div>
            </b-col>

          <b-col class="mt-3" v-if="testType === 'TransEng' || testType === 'TransCh'">
              <h6 align="center">Choices</h6>
              <!-- <div align="center" class="d-block d-lg-none">
                <b-form-spinbutton v-model="choices" min="2" max="6" ></b-form-spinbutton>
              </div>-->
              <div align="center">
                <b-form-spinbutton v-model="choices" min="2" max="6" vertical style="height:125px"></b-form-spinbutton>
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

          <b-col class="mt-3" v-if="testType === 'TypeTest'">
             <h6 align="center">Feedback</h6>
             <div align="center">
              <b-form-radio-group
              v-model="feedback"
              :options="feedbackOptions"
              buttons
              button-variant="outline-primary"
              stacked
            ></b-form-radio-group>
            </div>
          </b-col>

          <b-col class="mt-3" v-if="testType === 'TypeTest'">
            <h6 align="center"> Spelling </h6>
            <div align="center">
            <b-dropdown :text="spellingText">
              <div>
                  <b-dropdown-item v-for="(btn, index) in optionsO" :key="index" @click="spelling=btn.value; spellingText=btn.text "> {{ btn.text }} </b-dropdown-item>
              </div>
            </b-dropdown>
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
      s3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/',
      wordsReset: '6',
      words: 6,
      choices: 4,
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
      spellingText: '-----',
      optionsO: [
        { value: null, text: '---' },
        { value: 'const', text: 'show vowels' },
        { value: 'vowels', text: 'show consonants' },
        { value: 'blanks', text: 'show blanks' },
        { value: 'all', text: 'show all' },
        { value: 'showFL', text: 'show words' },
        { value: 'typos', text: 'typos' },
        { value: 'scramble', text: 'scramble letter' }
      ],
      feedback: 'fbConst',
      feedbackOptions: [
        { text: 'Constant', value: 'fbConst' },
        { text: 'Complete', value: 'fbComp' },
        { text: 'None', value: 'fbNone' }
      ]
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

      if (this.testType === 'TypeTest') {
        this.makeSpelling()
      } else {
        this.makeChoices()
      }
    },
    makeChoices: function () {
      let i = 0
      while (i < this.words) {
        var randomItem = this.amendedList[Math.floor(Math.random() * this.amendedList.length)]
        // console.log(this.testItems, randomItem)
        if (!this.checkDuplicate(randomItem)) {
          console.log('pass', randomItem)
        } else {
          let choices = [{
            English: randomItem.English,
            Chinese: randomItem.Chinese,
            Gr: randomItem.Gr,
            sdEn: randomItem.mp3en,
            sdCh: randomItem.mp3ch
          }]
          let j = 1
          while (j < this.choices) {
            if (this.sound === 'sdTy') {
              choices.push({
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
                  English: randomChoice.English,
                  Chinese: randomChoice.Chinese,
                  Gr: randomChoice.Gr,
                  sdEn: randomChoice.mp3en,
                  sdCh: randomChoice.mp3ch
                })
                j++
              }
            }
          }
          let shuffChoices = this.shuffle(choices)
          this.testItemsRoot.push({
            English: randomItem.English,
            Chinese: randomItem.Chinese,
            Choices: shuffChoices,
            Gr: randomItem.Gr,
            sdEn: randomItem.mp3en,
            sdCh: randomItem.mp3ch
          })
          i++
        }
      }

      this.toolbarSettings = {
        type: this.testType,
        sound: this.sound,
        words: this.words,
        choices: this.choices
      }

      this.socket.emit('ready', {room: this.p1, player: this.player, testItems: this.testItemsRoot})
      console.log(this.testItemsRoot)

      if (this.words < 6) {
        this.words = parseInt(this.wordsReset)
      }
    },
    makeSpelling: function () {
      let i = 0
      while (i < this.words) {
        var randomItem = this.amendedList[Math.floor(Math.random() * this.amendedList.length)]
        // console.log(this.testItems, randomItem)
        if (!this.checkDuplicate(randomItem)) {
          console.log('pass', randomItem)
        } else {
          // CHANGE MADE new code for spelling set up
          let spell = '              '
          if (this.spelling) {
            spell = wordFix(randomItem.English, this.spelling)
          }

          console.log('SPELL', spell)
          this.testItemsRoot.push({
            English: randomItem.English,
            Chinese: randomItem.Chinese,
            Spelling: spell,
            Gr: randomItem.Gr,
            sdEn: randomItem.mp3en,
            sdCh: randomItem.mp3ch
          })
          i++
        }
      }

      this.toolbarSettings = {
        type: this.testType,
        sound: this.sound,
        label: this.label,
        words: this.words,
        choices: this.choices,
        spelling: this.spelling,
        display: this.display,
        feedback: this.feedback
      }

      this.$emit('newTest', {
        test: this.testItemsRoot,
        settings: JSON.stringify(this.toolbarSettings)
      })

      this.socket.emit('ready', {room: this.p1, player: this.player, testItems: this.testItemsRoot})
      console.log(this.testItemsRoot)

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
          console.log('found', rand)
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
        this.socket.emit('ready', {room: this.p1, player: this.player, testItems: this.testItemsRoot})
      }
    }
  },
  watch: {
    words: function () {
      if (this.words === 0) {
        alert('There are no words that meet your selection')
        this.words = parseInt(this.wordsReset)
      }
    }
  },
  created () {
    this.alphabet()
    this.tableItems = this.$store.getters.makeList
    this.stringItems = JSON.stringify(this.tableItems)

    if (this.testType === 'TransCh') {
      this.sortOptions.pop()
      this.soundOptions = [
        { text: 'exam mode', value: 'sdEx' },
        { text: 'typo check', value: 'sdTy' },
        { text: 'off', value: 'sdOff' }
      ]
    }

    if (this.testType === 'TypeTest') {
      this.sound = 'sdEn'
      this.soundOptions = [
        { text: 'English', value: 'sdEn' },
        { text: 'Chinese', value: 'sdCh' },
        { text: 'None', value: 'sdOff' }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.form-control {
  background-color:lightgrey;
}
</style>
