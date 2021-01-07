<template>
  <div class="TransEng">
    <audio id="audio"></audio>

      <div class="bg-grape p-2 head" align="center">
            <h2 class="text-cream"> AI Match </h2>
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
                  <b-avatar :src="getBot[0]" size="65px" :badge="getBot[1]" badge-offset="-0.6em" badge-variant="p2"></b-avatar>
               </b-col>
               <b-col align="left">
                  <b-badge class="bg-smoke text-p2 badge-lg mb-2" style="font-size:20px;width:40px">{{p2score}}</b-badge> <br>
                  <b-avatar v-if="ready.includes('p2')" icon="person-check" variant="safe"></b-avatar>
               </b-col>
             </b-row>
         </div>

          <div>
            <b-progress style="height:20px" :max="1"  class="" show-value>
                    <b-progress-bar :value="progressValues.p1" variant="p1"></b-progress-bar>
                    <b-progress-bar :value="progressValues.warn" variant="warn-light"></b-progress-bar>
                    <b-progress-bar :value="progressValues.p2" variant="p2"></b-progress-bar>
            </b-progress>
            <b-progress :value="time" :max="timeReset" style="height:20px" variant="grape"></b-progress>
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
    v-on:ready="go($event)"
    ></ToolbarMatch>

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

    <div class="bg-grape-light" v-if="showAnswers">
      <div class="mt-2">
        <b-table
        striped hover
        :items="answerData"
        :fields="fields"
        >
        <template #head(question)="data">
          <div align="right">
            <span v-if="data">Question</span>
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
        <h3>{{getMessage('win')}} </h3>
      </div>
      <br>
      <button :class="'buttonDiv mt-3 text-cream bg-safe'" style="width:60%"  @click="hideModal('win')">Close</button>
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
    gameOver: Boolean,
    exit: Boolean
  },
  data () {
    return {
      waitUpdate: false,
      waiting: 0,
      pageHead: 'Translation Match AI',
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
      AIclock: null,
      audioMarker: null,
      gamesPlayed: 0,
      botLevel: 1
    }
  },
  methods: {
    botLevelSetter: function () {
      // console.log(this.gamesPlayed, this.botLevel, this.progressValues.p1, this.progressValues.p2)
      if (this.botLevel === 4) {
        if (this.progressValues.p2 === 0) {
          this.botLevel = 5
          this.showComplete()
        } else {
          this.botLevel = 3
        }
      } else if (this.botLevel === 3) {
        if (this.progressValues.p1 >= this.progressValues.p2 * 2) {
          this.botLevel = 4
        } else if (this.progressValues.p2 >= this.progressValues.p1 * 2) {
          this.botLevel = 3
        }
      } else if (this.botLevel === 2) {
        if (this.progressValues.p1 >= this.progressValues.p2 * 2) {
          this.botLevel = 3
        } else if (this.progressValues.p2 >= this.progressValues.p1 * 2) {
          this.botLevel = 2
        }
      } else if (this.botLevel === 1) {
        if (this.progressValues.p1 >= this.progressValues.p2 * 2) {
          this.botLevel = 2
        } else if (this.progressValues.p2 >= this.progressValues.p1 * 2) {
          this.botLevel = 1
        }
      }
    },
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
      console.log('star', word)
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
          'Nice work, I might be in trouble here',
          "Pretty good so far, I'd better think faster"
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
    setCountdown: function () {
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
      this.showAnswers = false
      this.showProgress = true
      this.filter = 0
      this.answerData = []
      this.showTest = true
      // this.setCountdown()
    },
    recordAnswer: function (question, answer, choice, player) {
      clearTimeout(this.AIclock)
      // console.log('RECORD', question, answer, choice, player)
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
        if (player === 'p1' && this.answered === 1) {
          let _this = this
          setTimeout(function () {
            _this.AIanswer(choice)
          }, 2000)
        }
      }
    },
    AIanswer: function (choice) {
      // console.log('answerSet', this.testItems[this.filter], choice)
      let answerSet = JSON.parse(JSON.stringify(this.testItems[this.filter]))
      let choices = this.AIshuffle(answerSet['Choices'])
      let levelSet = [ null, 4, 3, 2, 1 ]
      let rand = this.getRandomInt(levelSet[this.botLevel])
      // console.log('rand', rand, choices[0]['Answer'], choice)
      if (rand === 0) {
        this.recordAnswer(answerSet['Question'], answerSet['Answer'], answerSet['Answer'], 'p2')
      } else if (choices[0]['Answer'] !== answerSet['Answer'] && choices[0]['Answer'] !== choice) {
        // console.log('000000')
        this.recordAnswer(answerSet['Question'], answerSet['Answer'], choices[0]['Answer'], 'p2')
      } else if (choices[1]['Answer'] !== choice) {
        // console.log('1111111')
        this.recordAnswer(answerSet['Question'], answerSet['Answer'], choices[1]['Answer'], 'p2')
      } else if (choices[2]['Answer'] !== choice) {
        // console.log('2222222')
        this.recordAnswer(answerSet['Question'], answerSet['Answer'], choices[2]['Answer'], 'p2')
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
      // 3 --> return  0,1,2
      // 2 --> return  0,1
      // 1 --> 0
      return Math.floor(Math.random() * Math.floor(max))
    },
    recordDisable: function () {
      // no answer from opponent so all disable before next question
      // console.log('DISABLE RESULT', this.player)
      clearInterval(this.clock)
      this.clockBlock = false
      this.disable(this.testItems[this.filter]['Answer'], null, 'p1', false, null)
    },
    disable: function (name, btnID, clicker, state, answer) {
      // console.log('DISABLE', this.player, btnID, name)
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
        // console.log('Stage3', name, answer)
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
      // console.log('NEXT', this.player)
      clearInterval(this.clock)
      this.answered = 2
      this.time = null
      let _this = this
      _this.countdown = setTimeout(function () {
        // console.log('TIMEOUT')
        _this.answered = 0
        _this.enterResult(name, answer, clicker, state)
        clearTimeout(_this.AIstart)
        _this.filterToggle()
        _this.countDown = null
      }, 2000)
    },
    enterResult: function (question, answer, clicker, state) {
      // console.log('ENTER', this.player)

      let _rowVariant = 'warn'
      let score = 0
      let english = question

      if (state) {
        _rowVariant = clicker
        score = 1
      }

      if (this.testType.includes('Ch')) {
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
      clearTimeout(this.AIclock)
      let _this = this
      this.AIclock = setTimeout(function () {
        console.log('AI start')
        _this.AIanswer()
      }, 2000)
    },
    filterToggle: function () {
      // console.log('FILTER', this.player)
      if (this.filter + 1 < this.testItems.length) {
        // console.log(this.filter, this.testItems.length)
        this.filter += 1
        this.AIstartclock()
      } else {
        // console.log('filterMax')
        // go back to false
        this.ready.push('p2')
        this.gamesPlayed += 1
        this.botLevelSetter()
        this.filter = null
        this.showTest = false
        this.showProgress = false
        this.checkAnswers()
      }
    },
    checkAnswers: function () {
      // console.log('CHECK', this.player)

      let p1C = this.progressValues.p1
      let p2C = this.progressValues.p2

      this.p1score += this.progressValues.p1
      this.p2score += this.progressValues.p2

      if (p1C > p2C) {
        this.showWin()
      } else if (p2C > p1C) {
        this.showLose()
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
      // console.log('PLAY', result)

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
    },
    botTime () {
      let timeSets = {
        1: [2000, 2200, 2400, 2600, 2800, 3000],
        2: [1600, 1800, 2000, 2200, 2400, 2600],
        3: [1200, 1400, 1600, 1800, 2000, 2200],
        4: [800, 1000, 1200, 1400, 1600, 1800]
      }
      return this.AIshuffle(timeSets[this.botLevel])[0]
    },
    getBot () {
      let img = {
        1: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/avatar/robot_01.PNG',
        2: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/avatar/robot_02.PNG',
        3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/avatar/robot_03.PNG',
        4: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/100000/avatar.jpg',
        5: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/avatar/robot_04.PNG'
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
          _this.ready = []
          _this.waiting = 0
          _this.start()
        }, 2000)
      }
    },
    exit: function () {
      this.leave()
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
