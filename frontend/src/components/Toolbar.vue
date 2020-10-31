<template>
  <div class="toolbar" v-if="!toolbarShow">
    <div>

      <div class="mt-2 bg-second p-2 head">
            <h2 class="text-cream" align="center">
              {{ title }}
            </h2>
      </div>
      <div class="bg-prime p-2 mt-0">
        <b-row>
          <b-col align="center">
            <button class="buttonDiv bg-info px-3" style="width:45%; height:50px" @click="makeTest(), showToolbar=false"> <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward></button>
          </b-col>
        </b-row>
        <b-row class="mt-2" v-if="showAnswers && !showToolbar"  align="center">
          <b-col>
            <button class="buttonDiv bg-warn" style="width:100%" @click="retryTest()"> <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise></button>
         </b-col>
          <b-col>
            <button class="buttonDiv bg-grey" style="width:100%" @click="showToolbar=true"> <b-icon-tools variant="cream" font-scale="1.5"></b-icon-tools></button>
          </b-col>
        </b-row>
      </div>

      <div class="bg-fourth p-2 pb-4 mb-5" v-if="showToolbar">
        <b-row cols="2" cols-lg="4" cols-xl="6" >
          <b-col class="mt-4">
              <div align="center">
                <div class="headDiv">
                  Words
                </div>
                <div class="spinDiv d-none d-sm-block">
                  <b-form-spinbutton v-model="words" min="6" max="30" step=2 vertical style="height:125px"></b-form-spinbutton>
                </div>
                <div class="d-sm-none">
                  <b-form-spinbutton v-model="words" min="6" max="30" step=2 style="width:120px"></b-form-spinbutton>
                </div>
              </div>
            </b-col>

          <b-col class="mt-4" v-if="testType === 'transEng' || testType === 'transCh'">
              <div align="center">
                <div class="headDiv">
                  Choices
                </div>
                <div class="spinDiv d-none d-sm-block">
                <b-form-spinbutton v-model="choices" min="2" max="6" vertical style="height:125px"></b-form-spinbutton>
                </div>
                <div class="d-sm-none">
                <b-form-spinbutton v-model="choices" min="2" max="6" style="width:120px"></b-form-spinbutton>
                </div>
              </div>
          </b-col>

          <b-col class="mt-4">
            <div align="center">
              <div class="headDiv"> Sound </div><br>
              <b-form-radio-group
                style="width:120px"
                v-model="sound"
                :options="soundOptions"
                button-variant="outline-alert"
                buttons
                stacked
              ></b-form-radio-group>
            </div>
          </b-col>

          <b-col class="mt-4" v-if="testType === 'typeTest'">
            <div align="center">
              <div class="headDiv"> Display </div><br>
              <b-form-radio-group
              style="width:120px"
              v-model="display"
              :options="displayOptions"
              buttons
              button-variant="outline-second"
              stacked
            ></b-form-radio-group>
            </div>
          </b-col>

          <b-col class="mt-4" v-if="testType === 'typeTest'">
             <div align="center">
              <div class="headDiv"> Feedback </div><br>
              <b-form-radio-group
              style="width:120px"
              v-model="feedback"
              :options="feedbackOptions"
              buttons
              button-variant="outline-grape-light"
              stacked
            ></b-form-radio-group>
            </div>
          </b-col>

          <b-col class="mt-4" v-if="testType === 'transEng' || testType === 'transCh'">
            <div align="center">
              <div class="headDiv"> Grammar </div><br>
              <b-form-radio-group
                  style="width:120px"
                  v-model="label"
                  :options="labelOptions"
                  buttons
                  button-variant="outline-safe"
                  stacked
                ></b-form-radio-group>
            </div>
          </b-col>

          <b-col class="mt-4" v-if="testType === 'transEng' || testType === 'transCh'">
            <div align="center">
                <div class="headDiv"> Sort </div><br>
              <b-form-radio-group
                style="width:120px"
                v-model="sort"
                :options="sortOptions"
                buttons
                button-variant="outline-warn"
                stacked
              ></b-form-radio-group>
            </div>
          </b-col>
          <b-col class="mt-4" v-if="testType === 'transEng' || testType === 'transCh'">
            <div class="mt-5"></div>
            <b-form-select v-if="sort=='srtLet'" class="selectColor" v-model="selected" :options="optionsA" ></b-form-select>
            <b-form-select v-if="sort=='srtGram'" class="selectColor" v-model="selected" :options="optionsG"></b-form-select>
            <b-form-select v-if="sort=='srtDiff'" class="selectColor" v-model="selected" :options="optionsR"></b-form-select>
          </b-col>

          <b-col class="mt-4" v-if="testType === 'typeTest'">
            <div align="center">
            <div class="headDiv"> Spelling </div>
            <b-dropdown :text="spelling" variant="outline-dark">
              <div>
                  <b-dropdown-item v-for="(btn, index) in optionsO" :key="index" @click="spelling=btn.value; spellingText=btn.text " > {{ btn.text }} </b-dropdown-item>
              </div>
            </b-dropdown>
            </div>
          </b-col>

          <b-col class="mt-4" v-if="testType === 'typeTest'">
            <div align="center">
              <div class="headDiv"> Sort </div>
            <b-dropdown :text="special" variant="outline-info">
              <div>
                  <b-dropdown-item v-for="(btn, index) in optionsS" :key="index" @click="special=btn.value; specialText=btn.text"> {{ btn.text }} </b-dropdown-item>
              </div>
            </b-dropdown>
            </div>
          </b-col>
        </b-row>
      </div>

      <div>
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
    testType: String,
    title: String
  },
  data () {
    return {
      showToolbar: true,
      wordsReset: '12',
      words: 12,
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
        { value: 0, text: 'normal' },
        { value: 1, text: 'easier words' },
        { value: -1, text: 'harder words' }
      ],
      label: 'lbAn',
      labelOptions: [
        { text: 'answers', value: 'lbAn' },
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
        { text: 'exam mode', value: 'sdEx', class: 'bg-grey' },
        { text: 'auto play', value: 'sdOn' },
        { text: 'None', value: 'sdOff' }
      ],
      spelling: null,
      spellingText: '-------------',
      optionsO: [
        { value: null, text: '---' },
        { value: 'const', text: 'no consonants' },
        { value: 'vowels', text: 'no vowels' },
        { value: 'blanks', text: ' all blanks' },
        { value: 'all', text: 'show all' },
        { value: 'typos', text: 'typos' },
        { value: 'scramble', text: 'scramble' }
        // { value: 'showFL', text: 'words' }
      ],
      specialText: '-------------',
      special: null,
      optionsS: [
        { value: null, text: '---' },
        { value: 'punc.', text: 'punctuation' },
        { value: 'phr.', text: 'phrases' },
        { value: 'abbr.', text: 'abbreviations' },
        { value: 'prop.', text: 'proper nouns' }
      ],
      display: 'text_On',
      displayOptions: [
        { text: 'Chinese', value: 'text_On' },
        { text: 'Label', value: 'label_On' },
        { text: 'None', value: 'all_Off' }
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
      // console.log(this.special)
      if (this.spelling && this.selected === 'abbr.') {
        alert('Cannot make typos with Abbreviations')
        return false
      } else if (this.sound === 'sdTy' && this.selected === 'abbr.') {
        alert('Cannot make typos with Abbreviations')
        return false
      }
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
          if (this.selected === 0 && vocabList[item].totalScore === 0) {
            this.amendedList.push(vocabList[item])
          }
          if (this.selected === 0 && vocabList[item].totalScore === null) {
            this.amendedList.push(vocabList[item])
          }
          if (this.selected === -1 && vocabList[item].totalScore <= -1) {
            this.amendedList.push(vocabList[item])
          }
          if (this.selected === 1 && vocabList[item].totalScore >= 1) {
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
      } else if (this.special === 'punc.') {
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
      if (this.testType === 'typeTest') {
        this.makeSpelling()
      } else {
        this.makeChoices()
      }
    },
    makeChoices: function () {
      let i = 0
      while (i < this.words) {
        var randomItem = this.amendedList[Math.floor(Math.random() * this.amendedList.length)]
        // console.log('MAKE CHOICES', this.testItemsRoot, randomItem, this.checkDuplicate(randomItem))
        if (!this.checkDuplicate(randomItem)) {
          // console.log('pass duplicate')
        } else if (this.sound === 'sdTy' && randomItem.Gr === 'abbr.') {
          // console.log('pass abbr')
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
              // console.log(randomChoice, choices)

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
          // console.log('pass Duplicate')
        } else if (this.spelling && randomItem.Gr === 'abbr.') {
          // console.log('pass abbr')
        } else {
          // CHANGE MADE new code for spelling set up
          let spell = '______________'
          if (this.spelling) {
            // console.log('CHECK', randomItem.Gr)
            spell = wordFix(randomItem.English, this.spelling)
          }

          // console.log('SPELL', spell)
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
    checkDuplicate: function (rand) {
      for (let testEntry in this.testItemsRoot) {
        // console.log('check duplicate', this.testItemsRoot[testEntry].English, rand.English)
        if (this.testItemsRoot[testEntry].English === rand.English) {
          // console.log('found', rand)
          return false
        } else {
          // console.log('clear', rand)
        }
      }
      return true
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

    if (this.testType === 'transCh') {
      this.sortOptions.pop()
      this.soundOptions = [
        { text: 'exam mode', value: 'sdEx' },
        { text: 'typo check', value: 'sdTy' },
        { text: 'off', value: 'sdOff' }
      ]
    }

    if (this.testType === 'typeTest') {
      this.sound = 'sdEn'
      this.soundOptions = [
        { text: 'English', value: 'sdEn' },
        { text: 'Chinese', value: 'sdCh' },
        { text: 'None', value: 'sdOff' }
      ]
    }
    // console.log(this.testType)
    // console.log(this.$store.state.logsRecord.settings)
    if (this.$store.state.logsRecord.settings[this.testType]) {
      let settings = this.$store.state.logsRecord.settings[this.testType]
      for (let item in settings) {
        if (item !== 'type') {
          this[item] = settings[item]
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.form-control {
  background-color:  #bbe0eb;
}

.headDiv {
  background-color:lightgrey;
  width:120px;
  font-weight:500;
  border-radius: 5px;
  border: 0px solid #73AD21;
}

.spinDiv {
  background-color:#bbe0eb;
  width:120px;
  font-weight:500;
  border-radius: 5px;
  border: 0px solid #73AD21;
}

</style>
