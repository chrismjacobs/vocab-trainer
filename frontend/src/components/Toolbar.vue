<template>
  <div class="toolbar" v-if="!toolbarShow">
    <div>

      <div class="mt-2 bg-secondary p-2">
            <h2 class="text-sand" align="center">
              {{ testType }}
            </h2>
      </div>
      <div class="bg-primary p-2 mt-0">
        <b-row>
          <b-col>
            <b-button variant="primary" block class="md-3" @click="makeTest(), showToolbar=false">Start</b-button>
          </b-col>
          <b-col v-if="showAnswers">
            <b-button  variant="warning" block class="md-3" @click="retryTest()">Retry</b-button>
          </b-col>
          <b-col>
            <b-button variant="info" block class="md-3" @click="showToolbar=true">Settings</b-button>
          </b-col>
        </b-row>
      </div>

      <div class="bg-grey p-2 pb-4" v-if="showToolbar">
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

          <b-col class="mt-3" v-if="testType === 'TypeTest'">
             <h6 align="center">Display</h6>
            <div align="center">
              <b-form-radio-group
              v-model="display"
              :options="displayOptions"
              buttons
              button-variant="outline-primary"
              stacked
            ></b-form-radio-group>
            </div>
          </b-col>

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

          <b-col class="mt-3" v-if="testType === 'TransEng' || testType === 'TransCh'">
            <h6 align="center">Grammar</h6>
            <div align="center">
              <b-form-radio-group
                  v-model="label"
                  :options="labelOptions"
                  buttons
                  button-variant="outline-primary"
                  stacked
                ></b-form-radio-group>
            </div>
          </b-col>

          <b-col class="mt-3" v-if="testType === 'TransEng' || testType === 'TransCh'">
            <h6 align="center"> Sort </h6>
            <div align="center">
              <b-form-radio-group
                v-model="sort"
                :options="sortOptions"
                buttons
                button-variant="outline-primary"
                stacked
              ></b-form-radio-group>
            </div>
          </b-col>
          <b-col class="mt-3" v-if="testType === 'TransEng' || testType === 'TransCh'">
            <div class="mt-5"></div>
            <b-form-select v-if="sort=='srtLet'" class="selectColor" v-model="selected" :options="optionsA" ></b-form-select>
            <b-form-select v-if="sort=='srtGram'" class="selectColor" v-model="selected" :options="optionsG"></b-form-select>
            <b-form-select v-if="sort=='srtDiff'" class="selectColor" v-model="selected" :options="optionsR"></b-form-select>
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

          <b-col class="mt-3" v-if="testType === 'TypeTest'">
            <h6 align="center"> Sort </h6>
            <div align="center">
            <b-dropdown :text="specialText" variant="warning">
              <div>
                  <b-dropdown-item v-for="(btn, index) in optionsS" :key="index" @click="special=btn.value; specialText=btn.text"> {{ btn.text }} </b-dropdown-item>
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
  name: 'Toolbar',
  props: {
    toolbarShow: Boolean,
    showAnswers: Boolean,
    testType: String
  },
  data () {
    return {
      showToolbar: true,
      wordsReset: '6',
      words: 6,
      choices: 4,
      retry: false,
      testItemsRoot: [],
      amendedList: [],
      selected: null,
      toolbarSettings: {},
      optionsA: [{ value: null, text: '---' }],
      optionsG: [
        { value: null, text: '---' },
        { value: 'v.', text: 'verbs' },
        { value: 'adj.', text: 'adjectives' },
        { value: 'n.', text: 'nouns' },
        { value: 'phr.', text: 'phrases' },
        { value: 'abbr.', text: 'abbreviations' },
        { value: 'prop.', text: 'proper nouns' }
      ],
      optionsR: [
        { value: null, text: '---' },
        { value: 0, text: 'neutral score' },
        { value: 1, text: 'easier words' },
        { value: -1, text: 'harder words' }
      ],
      label: 'lbAn',
      labelOptions: [
        { text: 'answer', value: 'lbAn' },
        { text: 'question', value: 'lbQu' },
        { text: 'all off', value: 'lbOff' },
        { text: 'all on', value: 'lbOn' }
      ],
      sort: 'srtNone',
      sortOptions: [
        { text: 'none', value: 'srtNone' },
        { text: 'difficulty', value: 'srtDiff' },
        { text: 'grammar', value: 'srtGram' },
        { text: 'letter', value: 'srtLet' }
      ],
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
      specialText: '-----',
      special: null,
      optionsS: [
        { value: null, text: '---' },
        { value: 'punc', text: 'punctuation' },
        { value: 'phr.', text: 'phrases' },
        { value: 'abbr.', text: 'abbreviations' },
        { value: 'prop.', text: 'proper nouns' }
      ],
      display: 'ch_text_On',
      displayOptions: [
        { text: 'Chinese', value: 'ch_text_On' },
        { text: 'Label', value: 'ch_lb_On' },
        { text: 'None', value: 'ch_lb_Off' }
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
      this.amendedList = []

      if (this.sort === 'srtNone' && this.special === null) {
        this.amendedList = vocabList
      } else if (this.sort === 'srtDiff') {
        for (let item in vocabList) {
          if (this.selected === 0 && vocabList[item].transScore === 0) {
            this.amendedList.push(vocabList[item])
          }
          if (this.selected === 0 && vocabList[item].transScore === null) {
            this.amendedList.push(vocabList[item])
          }
          if (this.selected === -1 && vocabList[item].transScore <= -1) {
            this.amendedList.push(vocabList[item])
          }
          if (this.selected === 1 && vocabList[item].transScore >= 1) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.sort === 'srtLet') {
        for (let item in vocabList) {
          if (vocabList[item].Category === this.selected) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.sort === 'srtGram') {
        for (let item in vocabList) {
          if (vocabList[item].Gr === this.selected) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.special === 'phr.' || this.special === 'abbr.' || this.special === 'prop.') {
        for (let item in vocabList) {
          if (vocabList[item].Gr === this.special) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.special === 'punc') {
        for (let item in vocabList) {
          if (vocabList[item].English.includes('-') ||
              vocabList[item].English.includes("'") ||
              vocabList[item].English.includes('&') ||
              vocabList[item].English.includes('.')) {
            this.amendedList.push(vocabList[item])
          }
        }
      }

      // check there are enought words available
      if (this.amendedList.length < this.words) {
        this.words = this.amendedList.length
        // console.log('few words', this.amendedList)
      }

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
        label: this.label,
        sort: this.sort,
        words: this.words,
        choices: this.choices,
        selected: this.selected
      }

      // console.log(this.testItemsRoot)

      this.$emit('newTest', {
        test: this.testItemsRoot,
        settings: JSON.stringify(this.toolbarSettings)
      })

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
