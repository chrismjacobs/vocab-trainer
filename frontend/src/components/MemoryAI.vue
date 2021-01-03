<template>
  <div class="MemoryMatch">
    <audio id="audio"></audio>

      <div class="bg-grape p-2 head">
        <b-row align-h="end">
          <b-col  class="d-none d-lg-inline">
          </b-col>
          <b-col align="center">
            <h2 class="text-cream"> Memory </h2>
          </b-col >
          <b-col class="d-none d-lg-inline" align="right">
            <button @click="leave()" class="buttonDiv bg-cream text-alert mt-1 mr-3" style="height:40px; width:100px"><span style="font-size:16pt" class="mr-2 mb-1">Exit</span><b-icon-backspace-reverse-fill  font-scale="1.5"></b-icon-backspace-reverse-fill> </button>
          </b-col>
        </b-row>
      </div>

     <div class="bg-second">

        <div class="bg-third p-3" style="height:100px">
             <b-row no-gutters>
               <b-col align="right" class="mr-3">
                 <b-avatar :src="s3 + p1.toString() + '.jpg'"  size="65px" :badge="nameCut(p1name)" badge-offset="-0.6em" badge-variant="p1"></b-avatar>
               </b-col>
               <b-col align="left">
                 <b-badge class="bg-smoke text-prime badge-lg mb-2" style="font-size:20px;width:40px">{{p1score}}</b-badge> <br>
                 <b-avatar v-if="ready.includes('p1')" icon="person-check" variant="safe"></b-avatar>
               </b-col>
               <b-col align="right" class="mr-3">
                  <b-avatar :src="getBot[0]" size="65px" :badge="getBot[1]" badge-offset="-0.6em" badge-variant="p2"></b-avatar>
               </b-col>
               <b-col align="left">
                  <b-badge class="bg-smoke text-p2 badge-lg mb-2" style="font-size:20px;width:40px">{{p2score}}</b-badge> <br>
                  <b-avatar v-if="ready.includes('p2')" icon="person-check" variant="safe"></b-avatar>
               </b-col>
             </b-row>
         </div>

          <div style="height:20px">
            <b-progress v-if="showProgress" style="height:20px" :max="1" show-value>
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
    v-on:waitUpdate="waitUpdate=true"
    v-on:settings="updateSettings($event)"
    v-on:ready="go($event)"
    ></ToolbarMatch>

      <div align="center" class="bg-grey" v-if="showTest">
          <div style="height:30px">
          </div>
          <div v-for="(memcard, idx) in testItems" :key="idx" class="d-inline mt-3">
            <button :class="getCardClass(memcard.caption)"  @click="showCard(memcard.caption, memcard.answer, 'p1')" :id="memcard.caption" style="display:inline-block" :disabled="getDisabled(memcard.caption)">
                <div class="divHeight testLine py-2">
                <span v-if="$store.state.userProfile.userID === 1"> {{ memcard.code }} </span>
                <span v-if="showStatus(memcard.caption) || gameStyle === 'SA1'">
                  {{ memcard[cardText] }}
                </span>
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

    <b-modal align="center" ref="win" hide-footer title="Game Over" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <b-avatar :src="getBot[0]" size="100px"></b-avatar>
        <h3>{{getMessage('win')}} </h3></div>
      <br>
      <button :class="'buttonDiv mt-3 text-prime bg-' + player" style="width:60%"  @click="hideModal('win')">Close</button>
    </b-modal>

    <b-modal align="center" ref="lose" hide-footer title="Game Over" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <b-avatar :src="getBot[0]" size="100px"></b-avatar>
        <h3>{{getMessage('lose')}} </h3>
      </div>
      <br>
      <button :class="'buttonDiv mt-3 text-cream bg-alert'" style="width:60%"  @click="hideModal('lose')">Close</button>
    </b-modal>

   <b-modal align="center" ref="draw" hide-footer title="Result" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> It's a draw! </h3>
      </div>
      <button class="buttonDiv mt-3 bg-warn text-cream" style="width:60%"  @click="hideModal('draw')">Close</button>
    </b-modal>

   <b-modal align="center" ref="complete" hide-footer title="CONGRATULATIONS" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <b-avatar :src="getBot[0]" size="100px"></b-avatar>
        <h3> You have defeated AI Bot! </h3>
      </div>
      <button class="buttonDiv mt-3 bg-safe text-cream" style="width:60%"  @click="hideModal('complete')">Close</button>
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
      waitUpdate: false,
      waiting: 0,
      pageHead: 'Memory Match AI',
      toolbarShow: true,
      showAnswers: false,
      showTest: false,
      showProgress: false,
      timeReset: null,
      hover: false,
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
      foundCard: null,
      foundCard2: null,
      gameStyle: null,
      botLevel: 1
    }
  },
  methods: {
    botLevelSetter: function (player) {
      // console.log('botLevel', this.botLevel, player)
      if (player === 'p1' && this.botLevel < 4) {
        this.botLevel += 1
      } else if (player === 'p1' && this.botLevel === 4) {
        this.botLevel = 5
        this.showComplete()
      } else if (player === 'p2' && this.botLevel !== 1) {
        this.botLevel -= 1
      }
    },
    go: function (data) {
      // console.log('roomReady', data, data.testItems.length)
      if (data.testItems.length > 0) {
        this.testItems = data.testItems
      }
      console.log(this.timeReset)
      this.waiting = 1
    },
    addStar: function (word, set) {
      this.$store.dispatch('newStar', {word: word, set: set})
    },
    showWin: function () {
      this.$refs['win'].show()
    },
    showLose: function () {
      this.$refs['lose'].show()
    },
    showDraw: function () {
      this.$refs['draw'].show()
    },
    showComplete: function () {
      this.$refs['complete'].show()
    },
    hideModal: function (mode) {
      if (mode === 'win') {
        this.$refs['win'].hide()
      } else if (mode === 'lose') {
        this.$refs['lose'].hide()
      } else if (mode === 'draw') {
        this.$refs['draw'].hide()
      } else if (mode === 'complete') {
        this.$refs['complete'].hide()
        this.leave()
      }
      this.progressValues.p1 = 0
      this.progressValues.p2 = 0
      this.progressValues.warn = 0
      this.winner = ''
      this.winName = ''
    },
    getMessage: function (arg) {
      let messageSet = []
      if (arg === 'win') {
        messageSet = [
          "So you think you're smart? Keep it up and I'll level up",
          'Nice work, my memory is not as good as it used to be',
          'Pretty good so far, maybe I should try cheating?'
        ]
      } else {
        messageSet = [
          'Well, I guess you need more practice',
          "You lose, don't feel bad, I'm pretty good at this",
          'Too bad, not many people can best me'
        ]
      }
      let q = '"'

      return q + this.AIshuffle(messageSet)[0] + q
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

      if (this.disabledMarker) {
        return true
      } else {
        return found.disabled
      }
    },
    showStatus: function (arg) {
      let found = this.testItems.find(element => element.caption === arg)
      return found.show
    },
    showCard: function (card, answer, player) {
      // console.log('cardMAtch', card, answer, this.cardMatch)
      let match = false
      let count = 1
      // if card and answer are already marked
      if (this.cardMatch.length === 2) {
        this.disabledMarker = true
        count = 2
        if (this.cardMatch.includes(card)) {
          match = true
        }
        this.cardMatch = []
        this.recordAnswer({card: card, match: match, answer: answer, player: player, count: count})
      } else if (this.cardMatch.length === 0) {
        // add card and answer for checking
        this.cardMatch.push(answer)
        this.cardMatch.push(card)
        this.recordAnswer({card: card, match: match, answer: answer, player: player, count: count})
      } else {
        this.disabledMarker = true
        this.cardMatch = []
      }
    },
    showCardAI: function () {
      var unmatchedCards = this.testItems.filter(obj => {
        return obj.match === false
      })

      let shuffledOptions = this.AIshuffle(unmatchedCards)

      let levelSet = [ null, 4, 3, 2, 1 ]
      // level one will return 0,1,2,3 == 25% chance
      // level four will return 0
      let rand

      if (shuffledOptions.length >= this.testItems.length - 2) {
        rand = 1 // can never be right until one match found
      } else {
        rand = this.getRandomInt(levelSet[this.botLevel])
      }

      let correct
      let answerChoice
      let choiceCard = shuffledOptions[0]
      let answerCard = shuffledOptions.find(element => element.caption === choiceCard.answer)
      if (rand === 0 || shuffledOptions.length < 4) {
        correct = true
        answerChoice = answerCard
      } else {
        correct = false
        if (shuffledOptions[1] !== answerCard) {
          answerChoice = shuffledOptions[1]
        } else {
          answerChoice = shuffledOptions[2]
        }
      }

      let _this = this
      setTimeout(function () {
        choiceCard.match = correct
        choiceCard.disabled = correct
        choiceCard.show = true
        choiceCard.player = 'p2'
        _this.foundCard = choiceCard
        setTimeout(function () {
          answerChoice.match = correct
          answerChoice.disabled = correct
          answerChoice.show = true
          answerChoice.player = 'p2'
          _this.foundCard2 = answerChoice
          if (correct) {
            _this.playAudio(answerChoice.sound)
          }
          setTimeout(function () {
            if (correct) {
              _this.enterResult(choiceCard.English, choiceCard.Chinese, 'p2', true)
            } else {
              choiceCard.show = false
              answerChoice.show = false
            }
            _this.foundCard = null
            _this.foundCard2 = null
            if (correct && _this.gameStyle.includes('1')) {
              _this.disabledMarker = false
            } else if (correct && _this.gameStyle.includes('2') && shuffledOptions.length > 2) {
              _this.showCardAI()
            } else {
              _this.disabledMarker = false
            }
          }, 2000)
        }, 1000)
      }, 1000)
    },
    getRandomInt: function (max) {
      // 3 --> return  0,1,2
      // 2 --> return  0,1
      // 1 --> 0
      return Math.floor(Math.random() * Math.floor(max))
    },
    AIshuffle: function (array) {
      // Fisher-Yates shuffle
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    },
    recordAnswer: function (data) {
      let _this = this
      console.log('answerCard', data)
      let found = _this.testItems.find(element => element.caption === data.card)
      let answer = _this.testItems.find(element => element.caption === data.answer)
      console.log(found, answer)
      if (data.count === 1) {
        found.show = true
        found.player = data.player
        found.disabled = true
        _this.foundCard = found
      } else if (data.count === 2) {
        found.show = true
        found.player = data.player
        found.disabled = true
        _this.foundCard2 = found
        if (!data.match) {
          _this.disabledMarker = true
          setTimeout(function () {
            found.show = false
            _this.foundCard.show = false
            found.player = null
            _this.foundCard.player = null
            found.disabled = false
            _this.foundCard.disabled = false
            _this.foundCard = null
            _this.foundCard2 = null
            _this.showCardAI()
          }, 2000)
        } else { // if match
          _this.disabledMarker = true
          found.disabled = true
          _this.foundCard.disabled = true
          found.match = true
          _this.foundCard.match = true
          _this.playAudio(found.sound)
          _this.enterResult(found.English, found.Chinese, data.player, true)
          setTimeout(function () {
            _this.foundCard = null
            _this.foundCard2 = null
            if (_this.gameStyle.includes('2')) {
              _this.disabledMarker = false
            } else {
              _this.showCardAI()
            }
          }, 2000)
        }
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
        this.botLevelSetter('p1')
        this.showWin()
      } else if (p2C > p1C) {
        this.winner = 'p2'
        this.winName = this.p2name
        this.showWin()
        this.botLevelSetter('p2')
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

      this.botLevelSetter()
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
    },
    waiting: function () {
      let _this = this
      if (this.waiting === 1) {
        this.waiting = 2
        this.ready.push('p1')
        setTimeout(function () {
          _this.showTest = true
          _this.ready = []
          _this.waiting = 0
          _this.start()
        }, 2000)
      }
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
    },
    getBot () {
      let img = {
        1: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/avatar/robot_05.PNG',
        2: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/avatar/robot_06.PNG',
        3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/avatar/robot_07.PNG',
        4: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/100000/avatar.jpg',
        5: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/avatar/robot_08.PNG'
      }
      let name = {
        1: 'Level1',
        2: 'Level2',
        3: 'Level3',
        4: 'Level4',
        5: 'Level5'
      }
      return [img[this.botLevel], name[this.botLevel]]
    }
  },
  created () {
    console.log('testType', this.testType)
  },
  beforeDestroy () {
    console.log('LEAVE')
    this.answered = 0
    this.showTest = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.borderDiv {
  border:4px solid #48c490 !important;
}

.basic {
  border:0px solid #CCC;
  outline:none;
  border-radius: 5px;
  box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
  cursor:pointer;
  margin: 1px;
  width:24%;
}

@media screen and (max-width:650px) {
  .basic {
    border:0px solid #CCC;
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
