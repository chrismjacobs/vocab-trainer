<template>
  <div class="TransEng">
    <audio id="audio"></audio>

      <div class="bg-grape p-2 head">
        <b-row align-h="end">
          <b-col cols="6" align="center">
            <h2 class="text-cream"> Match </h2>
          </b-col>
          <b-col cols="3" align="right">
            <button @click="leave()" class="buttonDiv bg-alert text-cream mt-1 "><span class="d-none d-md-inline">Exit</span><b-icon-backspace-reverse-fill class="text-cream mx-2" style="float:right"  font-scale="1.5"></b-icon-backspace-reverse-fill> </button>
          </b-col>
        </b-row>
      </div>

     <div class="bg-second">

        <div class="bg-third p-3 " style="height:100px">
             <b-row no-gutters>
               <b-col align="right" class="mr-3">
                 <b-avatar :src="s3 + p1.toString() + '.jpg'"  size="65px" :badge="nameCut(p1name)" badge-offset="-0.6em" badge-variant="p1"></b-avatar>
               </b-col>
               <b-col align="left">
                 <b-badge class="bg-smoke text-prime badge-lg mb-2" style="font-size:20px;width:40px">{{p1score}}</b-badge> <br>
                 <b-avatar v-if="ready.includes('p1')" icon="person-check" variant="safe"></b-avatar>
               </b-col>
               <b-col align="right" class="mr-3">
                  <b-avatar :src="s3 + p2.toString() + '.jpg'" size="65px" :badge="nameCut(p2name)" badge-offset="-0.6em" badge-variant="p2"></b-avatar>
               </b-col>
               <b-col align="left">
                  <b-badge class="bg-smoke text-p2 badge-lg mb-2" style="font-size:20px;width:40px">{{p2score}}</b-badge> <br>
                  <b-avatar v-if="ready.includes('p2')" icon="person-check" variant="safe"></b-avatar>
               </b-col>
             </b-row>
         </div>

          <div style="height:20px">
            <b-progress v-if="showProgress" style="height:20px" :max="1"  class="" show-value>
                    <b-progress-bar :value="progressValues.p1" variant="p1"></b-progress-bar>
                    <b-progress-bar :value="progressValues.warn" variant="warn-light"></b-progress-bar>
                    <b-progress-bar :value="progressValues.p2" variant="p2"></b-progress-bar>
            </b-progress>
          </div>

          <div style="height:20px">
            <b-progress v-if="time" :value="time" :max="timeReset" style="height:20px" variant="grape"></b-progress>
          </div>

      </div>

    <ToolbarMatch :toolbarShow='showTest' :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :socket="socket" :player="player" :waiting="waiting" :showAnswers='showAnswers' :testType="testType" v-on:waitUpdate="waitUpdate=true" v-on:ready="go($event)"></ToolbarMatch>

      <div class="bg-grey" v-if="showTest">
       <div v-for="(item, key) in testItems" :key="key">
          <div class="bg-third p-3" @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: 'active1' }" v-if="testItems.indexOf(item) === filter" align="center">
              <h3>
                <span v-if="settings.sound !== 'sdEx' || hover == true"> {{ item.Question }} </span>
                <span v-if="settings.sound == 'sdEx' || settings.sound == 'sdOn'"> <b-icon-soundwave></b-icon-soundwave></span>
              </h3>
          </div>

          <div v-if="testItems.indexOf(item) === filter"  class="p-3">
            <div v-for="(choice, index) in item.Choices" :key="index">
              <button class="answerBtn bg-prime text-cream" :name="item.Question" :id="item.Question + choice.Answer" block @click="recordAnswer(item.Question, item.Answer, choice.Answer, 'p1')">
                {{ choice.Answer }}
              </button>
                <br>
                <br>
            </div>
          </div>

       </div>
      </div>

    <div class="bg-smoke" v-if="showAnswers">
      <div class="mt-2">
        <b-table
        striped hover
        :items="answerData"
        :fields="fields"
        >
        <template #head(question)="data">
          <div align="right">
            Question
          </div>
        </template>

        <template v-slot:cell(question)="data">
          <div style="float:left">
           <template v-if="data.item.English in starGet">
              <b-icon-star-fill variant="warn" @click="addStar(data.item.English, 0)"></b-icon-star-fill>
            </template>
            <template v-else>
              <b-icon-star variant="grey" @click="addStar(data.item.English, 1)"></b-icon-star>
            </template>
          </div>
          <div align="right">
            <span :id="data.item.Question" @click="playAnswer(data.item.English)"> {{data.item.Question}}</span>
          </div>
        </template>

        <template v-slot:cell(answer)="data">
            <span :id="data.item.Answer" @click="playAnswer(data.item.English)"> {{data.item.Answer}}</span>
        </template>

        </b-table>
      </div>
    </div>

    <b-modal align="center" ref="winner" hide-footer title="Game Over" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> And the winner is... </h3>
        <b-avatar :src="s3 + winner.toString() + '.jpg'"  size="100px" :badge="winName" badge-offset="-0.6em" :badge-variant="winner"></b-avatar>
      </div>
      <br>
      <button :class="'buttonDiv mt-3 text-prime bg-' + player" style="width:60%"  @click="hideModal('winner')">Close</button>
    </b-modal>

   <b-modal align="center" ref="draw" hide-footer title="Problem Found" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> It's a draw! </h3>
      </div>
      <button class="buttonDiv mt-3 bg-warn text-cream" style="width:60%"  @click="hideModal('draw')">Close</button>
    </b-modal>

  </div>
</template>

<script>
import ToolbarMatch from './ToolbarMatch'

export default {
  name: 'TransMatch',
  components: {
    ToolbarMatch
  },
  props: {
    testType: String,
    p1: Number,
    p1name: String,
    p2: Number,
    p2name: String,
    player: String,
    socket: Object,
    s3: String,
    gameOver: Boolean
  },
  data () {
    return {
      waitUpdate: false,
      waiting: 0,
      pageHead: 'Translation Match',
      toolbarShow: true,
      showAnswers: false,
      showTest: false,
      showProgress: false,
      timeReset: null,
      hover: false,
      ready: ['p2'],
      answered: 0,
      answerData: [],
      filter: null,
      testItems: [],
      settings: {},
      fields: ['Question', 'Answer'],
      time: null,
      clock: null,
      clockBlock: false,
      startTimer: null,
      countDown: null,
      progressValues: {
        p1: 0,
        p2: 0,
        warn: 0
      },
      p1score: 0,
      p2score: 0,
      btnIDMarker: null,
      winner: '',
      winName: '',
      AIstart: null,
      audioMarker: null
    }
  },
  methods: {
    go: function (data) {
      console.log('roomReady', data, data.testItems.length)
      if (data.testItems.length > 0) {
        this.testItems = data.testItems
        this.timeReset = data.timeReset * 1000
      }
      console.log(this.timeReset)
      this.waiting = 1
    },
    addStar: function (word, set) {
      this.$store.dispatch('newStar', {word: word, set: set})
    },
    showWinner: function () {
      this.$refs['winner'].show()
    },
    showDraw: function () {
      this.$refs['draw'].show()
    },
    hideModal: function (mode) {
      if (mode === 'winner') {
        this.$refs['winner'].hide()
      } else if (mode === 'draw') {
        this.$refs['draw'].hide()
      }
      this.progressValues.p1 = 0
      this.progressValues.p2 = 0
      this.progressValues.warn = 0
      this.winner = ''
      this.winName = ''
    },
    nameCut: function (name) {
      let cut = name.split(' ')[0]
      if (cut.length > 7) {
        return cut[0]
      } else {
        return cut
      }
    },
    setCountdown: function () {
      console.log('SET', this.player)
      this.time = this.timeReset
      let _this = this
      this.clock = setInterval(function () {
        if (_this.time === 0 && !_this.clockBlock) {
          _this.clockBlock = true
          _this.recordDisable()
          _this.time -= 100
        } else {
          _this.time -= 100
        }
      }, 100)
    },
    start: function () {
      console.log('START', this.player)
      this.showAnswers = false
      this.showProgress = true
      this.filter = 0
      this.answerData = []
      this.showTest = true
      // this.setCountdown()
    },
    recordAnswer: function (question, answer, choice, player) {
      clearTimeout(this.AIstart)
      console.log('RECORD', question, answer, choice, player)
      let correct = answer
      // required for disbaling buttons
      let btnID = question + choice
      // show if player was correct of not
      let result = (choice === correct)
      // console.log('RESULT', result)
      if (result) {
        this.disable(question, btnID, player, true, answer)
      } else {
        this.disable(question, btnID, player, false, answer)
        if (player === 'p1') {
          let _this = this
          setTimeout(function () {
            _this.AIanswer(choice)
          }, 2000)
        }
      }
    },
    AIanswer: function (choice) {
      console.log('answerSet', this.testItems[this.filter], choice)
      let answerSet = JSON.parse(JSON.stringify(this.testItems[this.filter]))
      let choices = this.AIshuffle(answerSet['Choices'])
      let rand = this.getRandomInt(3)
      console.log('rand', rand)
      if (rand === 0) {
        this.recordAnswer(answerSet['Question'], answerSet['Answer'], answerSet['Answer'], 'p2')
      } else if (choices[0]['Answer'] !== answerSet['Answer'] && choices[0]['Answer'] !== choice) {
        this.recordAnswer(answerSet['Question'], answerSet['Answer'], choices[0]['Answer'], 'p2')
      } else if (choices[1]['Answer'] !== choice) {
        this.recordAnswer(answerSet['Question'], answerSet['Answer'], choices[1]['Answer'], 'p2')
      }
    },
    AIshuffle: function (array) {
      // Fisher-Yates shuffle
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    },
    getRandomInt: function (max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    recordDisable: function () {
      // no answer from opponent so all disable before next question
      console.log('DISABLE RESULT', this.player)
      clearInterval(this.clock)
      this.clockBlock = false
      this.disable(this.testItems[this.filter]['Answer'], null, 'p1', false, null)
    },
    disable: function (name, btnID, clicker, state, answer) {
      console.log('DISABLE', this.player, btnID, name)
      let btnClass = 'bg-' + clicker + '-light'
      let button = document.getElementById(btnID)

      if (button) {
        // deal normal answer
        if (state) {
          button.classList.add('correct')
        } else {
          button.classList.add('mistake')
        }
        button.classList.add(btnClass)
        button.disabled = true
        let buttons = document.getElementsByName(name)

        // console.log('Stage2', clicker, this.player, state, buttons, name)

        if (clicker === this.player) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true
          }
        } else if (state) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true
          }
        }
      } else {
        name = this.testItems[this.filter].Question
        answer = this.testItems[this.filter].Answer
        console.log('Stage3', name, answer)
        let buttons = document.getElementsByName(name)
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true
        }
      }
      // console.log(state, this.answered)
      if (state || this.answered === 1) {
        this.answered = 1
        this.nextQuestion(name, answer, clicker, state)
      } else if (this.answered === 0) {
        // first answer is false so start timer
        this.answered = 1
        this.setCountdown()
      } else {
        // console.log('LOGIC ERROR')
      }
    },
    nextQuestion: function (name, answer, clicker, state) {
      console.log('NEXT', this.player)
      clearInterval(this.clock)
      this.answered = 2
      this.time = null
      let _this = this
      _this.countdown = setTimeout(function () {
        console.log('TIMEOUT')
        _this.answered = 0
        _this.enterResult(name, answer, clicker, state)
        _this.filterToggle()
        _this.countDown = null
      }, 2000)
    },
    enterResult: function (question, answer, clicker, state) {
      console.log('ENTER', this.player)

      let _rowVariant = 'warn'
      let score = 0
      let english = question

      if (state) {
        _rowVariant = clicker
        score = 1
      }

      if (this.testType[5] === 'C') {
        english = answer
      }

      let entry = {
        Question: question,
        Answer: answer,
        _rowVariant: _rowVariant,
        Score: score,
        English: english
      }

      this.progressValues[_rowVariant] += 1
      // console.log(_rowVariant, this.progressValues)
      this.answerData.push(entry)
    },
    AIstartclock: function () {
      let _this = this
      this.AIstart = setTimeout(function () {
        console.log('AI start')
        _this.AIanswer()
      }, 2000)
    },
    filterToggle: function () {
      console.log('FILTER', this.player)
      if (this.filter + 1 < this.testItems.length) {
        // console.log(this.filter, this.testItems.length)
        this.filter += 1
        this.AIstartclock()
      } else {
        // console.log('filterMax')
        // go back to false
        this.filter = null
        this.showTest = false
        this.showProgress = false
        this.checkAnswers()
      }
    },
    checkAnswers: function () {
      console.log('CHECK', this.player)

      let p1C = this.progressValues.p1
      let p2C = this.progressValues.p2

      this.p1score += this.progressValues.p1
      this.p2score += this.progressValues.p2

      if (p1C > p2C) {
        this.winner = 'p1'
        this.winName = this.p1name
        this.showWinner()
      } else if (p2C > p1C) {
        this.winner = 'p2'
        this.winName = this.p2name
        this.showWinner()
      } else {
        this.showDraw()
      }

      let winnerStatus
      if (p1C === p2C) {
        winnerStatus = 0
      } else if (p1C > p2C && this.player === 'p1') {
        winnerStatus = 1
      } else if (p2C > p1C && this.player === 'p2') {
        winnerStatus = 1
      } else {
        winnerStatus = -1
      }

      this.$store.dispatch('updateMatch', { mode: 'matchTrans', winnerStatus: winnerStatus })
      this.showAnswers = true
    },
    playAudio: function (arg) {
      // console.log('PLAY', arg, this.player)
      let player = document.getElementById('audio')
      player.src = arg
      player.play()
    },
    playAnswer: function (arg) {
      var result = this.dictGet.filter(obj => {
        return obj.English === arg
      })
      console.log('PLAY', result)

      if (this.audioMarker) {
        let icon = document.getElementById(this.audioMarker)
        icon.setAttribute('class', '')
      }

      this.audioMarker = arg
      let icon = document.getElementById(arg)

      icon.setAttribute('class', 'text-warn')

      let audioLink = result[0].mp3en
      let player = document.getElementById('audio')
      player.src = audioLink
      player.play()
      player.onended = function () {
        icon.setAttribute('class', '')
      }
    },
    leave: function () {
      this.$emit('leave', {})
    }
  },
  computed: {
    starGet () {
      return this.$store.getters.starGet
    },
    dictGet () {
      return this.$store.getters.makeList
    }
  },
  watch: {
    filter: function () {
      let sound = this.testItems[this.filter]
      if (sound && this.sound !== 'sdOff') {
        this.playAudio(sound.sdQue)
      }
    },
    gameOver: function () {
      this.showTest = false
      this.showAnswers = true
      this.waiting = 3
      clearInterval(this.clock)
    },
    hover: function () {
      if (this.hover === true) {
        // console.log('hover_active')
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdQue)
      }
    },
    waiting: function () {
      let _this = this
      if (this.waiting === 1) {
        this.waiting = 2
        this.ready.push('p1')
        setTimeout(function () {
          _this.showTest = true
          _this.ready = ['p2']
          _this.waiting = 0
          _this.start()
        }, 2000)
      }
    }
  },
  beforeDestroy () {
    console.log('LEAVE')
    this.answered = 0
    this.filter = null
    this.showTest = false

    if (this.clock) {
      clearInterval(this.clock)
      this.clock = null
    }
    if (this.startTimer) {
      clearTimeout(this.startTimer)
      this.startTimer = null
    }
    if (this.countDown) {
      clearTimeout(this.countDown)
      this.countDown = null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.mistake {
  border:4px solid #d35944;
  color: #205372 !important
}

.correct {
  border:4px solid #48c490;
  color: #205372 !important
}

</style>
