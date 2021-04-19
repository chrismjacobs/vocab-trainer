<template>
  <div class="MemoryMatch">
    <audio id="audio"></audio>

      <div class="bg-grape p-2 head" align="center">
            <h2 class="text-cream"> Memory </h2>
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
      </div>

    <ToolbarMatch
    :toolbarShow='showTest'
    :p1="p1" :p2="p2"
    :p1name="p1name" :p2name="p2name"
    :socket="socket" :player="player"
    :waiting="waiting"
    :showAnswers='showAnswers'
    :testType="testType"
    v-on:waitUpdate="waiting=1"
    v-on:settings="updateSettings($event)"
    ></ToolbarMatch>

      <div align="center" class="bg-grey" v-if="showTest">
          <div style="height:30px">
          </div>
          <div v-for="(memcard, idx) in testItems" :key="idx" class="d-inline mt-3">
            <button :class="getCardClass(memcard.caption)"  @click="showCard(memcard.caption, memcard.answer, 'p1')" :id="memcard.caption" style="display:inline-block" :disabled="getDisabled(memcard.caption)">
                <div class="divHeight textLine py-2">
                <span v-if="$store.state.userProfile.userID === 2"> {{ memcard.code }} </span>
                <span v-else-if="!showStatus(memcard.caption)">{{idx + 1}}</span>
                <span v-if="showStatus(memcard.caption) || gameStyle === 'SA1'"> {{ memcard[cardText] }} </span>
                </div>
            </button>
          </div>
          <div style="height:30px">
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
          <div align="right" :id="data.item.English">
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

    <b-modal align="center" ref="win" hide-footer title="Game Over" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> And the winner is... </h3>
        <b-avatar :src="s3 + winner.toString() + '.jpg'"  size="100px" :badge="winName" badge-offset="-0.6em" :badge-variant="winner"></b-avatar>
      </div>
      <br>
      <button :class="'buttonDiv mt-3 text-prime bg-' + player" style="width:60%"  @click="hideModal('win')">Close</button>
    </b-modal>

   <b-modal align="center" ref="draw" hide-footer title="Result" hide-header-close no-close-on-esc no-close-on-backdrop>
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
  name: 'MemoryMatch',
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
    gameOver: Boolean,
    exit: Boolean
  },
  data () {
    return {
      waiting: 0,
      pageHead: 'Memory Match',
      toolbarShow: true,
      showAnswers: false,
      showTest: false,
      showProgress: false,
      timeReset: null,
      ready: [],
      answered: 0,
      answerData: [],
      testItems: [],
      settings: {},
      fields: ['Question', 'Answer'],
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
      audioMarker: null,
      cardMatch: [],
      disabledMarker: false,
      disabledTemp: false,
      foundCard: null,
      foundCard2: null,
      gameStyle: null,
      blocker: false
    }
  },
  methods: {
    addStar: function (word, set) {
      this.$store.dispatch('newStar', {word: word, set: set})
    },
    showWin: function () {
      this.$refs['win'].show()
    },
    showDraw: function () {
      this.$refs['draw'].show()
    },
    hideModal: function (mode) {
      if (mode === 'win') {
        this.$refs['win'].hide()
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
    start: function () {
      // console.log('START', this.player)
      this.showAnswers = false
      this.showProgress = true
      this.answerData = []
      this.showTest = true
      // this.setCountdown()
    },
    readyCheck: function () {
      // console.log('length', this.ready, this.ready.length, this.player)
      if (this.ready.length === 2) {
        this.waiting = 2
        if (this.player === 'p2') {
          this.disabledMarker = true
        }
        let _this = this
        _this.startTimer = setTimeout(function () {
          _this.start()
          // go to true
          _this.waiting = 0
          _this.ready = []
          _this.startTimer = null
        }, 3000)
      }
    },
    getCardClass: function (arg) {
      let found = this.testItems.find(element => element.caption === arg)

      let border = ''

      if (found === this.foundCard || found === this.foundCard2) {
        border = 'borderDiv'
      }

      if (found.match) {
        return 'basic text-prime bg-' + found.player
      } else if (found.show) {
        return 'basic text-prime bg-' + found.player + '-light ' + border
      } else if (this.disabledMarker) {
        return 'basic text-cream bg-darkgrey'
      } else {
        return 'basic text-prime bg-warn-light'
      }
    },
    getDisabled: function (arg) {
      let found = this.testItems.find(element => element.caption === arg)

      if (this.disabledMarker || this.disabledTemp) {
        return true
      } else {
        return found.disabled
      }
    },
    showStatus: function (arg) {
      let found = this.testItems.find(element => element.caption === arg)
      return found.show
    },
    showCard: function (card, answer) {
      this.disabledTemp = true
      console.log('cardMAtch', card, answer, this.cardMatch.toString())
      let match = false
      let count = 1
      // if card and answer are already marked
      if (this.cardMatch.length === 2) {
        if (this.gameStyle.includes('1')) {
          this.disabledMarker = true
        }
        count = 2
        if (this.cardMatch.includes(card)) {
          match = true
        }
        this.cardMatch = []
        this.socket.emit('answerMem', {room: this.p1 + '-' + this.p2, card: card, match: match, answer: answer, player: this.player, count: count})
      } else if (this.cardMatch.length === 0) {
        this.cardMatch.push(answer)
        this.cardMatch.push(card)
        // check length again to stop double entry
        if (this.cardMatch.length === 2) {
          this.socket.emit('answerMem', {room: this.p1 + '-' + this.p2, card: card, match: match, answer: answer, player: this.player, count: count})
        }
      } else {
        this.disabledMarker = true
        this.cardMatch = []
      }
    },
    enterResult: function (question, answer, clicker, state) {
      console.log('ENTER', this.player)

      let _rowVariant = clicker
      let score = 0
      let english = question

      if (this.player === clicker) {
        score = 1
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

      if (this.progressValues.p1 + this.progressValues.p2 === this.testItems.length / 2) {
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
        this.showWin()
      } else if (p2C > p1C) {
        this.winner = 'p2'
        this.winName = this.p2name
        this.showWin()
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
      this.$store.dispatch('updateRecord', { mode: 'matchTrans', answerData: this.answerData, settingsData: this.settings })
      this.showAnswers = true
      this.showTest = false
      this.disabledMarker = false
    },
    updateSettings: function (data) {
      console.log('update active', data)
      this.gameStyle = data.gameStyle
    },
    playAudio: function (arg) {
      console.log('PLAY', arg, this.player)
      let player = document.getElementById('audio')
      player.src = arg
      player.play()
    },
    playAnswer: function (arg) {
      console.log(arg)
      var found = this.dictGet.find(element => element.English === arg)

      console.log('PLAY', found)
      let audioLink = found.mp3en

      if (this.audioMarker) {
        let icon = document.getElementById(this.audioMarker)
        icon.setAttribute('class', '')
      }

      this.audioMarker = arg
      let icon = document.getElementById(arg)

      icon.setAttribute('class', 'text-warn')

      let player = document.getElementById('audio')
      player.src = audioLink
      player.play()
      player.onended = function () {
        icon.setAttribute('class', '')
      }
    },
    leave: function () {
      this.$emit('leave', {})
      // this.socket.emit('exitMatch', { player: this.player, p1: this.p1, p2: this.p2 })
    }
  },
  watch: {
    gameOver: function () {
      this.showTest = false
      this.showAnswers = true
      this.waiting = 3
      clearInterval(this.clock)
    },
    exit: function () {
      this.leave()
    }
  },
  computed: {
    starGet () {
      return this.$store.getters.starGet
    },
    dictGet () {
      return this.$store.getters.makeList
    },
    cardText () {
      if (this.gameStyle === 'SA1') {
        return 'caption'
      } else if (this.gameStyle[0] === 'E') {
        return 'English'
      } else if (this.gameStyle[0] === 'T') {
        return 'caption'
      }
    }
  },
  created () {
    console.log('testType', this.testType)
  },
  beforeDestroy () {
    console.log('LEAVE')
    this.answered = 0
    this.showTest = false
  },
  mounted () {
    let _this = this
    _this.socket.on('go', function (data) {
      console.log('roomReady', data, data.testItems.length)
      _this.room = data.room
      if (data.testItems.length > 0) {
        console.log(data.testItems)
        _this.testItems = data.testItems
        _this.timeReset = data.timeReset * 1000
      }
      if (!_this.ready.includes(data.player)) {
        _this.ready.push(data.player)
        console.log(data.player, _this.ready)
      }
      _this.readyCheck()
    })
    _this.socket.on('answerCard', function (data) {
      _this.disabledTemp = false
      console.log('answerCard', data)
      let found = _this.testItems.find(element => element.caption === data.card)
      let answer = _this.testItems.find(element => element.caption === data.answer)
      console.log('found', found)
      console.log('answer', answer)
      console.log('count', data.count)
      if (data.count === 1) {
        found.disabled = true
        found.show = true
        found.player = data.player
        _this.foundCard = {...found}
      } else if (data.count === 2) {
        found.disabled = true
        found.show = true
        found.player = data.player
        _this.foundCard2 = {...found}
        let xThis = _this
        let originalCard = _this.testItems.find(element => element.caption === _this.foundCard.caption)
        if (!data.match) {
          console.log(111, {..._this.foundCard})
          console.log(222, {..._this.foundCard2})
          _this.disabledMarker = true
          setTimeout(function () {
            found.show = false
            found.player = null
            found.disabled = false
            originalCard.show = false
            originalCard.player = null
            originalCard.disabled = false

            xThis.foundCard.player = null

            xThis.foundCard = null
            xThis.foundCard2 = null
            if (data.player !== xThis.player) {
              xThis.disabledMarker = false
            }
            console.log(xThis.foundCard)
            console.log(xThis.foundCard2)
          }, 2000)
        } else { // if match
          console.log(333, {..._this.foundCard})
          console.log(444, {..._this.foundCard2})

          originalCard.match = true
          originalCard.disabled = true

          found.disabled = true
          found.match = true

          _this.disabledMarker = true
          _this.playAudio(found.sound)
          _this.enterResult(found.English, found.Chinese, data.player, true)

          let xThis = _this
          setTimeout(function () {
            xThis.foundCard = null
            xThis.foundCard2 = null
            if (data.player !== xThis.player && xThis.gameStyle.includes('1')) {
              xThis.disabledMarker = false
            }
            if (data.player === xThis.player && xThis.gameStyle.includes('2')) {
              xThis.disabledMarker = false
            }
            console.log(xThis.foundCard)
            console.log(xThis.foundCard2)
          }, 2000)
        }
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.borderDiv {
  border:4px solid rgb(137, 69, 247) !important;
}

.basic {
  border:4px solid #CCC;
  outline:none;
  border-radius: 5px;
  box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
  cursor:pointer;
  margin: 1px;
  width:24%;
}

@media screen and (max-width:650px) {
  .basic {
    border:4px solid #CCC;
    outline:none;
    border-radius: 5px;
    box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
    cursor:pointer;
    margin: 1px;
    width:48%;
  }
}

.divHeight {
  height: 100px;
}

@media screen and (max-width:650px) {
  .divHeight {
    height: 60px;
  }
}

.textLine {
  vertical-align: middle;
  word-break: break-all;
  font-size: 24px;
}

.basic:active {
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
    border:0px solid #CCC;
    outline:none;
}

.basic:hover {
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
    border:0px solid #CCC;
    outline:none;
}

@media screen and (max-width:650px) {
  .textLine {
  font-size: 16px;
  line-height: 90%;
  }
}

</style>
