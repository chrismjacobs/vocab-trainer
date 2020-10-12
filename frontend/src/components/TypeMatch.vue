<template>
  <div class="TypeMatch">
    <audio id="audio"></audio>
      <div class="mt-2 bg-second p-2">
        <b-row align-h="end">
          <b-col cols="6" align="center">
            <h2 class="text-cream" > Match </h2>
          </b-col>
          <b-col cols="3" align="right">
            <button @click="leave()" class="buttonDiv bg-warn text-cream"> Exit <b-icon-backspace-reverse-fill class="text-cream ml-3" style="float:right"  font-scale="1.5"></b-icon-backspace-reverse-fill> </button>
          </b-col>
        </b-row>
      </div>

      <div class="bg-second" v-if="showProgress">
       <div class="bg-third" >
         <b-progress  style="height:20px" :max="1"  class="" show-value>
                <b-progress-bar :value="progressValues.p1" variant="p1"></b-progress-bar>
                <b-progress-bar :value="progressValues.warn" variant="warn-light"></b-progress-bar>
                <b-progress-bar :value="progressValues.p2" variant="p2"></b-progress-bar>
        </b-progress>
       </div>

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

          <div style="height:30px">
            <b-progress v-if="time" :value="time" :max="timeReset" variant="warn"></b-progress>
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
                      <button class="questionDiv bg-warn" @click="playAudio(item.sdQue)">
                          <h3>
                            <div>
                              <span v-html="item.Spelling"> </span>
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

                     <b-row align-h="center" class="mt-4">
                      <b-col cols="10">
                        <b-form-group>
                          <div>
                            <b-form-input
                            align="center"
                            style="font-size:30px;width:100%;text-align:center"
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

                    <b-row align-h="center" class="mt-4">
                      <b-col cols="10">
                        <b-form-group>
                          <div>
                            <b-form-input
                            align="center"
                            style="font-size:30px;width:100%;text-align:center"
                            :class="validStyle(feedback)"
                            onblur="this.focus()"
                            autofocus
                            autocapitalize="none"
                            autocomplete="off"
                            v-on:keyup.native.enter="submitAnswer()"
                            id="homeInput"
                            v-model="currentAnswerHome"
                            ></b-form-input>
                          </div>
                        </b-form-group>
                      </b-col>
                    </b-row>

                    <b-row style="height:800px">
                      <b-col>
                        <div v-if="loadNew" :class="'text-center text-primary'">
                          <b-spinner class="align-middle"></b-spinner>
                          <strong>Loading...</strong>
                        </div>
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
      showProgress: true,
      timeReset: 30,
      hover: false,
      ready: [],
      answered: 0,
      blocker: false,
      loadNew: false,
      answerData: [],
      filter: null,
      testItems: [],
      currentAnswerHome: null,
      currentAnswerAway: null,
      awayStyle: 'bg-alert-light',
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
      btnIDMarker: null
    }
  },
  methods: {
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
          }
        } else {
          _this.time -= 100
        }
      }, 100)
    },
    start: function () {
      this.showAnswers = false
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
      if (!this.blocker) {
        console.log('sub action')
        document.getElementById('homeInput').disabled = true
        this.socket.emit('answerSend', {room: this.p1, opponent: this.opponent, player: this.player, state: this.validCheck})
      } else {
        console.log('too late')
      }
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
        _this.filterToggle()
      }, 3000)
    },
    filterToggle: function () {
      if (this.filter + 1 < this.testItems.length) {
        // console.log(this.filter, this.testItems.length)
        this.answered = 0
        this.blocker = false
        this.filter += 1
        this.setCountdown()
      } else {
        this.answered = 0
        this.blocker = false
        this.filter = null
        this.showTest = false
        this.checkAnswers()
      }
    },
    checkAnswers: function () {
      this.p1score += this.progressValues.p1
      this.p2score += this.progressValues.p2
      let winnerStatus
      if (this.p1score === this.p2score) {
        winnerStatus = 0
      } else if (this.p1score >= this.p2score && this.player === 'p1') {
        winnerStatus = 1
      } else if (this.p2score >= this.p1score && this.player === 'p2') {
        winnerStatus = 1
      } else {
        winnerStatus = -1
      }

      let matchData = { mode: 'matchType', winnerStatus: winnerStatus }
      console.log(matchData)

      this.$store.dispatch('updateMatch', matchData)
      this.progressValues.p1 = 0
      this.progressValues.p2 = 0
      this.progressValues.warn = 0
      this.showAnswers = true
    },
    playAudio: function (arg) {
      // console.log('PLAY', arg)
      let player = document.getElementById('audio')
      player.src = arg
      player.play()
    },
    leave: function () {
      this.answered = 0
      this.filter = null
      this.showTest = false
      this.$emit('leaveMatch')
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
      this.socket.emit('updateType', {room: this.p1, opponent: this.opponent, current: this.currentAnswerHome, player: this.player, state: this.validStyle('fbConst')})
    }
  },
  computed: {
    validAnswer () {
      let typed = null
      let currentAnswer = this.currentAnswerHome
      if (currentAnswer) {
        typed = currentAnswer.length
      } else {
        return false
      }

      let answerSub = this.testItems[this.filter].English

      if (currentAnswer === this.testItems[this.filter].English ||
          currentAnswer === this.testItems[this.filter].English + ' ') {
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
      if (this.currentAnswerHome === answer || this.currentAnswerHome === answer + ' ') {
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
        console.log('action 1')
        _this.blocker = true
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
