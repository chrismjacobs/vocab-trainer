<template>
  <div class="TypeMatch">
    <audio id="audio"></audio>
      <div class="mt-2 bg-grape text-cream p-2">
        <b-row align-h="end">
          <b-col cols="6" align="center">
            <h2> Match </h2>
          </b-col>
          <b-col cols="3" align="right">
            <button @click="leave()" class="buttonDiv bg-warn text-cream mt-2"> <span class="d-none d-md-inline">Exit</span><b-icon-backspace-reverse-fill class="text-cream ml-3" style="float:right"  font-scale="1.5"></b-icon-backspace-reverse-fill> </button>
          </b-col>
        </b-row>
      </div>

      <div class="bg-third">
        <div class="p-3 " style="height:100px">
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
         <b-progress  v-if="showProgress" style="height:20px" :max="1"  class="" show-value>
                <b-progress-bar :value="progressValues.p1" variant="p1"></b-progress-bar>
                <b-progress-bar :value="progressValues.warn" variant="warn-light"></b-progress-bar>
                <b-progress-bar :value="progressValues.p2" variant="p2"></b-progress-bar>
        </b-progress>
       </div>

        <div style="height:20px">
          <b-progress style="height:20px" v-if="time" :value="time" :max="timeReset" variant="grape"></b-progress>
        </div>

      </div>

    <ToolbarMatch
      :toolbarShow='showTest'
      :p1="p1" :p2="p2"
      :p1name="p1name" :p2name="p2name"
      :socket="socket" :player="player"
      :waiting="waiting" :showAnswers='showAnswers'
      :testType="testType"
      v-on:waitUpdate="waiting=1"
      v-on:settings="updateSettings($event)"
    ></ToolbarMatch>

      <div class="bg-grey" v-if="showTest">
          <div v-for="(item, idx) in testItems" :key="idx">
              <div v-if="testItems.indexOf(item) === filter">
                    <br>
                    <b-row class="px-5">
                      <button class="questionDiv bg-second" @click="playAudio(item.sdQue)">
                          <h3>
                            <div>
                              <div v-if="loadNew" :class="'text-center text-cream'">
                                <b-spinner class="align-middle"></b-spinner>
                                Loading...
                              </div>
                              <span v-else v-html="item.Spelling"> </span>
                            </div>
                            <span v-if="sound == 'sdOnly' || sound == 'sdOn' "> <b-icon-soundwave></b-icon-soundwave></span>
                          </h3>
                      </button>
                    </b-row>

                    <b-row class="px-5 mt-3">
                      <button class="answerBtn bg-third" @click="playAudio(item.sdAns)" align="center" >
                          <h3>
                            <span v-html="item.Chinese" ></span>
                          </h3>
                      </button>
                    </b-row>

                     <b-row align-h="center" class="mt-3">
                      <b-col cols="10">
                        <b-form-group>
                          <div align="center">
                            <b-form-input
                            align="center"
                            :style="inputStyle"
                            :class="awayStyle"
                            type="password"
                            disabled
                            id="awayInput"
                            v-model="currentAnswerAway"
                            ></b-form-input>
                          </div>
                        </b-form-group>
                      </b-col>
                    </b-row>

                    <b-row align-h="center" class="mt-3">
                      <b-col cols="10">
                        <b-form-group>
                          <div align="center">
                            <b-form-input
                            align="center"
                            :style="inputStyle"
                            :class="validStyle(feedback)"
                            onblur="this.focus()"
                            autofocus
                            autocapitalize="none"
                            autocomplete="off"
                            v-on:keyup.native.enter="submitAnswer()"
                            id="homeInput"
                            v-model="currentAnswerHome"
                            ></b-form-input>

                            <h5 class="mt-2">
                              ({{currentAnswerHome.length}}/{{answerLength}})
                            </h5>
                          </div>
                        </b-form-group>
                      </b-col>
                    </b-row>

              </div>
          </div>
      </div>

    <div v-if="showAnswers">
      <div class="mt-2">
        <b-table
        striped hover
        :items="answerData"
        :fields="fields"
        >
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
  name: 'TypeMatch',
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
    s3: String
  },
  data () {
    return {
      waiting: 0,
      pageHead: 'Typing Match',
      toolbarShow: true,
      showToolbar: true,
      showAnswers: false,
      showTest: false,
      showProgress: false,
      timeReset: 30,
      hover: false,
      ready: [],
      answered: 0,
      blocker: false,
      loadNew: false,
      answerData: [],
      filter: null,
      testItems: [],
      currentAnswerHome: '',
      currentAnswerAway: '',
      awayStyle: 'text-alert',
      feedback: null,
      sound: null,
      fields: ['English', 'Chinese', 'Time'],
      time: null,
      clock: null,
      progressValues: {
        p1: 0,
        p2: 0,
        warn: 0
      },
      p1score: 0,
      p2score: 0,
      btnIDMarker: null,
      winner: '',
      winName: ''
    }
  },
  methods: {
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
    },
    updateSettings: function (data) {
      console.log('update active', data)
      this.feedback = data.feedback
      this.timeReset = data.timeReset
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
      this.time = this.timeReset
      let _this = this
      this.clock = setInterval(function () {
        if (_this.time === 0) {
          if (_this.clock) {
            _this.recordDraw()
            _this.time -= 100
          }
        } else {
          _this.time -= 100
        }
      }, 100)
    },
    start: function () {
      this.showAnswers = false
      this.showProgress = true
      this.filter = 0
      this.answerData = []
      this.showTest = true
      this.setCountdown()
    },
    readyCheck: function () {
      console.log('length', this.ready, this.ready.length)
      if (this.ready.length === 2) {
        this.waiting = 2
        let _this = this
        setTimeout(function () {
          _this.start()
          // go to true
          _this.waiting = 0
          _this.ready = []
        }, 3000)
      }
    },
    submitAnswer: function () {
      console.log('sub action')
      document.getElementById('homeInput').disabled = true
      this.socket.emit('answerSend', {room: this.p1, answer: this.currentAnswerHome, opponent: this.opponent, player: this.player, state: this.validCheck})
    },
    recordAnswer: function (data) {
      console.log('record action')
      this.loadNew = true
      let count = ((this.timeReset - this.time) / 1000)

      clearInterval(this.clock)
      this.clock = null
      this.time = null

      let _rowVariant = data.player

      let entry = {
        English: this.testItems[this.filter].English,
        Chinese: this.testItems[this.filter].Chinese,
        _rowVariant: _rowVariant,
        Time: count + 's'
      }

      this.progressValues[_rowVariant] += 1
      this.answerData.push(entry)
      this.nextQuestion()
    },
    recordDraw: function () {
      console.log('record draw')
      this.loadNew = true
      clearInterval(this.clock)
      this.clock = null
      this.time = null

      let entry = {
        English: this.testItems[this.filter].English,
        Chinese: this.testItems[this.filter].Chinese,
        _rowVariant: 'warn',
        Time: '---'
      }

      this.progressValues['warn'] += 1
      this.answerData.push(entry)
      this.nextQuestion()
    },
    nextQuestion: function () {
      document.getElementById('homeInput').disabled = true
      document.getElementById('awayInput').type = 'text'
      let _this = this
      setTimeout(function () {
        _this.currentAnswerHome = ''
        _this.currentAnswerAway = ''
        document.getElementById('homeInput').disabled = false
        document.getElementById('awayInput').type = 'password'
        _this.loadNew = false
        _this.answered = 0
        _this.filterToggle()
      }, 3000)
    },
    filterToggle: function () {
      if (this.filter + 1 < this.testItems.length) {
        // console.log(this.filter, this.testItems.length)
        this.filter += 1
        this.setCountdown()
      } else {
        this.filter = null
        this.showTest = false
        this.showProgress = false
        this.blocker = null
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
      // console.log('PLAY', arg)
      let player = document.getElementById('audio')
      player.src = arg
      player.play()
    },
    leave: function () {
      this.socket.emit('exitMatch', { player: this.player, p1: this.p1, p2: this.p2 })
    },
    validStyle: function (feedback) {
      let vCheck = this.validCheck
      let vAns = this.validAnswer

      if (feedback === 'fbComp' && !vCheck) {
        return 'bg-cream'
      } else if (feedback === 'fbComp' && vCheck) {
        return 'bg-safe-light'
      } else if (feedback === 'fbConst' && !vAns) {
        return 'bg-alert-light'
      } else if (feedback === 'fbConst' && vAns) {
        return 'bg-safe-light'
      } else {
        return 'bg-cream'
      }
    }
  },
  watch: {
    filter: function () {
      let sound = this.testItems[this.filter]
      if (sound && this.sound !== 'sdOff') {
        this.playAudio(sound.sdQue)
      }
    },
    currentAnswerHome: function () {
      this.socket.emit('updateType', {room: this.p1, opponent: this.opponent, current: this.currentAnswerHome, player: this.player, state: this.signalStyle})
    }
  },
  computed: {
    inputStyle () {
      let width = this.answerLength + '0%'
      return {'font-size': '30px', width: width, 'text-align': 'center', 'max-width': '100%'}
    },
    headerClass () {
      let header = 'mt-2 p-2 text-prime bg-' + this.player
      return header
    },
    answerLength () {
      let answer = this.testItems[this.filter].English
      return answer.length
    },
    signalStyle () {
      if (this.validAnswer && !this.validCheck) {
        return 'bg-cream text-second'
      } else if (this.validCheck) {
        return 'bg-cream text-safe'
      } else {
        return 'bg-cream text-alert'
      }
    },
    validAnswer () {
      let typed = null
      let currentAnswer = this.currentAnswerHome
      if (currentAnswer !== '') {
        typed = currentAnswer.length
      } else {
        return false
      }

      let answerSub = this.testItems[this.filter].English

      if (currentAnswer === this.testItems[this.filter].English) {
        // console.log('true1')
        return true
      } else if (currentAnswer === answerSub.substr(0, typed)) {
        // console.log('true2')
        return true
      } else if (typed > 0) {
        return false
      }
    },
    validCheck () {
      let answer = this.testItems[this.filter].English
      if (this.currentAnswerHome === answer) {
        return true
      } else {
        return false
      }
    },
    opponent () {
      if (this.player === 'p1') {
        return 'p2'
      } else {
        return 'p1'
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.clock)
    this.clock = null
  },
  mounted () {
    let _this = this
    _this.socket.on('go', function (data) {
      // console.log('roomReady', data, data.testItems.length)
      _this.room = data.room
      if (data.testItems.length > 0) {
        _this.testItems = data.testItems
        _this.timeReset = data.timeReset * 1000
      }
      if (!_this.ready.includes(data.player)) {
        _this.ready.push(data.player)
        // console.log(data.player)
      }
      _this.readyCheck()
    })
    _this.socket.on('updateSignal', function (data) {
      if (_this.player === data.opponent) {
        _this.currentAnswerAway = data.current
        _this.awayStyle = data.state
      }
    })
    _this.socket.on('answerComplete', function (data) {
      if (data.state) {
        if (_this.blocker === data.answer) {
          console.log('blocked')
          return false
        } else {
          _this.blocker = data.answer
        }
        console.log('action 1')
        _this.recordAnswer(data)
      } else if (_this.answered === 0) {
        console.log('action 2')
        document.getElementById('awayInput').type = 'text'
        _this.answered += 1
      } else {
        console.log('action 3')
        _this.recordDraw()
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
