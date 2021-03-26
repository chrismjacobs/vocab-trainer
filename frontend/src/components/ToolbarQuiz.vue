<template>
  <div class="toolbar" v-if="!toolbarShow">
          <div class="bg-prime p-2 mt-0">
            <b-row>
              <b-col align="center" cols="3">
              </b-col>
              <b-col align="center">
                <button class="buttonDiv bg-info text-cream px-3 mr-3" style="width:100%; height:50px" @click="showWarn(), showToolbar=false"> <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward><span style="font-size:16pt"> START</span></button>
              </b-col>
              <b-col align="center" cols="3">
                <button class="buttonDiv bg-alert px-3 text-cream" style="height:50px" @click="$emit('cancel')"> X </button>
              </b-col>
            </b-row>
          </div>

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="warning" hide-footer title="Quiz Mode">
      <div class="d-block">
        <h3> There are {{ words }} words in this quiz </h3>
        <h6> If you exit the quiz early your grade will be incomplete </h6>
      </div>
      <button class="buttonDiv mt-3 bg-second text-cream" style="width:60%"  @click="hideWarn('start')">Start</button>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:40%"  @click="hideWarn('cancel')">Cancel</button>

      </b-modal>

  </div>
</template>

<script>
import { getTypos, wordFix } from '@/utils'

export default {
  name: 'ToolbarQuiz',
  props: {
    toolbarShow: Boolean,
    showAnswers: Boolean,
    testType: String,
    index: String
  },
  data () {
    return {
      showToolbar: true,
      wordsReset: '12',
      choices: 4,
      retry: false,
      testItemsRoot: [],
      amendedList: [],
      vocabList: [],
      selected: null,
      toolbarSettings: {},
      optionsA: [{ value: null, text: '---' }],
      label: 'lbOff',
      sound: 'sdOff',
      spelling: '---',
      sort: 'q',
      display: 'text_On',
      feedback: 'fbNone'
    }
  },
  methods: {
    showWarn: function () {
      this.$refs['warning'].show()
    },
    hideWarn: function (mode) {
      console.log('hideWarn')
      if (mode === 'start') {
        this.$refs['warning'].hide()
        this.makeTest()
      } else {
        this.$refs['warning'].hide()
      }
      // start
    },
    makeTest: function () {
      console.log('make test')
      this.testItemsRoot = []

      // prepare amended list
      this.vocabList = JSON.parse(this.stringItems)
      this.amendedList = []

      for (let item in this.vocabList) {
        if (this.quizList.includes(this.vocabList[item].English)) {
          this.amendedList.push(this.vocabList[item])
        }
      }

      if (this.testType === 'typeTest') {
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
      let listBank

      if (this.testType.includes('E>')) {
        question = 'English'
        answer = 'Chinese'
        sdQue = 'mp3en'
        sdAns = 'mp3ch'
        listBank = this.vocabList
      } else {
        question = 'Chinese'
        answer = 'English'
        sdQue = 'mp3ch'
        sdAns = 'mp3en'
        listBank = this.amendedList
      }

      let i = 0
      let newList = this.shuffle(this.amendedList)
      // console.table(newList)

      while (i < this.words) {
        let randomItem = newList[i]

        if (!randomItem) {
          // this step is unnecessary now
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
            let randomChoice = listBank[Math.floor(Math.random() * listBank.length)]

            let foundChoice = choices.find(element => element.Question === randomChoice[question])
            // console.log('FOUND', foundChoice)

            if (!foundChoice) {
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

      this.toolbarSettings = {
        type: this.testType,
        sound: this.sound,
        label: this.label,
        words: this.words,
        choices: this.choices,
        sort: this.sort
      }
      console.log('emit')

      this.$emit('newTest', {
        test: this.testItemsRoot,
        settings: JSON.stringify(this.toolbarSettings)
      })
    },
    makeSpelling: function () {
      let i = 0
      let newList = this.shuffle(this.amendedList)

      while (i < this.words) {
        let randomItem = newList[i]

        if (!randomItem) {
          // this step is unnecessary now
          // console.log('pass', randomItem)
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
        words: this.words,
        choices: this.choices,
        sort: this.sort,
        spelling: this.spelling,
        display: this.display,
        feedback: this.feedback
      }

      this.$emit('newTest', {
        test: this.testItemsRoot,
        type: this.testType,
        settings: JSON.stringify(this.toolbarSettings)
      })
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
    shuffle: function (array) {
      // Fisher-Yates shuffle
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
  },
  computed: {
    testRecords () {
      return this.$store.state.instructor.testRecords
    },
    activeQuiz () {
      return this.$store.state.instructor.activeQuiz
    },
    quizList () {
      console.log('quizList', this.index, this.$store.state.instructor.testRecords[this.index])
      return this.$store.state.instructor.testRecords[this.index].list
    },
    words () {
      return this.quizList.length
    }
  },
  created () {
    this.tableItems = this.$store.getters.makeList
    this.stringItems = JSON.stringify(this.tableItems)
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
