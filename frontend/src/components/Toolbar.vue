<template>
  <div class="toolbar" v-if="!toolbarShow">
    <div>
      <div class="bg-prime p-2 mt-0">
        <b-row>
          <b-col align="center">
            <button class="buttonDiv bg-info text-cream px-3" style="width:45%; height:50px" @click="makeTest(), showToolbar=false"> <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward><span style="font-size:16pt"> NEW</span></button>
          </b-col>
        </b-row>
        <b-row class="mt-2" v-if="showAnswers && !showToolbar"  align="center">
          <b-col>
            <button class="buttonDiv bg-warn text-cream" style="width:100%" @click="retryTest()"> <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise><span style="font-size:16pt"> REDO</span></button>
         </b-col>
          <b-col>
            <button class="buttonDiv bg-grey text-cream" style="width:100%" @click="showToolbar=true"> <b-icon-tools variant="cream" font-scale="1.5"></b-icon-tools><span style="font-size:16pt"> SETUP</span></button>
          </b-col>
        </b-row>
      </div>

      <div :class="getClass('fourth', 'prime', ' p-2 pb-4 mb-3')" v-if="showToolbar">
        <b-row cols="2" :cols-xl="colGet" >
          <b-col class="mt-4">
              <div align="center">
                <div class="headDiv">
                  WORDS
                </div>
                <div class="spinDiv d-none d-sm-block">
                  <b-form-spinbutton v-model="words" min="6" max="30" step=2 vertical style="height:125px"></b-form-spinbutton>
                </div>
                <div class="d-sm-none" v-if="testType != 'typeTest'">
                  <b-form-spinbutton v-model="words" min="6" max="30" step=2 style="width:120px"></b-form-spinbutton>
                </div>
                <div class="spinDiv d-sm-none" v-else>
                  <b-form-spinbutton v-model="words" min="6" max="30" step=2 vertical style="height:125px"></b-form-spinbutton>
                </div>
              </div>
            </b-col>

          <b-col class="mt-4" v-if="testType === 'transEng' || testType === 'transCh'">
              <div align="center">
                <div class="headDiv">
                  CHOICES
                </div>
                <div class="spinDiv d-none d-sm-block">
                <b-form-spinbutton v-model="choices" min="3" max="5" vertical style="height:125px"></b-form-spinbutton>
                </div>
                <div class="d-sm-none">
                <b-form-spinbutton v-model="choices" min="3" max="5" style="width:120px"></b-form-spinbutton>
                </div>
              </div>
          </b-col>

          <b-col class="mt-4">
            <div align="center">
              <div class="headDiv"> <span v-if="testType.includes('Eng') || testType.includes('type')"> SOUND </span> <span v-else> MODE </span> </div><br>
              <b-form-radio-group
                style="width:120px"
                v-model="sound"
                :options="soundOptions"
                button-variant="outline-alert"
                buttons
                stacked
              ></b-form-radio-group>
            </div>
            <br>
            <div align="center"  v-if="testType === 'transEng' || testType === 'transCh'">
              <div class="headDiv"> LABELS </div><br>
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

          <b-col class="mt-4" v-if="testType === 'typeTest'">
            <div align="center">
              <div class="headDiv"> DISPLAY </div><br>
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
              <div class="headDiv"> FEEDBACK </div><br>
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

          <b-col class="mt-4" v-if="testType === 'typeTest'">
            <div align="center">
                <div class="headDiv"> ASSIST </div><br>
              <b-form-radio-group
                style="width:120px"
                v-model="spelling"
                :options="spellingOptions"
                buttons
                button-variant="outline-safe"
                stacked
              ></b-form-radio-group>
            </div>
          </b-col>

          <b-col class="mt-4">
            <div align="center">
                <div class="headDiv"> SORT </div><br>
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

        </b-row>
      </div>

      <div class="helpTab1" v-if="$store.getters.getHelp && showToolbar"> <h6 style="border-bottom: 2px solid grey" v-for="(t, key) in breaker($store.getters.getHelp['Toolbar'][testType])" :key="key"> {{t}} </h6>  </div>
      <div class="helpTab1" v-if="$store.getters.getHelp && !showToolbar"> <h6 style="border-bottom: 2px solid grey" v-for="(t, key) in breaker($store.getters.getHelp['Toolbar']['answers'])" :key="key"> {{t}} </h6>  </div>

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
      label: 'lbOff',
      labelOptions: [
        { text: 'Off', value: 'lbOff' },
        { text: 'On', value: 'lbAn' }
      ],
      sound: 'sdEx',
      soundOptions: [
        { text: 'Exam', value: 'sdEx' },
        { text: 'Auto', value: 'sdOn' },
        { text: 'None', value: 'sdOff' }
      ],
      spelling: '---',
      spellingOptions: [
        { value: '---', text: 'blank' },
        { value: 'blanks', text: 'spaces' },
        { value: 'showFL', text: 'first/last' },
        { value: 'const', text: '+ vowels' },
        { value: 'vowels', text: '- vowels' },
        { value: 'typos', text: 'typos' },
        { value: 'scramble', text: 'scramble' },
        { value: 'all', text: 'show all' }
      ],
      sort: '---',
      sortOptions: [
        { value: '---', text: 'none' },
        { value: '*', text: 'stars' },
        //  { value: 0, text: 'neutral' },
        { value: 1, text: 'easier' },
        { value: -1, text: 'harder' },
        { value: 'misc.', text: 'misc' },
        { value: 'phr.', text: 'phrases' }
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
        this.showToolbar = true
        return false
      } else if (this.sound === 'sdTy' && this.selected === 'abbr.') {
        alert('Cannot make typos with Abbreviations')
        this.showToolbar = true
        return false
      }
      // reset variables
      // console.log('make test', this.sort)
      this.testItemsRoot = []

      // prepare amended list
      let vocabList = JSON.parse(this.stringItems)
      this.amendedList = []

      if (this.sort === '---') {
        this.amendedList = vocabList
      } else if (this.sort === 0) {
        for (let item in vocabList) {
          if (vocabList[item].totalScore === 0 || vocabList[item].totalScore === null) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.sort === -1) {
        for (let item in vocabList) {
          if (vocabList[item].totalScore <= 0) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.sort === 1) {
        for (let item in vocabList) {
          if (vocabList[item].totalScore >= 0) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.sort === '*') {
        for (let item in vocabList) {
          if (this.starGet[vocabList[item].English]) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.sort === 'q') {
        for (let item in vocabList) {
          if (this.quizGet.includes(vocabList[item].English)) {
            this.amendedList.push(vocabList[item])
          }
        }
      } else if (this.sort === 'misc.') {
        console.log('misc set')
        for (let item in vocabList) {
          if (vocabList[item].English.includes('-') ||
              vocabList[item].English.includes("'") ||
              vocabList[item].English.includes('&') ||
              vocabList[item].English.includes('.') ||
              vocabList[item].Gr === 'prop.' ||
              vocabList[item].Gr === 'abbr.'
          ) {
            console.log('misc', vocabList[item])
            if (this.sound === 'sdTy' && vocabList[item].Gr === 'abbr.') {
              console.log('pass abbr.')
            } else {
              this.amendedList.push(vocabList[item])
            }
          }
        }
      } else if (this.sort === 'phr.') {
        for (let item in vocabList) {
          if (vocabList[item].Gr === 'phr.') {
            this.amendedList.push(vocabList[item])
          }
        }
      }
      console.log(this.amendedList.length < 6, this.sort, this.special)
      // check there are enough words available
      if (this.amendedList.length < 6) {
        alert('Not enough words found to test this category')
        this.sort = '---'
        this.makeTest()
        // console.log('few words', this.amendedList)
      } else if (this.amendedList.length < this.words) {
        this.words = this.amendedList.length
      }
      if (this.testType === 'typeTest') {
        console.log('make spelling')
        this.makeSpelling()
      } else {
        console.log('make choices')
        this.makeChoices()
      }
    },
    makeChoices: function () {
      let i = 0
      let newList = this.shuffle(this.amendedList)

      while (i < this.words) {
        let randomItem = newList[i]

        if (!randomItem) {
          // this step is unnecessary now
          // console.log('pass', randomItem)
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

              let foundChoice = choices.find(element => element.English === randomChoice.English)
              // console.log('FOUND', foundChoice)

              if (!foundChoice) {
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
        words: this.words,
        choices: this.choices,
        sort: this.sort
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
      let newList = this.shuffle(this.amendedList)

      while (this.testItemsRoot.length < this.words) {
        let randomItem = newList[i]

        console.log(i, this.words, randomItem)
        var assist = ['showFL', 'const', 'vowels', 'typos', 'scramble']
        if (!randomItem) {
          // this step is unnecessary now
          console.log('pass random', randomItem)
          i++
        } else if (assist.includes(this.spelling) && randomItem.Gr === 'abbr.') {
          // abreviations do not work with spelling assist
          console.log('pass abbr')
          i++
        } else {
          // CHANGE MADE new code for spelling set up
          let spell = '______________'
          if (this.spelling !== '---') {
            console.log('CHECK', randomItem.Gr)
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
        words: this.words,
        choices: this.choices,
        sort: this.sort,
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
    breaker: function (text) {
      var tList = text.split(';')
      return tList
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
  computed: {
    starGet () {
      console.log('starGet', this.$store.state.setRecord.starRecord)
      return this.$store.getters.starGet
    },
    quizGet () {
      console.log('quizGet')
      return this.$store.getters.quizGet
    },
    colGet () {
      if (this.testType === 'typeTest') {
        return 6
      } else {
        return 4
      }
    }
  },
  created () {
    this.alphabet()
    this.tableItems = this.$store.getters.makeList
    this.stringItems = JSON.stringify(this.tableItems)

    if (this.testType === 'transCh') {
      this.soundOptions = [
        { text: 'Exam', value: 'sdEx' },
        { text: 'Spelling', value: 'sdTy' },
        { text: 'Normal', value: 'sdOff' }
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

    if (this.$store.state.userProfile.vocab.includes('apan')) {
      this.spellingOptions = [
        { value: '---', text: 'blank' },
        { value: 'blanks', text: 'spaces' },
        { value: 'scramble', text: 'scramble' },
        { value: 'all', text: 'show all' }
      ]
      if (this.testType === 'transCh') {
        this.soundOptions = [
          { text: 'Exam', value: 'sdEx' },
          { text: 'Normal', value: 'sdOff' }
        ]
      } else if (this.testType === 'typeTest') {
        this.soundOptions = [
          { text: 'Japanese', value: 'sdEn' },
          { text: 'Chinese', value: 'sdCh' },
          { text: 'None', value: 'sdOff' }
        ]
        this.displayOptions = [
          { text: 'Japanese', value: 'text_On' },
          { text: 'Label', value: 'label_On' },
          { text: 'None', value: 'all_Off' }
        ]
      }
    }

    if (this.$store.getters.checkQuiz) {
      this.sortOptions.pop()
      this.sortOptions.pop()
    }

    // if (this.$store.state.activeQuiz) {
    //   this.sortOptions.push({ value: 'q', text: 'QUIZ' })
    // }

    // console.log(this.testType)
    console.log(this.$store.state.logsRecord.settings)
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
