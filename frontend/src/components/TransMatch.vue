<template>
  <div class="TransEng">
    <audio id="audio"></audio>
      <div class="mt-2 bg-grape p-2">
        <b-row align-h="end">
          <b-col cols="6" align="center">
            <h2 class="text-cream"> Match </h2>
          </b-col>
          <b-col cols="3" align="right">
            <button @click="leave()" class="buttonDiv bg-warn text-cream mt-2 "><span class="d-none d-md-inline">Exit</span><b-icon-backspace-reverse-fill class="text-cream mx-2" style="float:right"  font-scale="1.5"></b-icon-backspace-reverse-fill> </button>
          </b-col>
        </b-row>
      </div>

     <div class="bg-second"  v-if="showProgress">
       <div class="bg-third" >
         <b-progress  style="height:30px" :max="1"  class="" show-value>
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

          <div style="height:25px">
            <b-progress v-if="time" :value="time" :max="timeReset" style="height:25px" animated variant="warn"></b-progress>
          </div>

      </div>

    <ToolbarMatch :toolbarShow='showTest' :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :socket="socket" :player="player" :waiting="waiting" :showAnswers='showAnswers' :testType="testType" v-on:waitUpdate="waiting=1"></ToolbarMatch>

      <div v-if="showTest">
       <div v-for="(item, key) in testItems" :key="key">
          <div class="bg-third p-3" @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: 'active1' }" v-if="testItems.indexOf(item) === filter" align="center">
              <h3>
                <span v-if="settings.sound !== 'sdEx' || hover == true"> {{ item.Question }} </span>
                <span v-if="settings.sound == 'sdEx' || settings.sound == 'sdOn'"> <b-icon-soundwave></b-icon-soundwave></span>
              </h3>
          </div>

          <div v-if="testItems.indexOf(item) === filter">
            <div v-for="(choice, index) in item.Choices" :key="index">
              <button class="answerBtn bg-prime text-cream" :name="item.Question" :id="item.Question + choice.Answer" block @click="recordAnswer(item.Question, item.Answer, choice.Answer)">
                {{ choice.Answer }}
              </button>
                <br>
                <br>
            </div>
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
    s3: String
  },
  data () {
    return {
      waiting: 0,
      pageHead: 'Translation Match',
      toolbarShow: true,
      showToolbar: true,
      showAnswers: false,
      showTest: false,
      showProgress: true,
      timeReset: null,
      hover: false,
      ready: [],
      answered: 0,
      answerData: [],
      filter: null,
      testItems: [],
      settings: {},
      fields: ['Question', 'Answer'],
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
          clearInterval(_this.clock)
          _this.recordDisable()
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
      // this.setCountdown()
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
    recordAnswer: function (question, answer, choice) {
      // console.log(data)
      let correct = answer
      // required for disbaling buttons
      let btnID = question + choice
      // show if player was correct of not
      let result = (choice === correct)
      // console.log('RESULT', result)

      this.socket.emit('answer', {room: this.p1, name: question, answer: answer, btnID: btnID, player: this.player, state: result})
    },
    recordDisable: function () {
      // console.log('DISABLE RESULT')

      this.socket.emit('answer', {room: this.p1, name: null, answer: null, btnID: null, player: this.player, state: false})
    },
    disable: function (name, btnID, clicker, state, answer) {
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

        console.log('Stage2', clicker, this.player, state)

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
      clearInterval(this.clock)
      this.answered = 2
      this.time = null
      let _this = this
      setTimeout(function () {
        _this.answered = 0
        _this.enterResult(name, answer, clicker, state)
        _this.filterToggle()
      }, 2000)
    },
    enterResult: function (question, answer, clicker, state) {
      // console.log(state)

      let _rowVariant = 'warn'
      let score = 0

      if (state) {
        _rowVariant = clicker
      }

      let entry = {
        Question: question,
        Answer: answer,
        _rowVariant: _rowVariant,
        Score: score
      }

      this.progressValues[_rowVariant] += 1
      // console.log(_rowVariant, this.progressValues)
      this.answerData.push(entry)
    },
    filterToggle: function () {
      if (this.filter + 1 < this.testItems.length) {
        // console.log(this.filter, this.testItems.length)
        this.filter += 1
      } else {
        // console.log('filterMax')
        // go back to false
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

      this.$store.dispatch('updateMatch', { mode: 'matchTrans', winnerStatus: winnerStatus })
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
    }
  },
  watch: {
    filter: function () {
      let sound = this.testItems[this.filter]
      if (sound && this.sound !== 'sdOff') {
        this.playAudio(sound.sdQue)
      }
    },
    hover: function () {
      if (this.hover === true) {
        // console.log('hover_active')
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdQue)
      }
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  beforeDestroy () {
    clearInterval(this.clock)
    this.clock = null
  },
  mounted () {
    let _this = this
    _this.socket.on('go', function (data) {
      console.log('roomReady', data, data.testItems.length)
      _this.room = data.room
      if (data.testItems.length > 0) {
        _this.testItems = data.testItems
        _this.timeReset = data.timeReset * 1000
      }
      if (!_this.ready.includes(data.player)) {
        _this.ready.push(data.player)
        console.log(data.player)
      }
      _this.readyCheck()
    })
    _this.socket.on('answer', function (data) {
      // check if same button was pressed by each player --> prevent duplicate answer
      if (data.btnID === _this.btnIDMarker) {
        console.log('duplicate answer')
      } else {
        _this.btnIDMarker = data.btnID
        _this.disable(data.name, data.btnID, data.player, data.state, data.answer)
      }
    })
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
