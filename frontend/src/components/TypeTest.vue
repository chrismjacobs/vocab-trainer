<template>
  <div class="TypeTest">

    <audio id="audio" autoplay></audio>
    <div :class="getClass('second', 'cream', 'mt-2 p-2 head')">
            <h2 align="center"> {{ title }} </h2>
    </div>

    <Toolbar :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" :title="title" v-on:newTest="start($event)" v-on:retry="start()"></Toolbar>

      <b-row no-gutters v-if="showTest" >
        <b-col cols="8">
              <b-progress :value="filter" style="height:30px" :max="testItems.length" animated variant="safe"></b-progress>
        </b-col>
        <b-col cols="4">
          <b-progress :value="time" style="height:30px" max="60000" animated variant="alert"></b-progress>
        </b-col>
      </b-row>

      <div class="bg-grey" v-if="showTest">
          <div v-for="(item, idx) in testItems" :key="idx">
              <div v-if="testItems.indexOf(item) === filter">
                    <br>
                    <b-row class="px-5">
                      <button class="questionDiv bg-warn" @click="playAudio(item.sdEn)" :class="hoverStyle" align="center">
                          <h3>
                            <div >
                              <span v-html="item.Spelling"> </span>
                            </div>
                            <span v-if="settings.sound == 'sdOnly' || settings.sound == 'sdOn' "> <b-icon-soundwave></b-icon-soundwave></span>
                          </h3>
                      </button>
                    </b-row>

                    <b-row class="px-5" v-if="$store.state.userProfile.vocab.includes('apan') && $store.state.userProfile.userID === 1">
                      <button class="answerBtn bg-grape-light" @click="cheat(item.English)" align="center">
                          <h3>
                            <div >
                              <span> cheat </span>
                            </div>
                          </h3>
                      </button>
                    </b-row>

                    <b-row class="px-5 mt-3" v-if="settings.display !== 'all_Off'">
                      <button class="answerBtn bg-third" @click="playAudio(item.sdCh)" align="center" >
                          <h3>
                            <span v-if="settings.display === 'text_On'" v-html="item.Chinese" ></span>
                            <span v-if="settings.display ==='label_On'"> {{item.Gr}}</span>
                          </h3>
                      </button>
                    </b-row>

                    <b-row align-h="center" class="mt-4">
                      <b-col cols="10">
                        <b-form-group>
                          <div align="center">
                            <b-form-input
                            align="center"
                            :style="inputStyle"
                            :class="validStyle()"
                            onblur="this.focus()"
                            autofocus
                            autocapitalize="none"
                            autocomplete="off"
                            autocorrect="off"
                            spellcheck="false"
                            v-on:keyup.native.enter="recordAnswer(item.English, item.Chinese, currentAnswer) "
                            id="type"
                            v-model="currentAnswer"
                            ></b-form-input>
                            <br>
                            <h6>
                              ({{currentAnswer.length}}/{{answerLength}})
                            </h6>
                          </div>

                          <div align="center" v-if="settings.feedback === 'fbConst'">
                            <b-form-invalid-feedback :state="validAnswer">
                              checking...
                            </b-form-invalid-feedback>
                            <b-form-valid-feedback :state="validAnswer">
                              Looks Good :)
                            </b-form-valid-feedback>
                          </div>
                          <div align="center" v-if="settings.feedback === 'fbComp'">
                            <b-form-invalid-feedback :state="validCheck">
                              checking...
                            </b-form-invalid-feedback>
                            <b-form-valid-feedback :state="validCheck">
                              Looks Good :)
                            </b-form-valid-feedback>
                          </div>
                        </b-form-group>
                      </b-col>
                    </b-row>

              </div>
          </div>
      </div>

      <div v-if="showAnswers" class="bg-smoke">
      <b-table
      striped hover
      :items="answerData"
      :fields="fields"
      >

      <template #head(chinese)="data">
          <div align="right">
            Chinese
          </div>
        </template>

      <template #head(time)="data">
          <div align="right">
            Time
          </div>
        </template>

        <template v-slot:cell(chinese)="data">
          <div align="right">
            {{ data.value}}
          </div>
        </template>

        <template v-slot:cell(english)="data" >
          <div v-if="data.item._rowVariant === 'alert'">
            <b-icon icon="x" variant="alert" font-scale="1" ></b-icon> {{data.item.Answer}}<br>
            <b-icon icon="check2" variant="safe" font-scale="1"></b-icon> <span :id="data.item.English" @click="playAnswer(data.item.English)"> {{data.item.English}}</span>
          </div>
          <div v-else>
            <span :id="data.item.English" @click="playAnswer(data.item.English)"> {{data.item.English}}</span>
          </div>
        </template>

        <template v-slot:cell(time)="data" >
          <div align="right">
            {{ data.value}}
          </div>
          <div style="float:right">
           <template v-if="data.item.English in starGet">
              <b-icon-star-fill variant="warn" @click="addStar(data.item.English, 0)"></b-icon-star-fill>
            </template>
            <template v-else>
              <b-icon-star variant="grey" @click="addStar(data.item.English, 1)"></b-icon-star>
            </template>
          </div>
        </template>

      </b-table>
      </div>

      <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="complete" hide-footer title="Test Complete">
      <div class="d-block">
        <h3> {{sCount}}/{{qCount}} </h3>
        <h3> {{ timeSpan() }}  </h3>
      </div>
      <button class="buttonDiv mt-3 bg-prime text-cream" style="width:60%"  @click="hideModal('complete')">Close</button>
      </b-modal>

  </div>
</template>

<script>
import Toolbar from './Toolbar'

export default {
  name: 'TypeTest',
  components: {
    Toolbar
  },
  props: {
    s3: String,
    exit: Boolean
  },
  data () {
    return {
      pageHead: 'Typing Test',
      testType: 'typeTest',
      title: 'Typing Test',
      toolbarShow: true,
      time: 60000,
      clock: null,
      mistakes: 0,
      hover: false,
      hoverCh: false,
      hoverStyle: 'bg-info',
      hoverStyleCh: 'bg-info',
      showAnswers: false,
      showTest: false,
      filter: null,
      answerData: [],
      currentAnswer: '',
      testItems: [],
      settings: {},
      fields: ['Chinese', 'English', 'Time'],
      startTime: null,
      endTime: null,
      qCount: 0,
      sCount: 0
    }
  },
  methods: {
    cheat: function (word) {
      var nospace = word.split(' ').join('')
      this.currentAnswer = nospace
    },
    recordAnswer: function (english, chinese, choice) {
      // score
      this.qCount += 1

      let correct = english
      let score
      let _rowVariant
      if (choice === correct || choice === correct + ' ') {
        score = 1
        this.sCount += 1
        _rowVariant = 'safe'
      } else {
        score = -1
        _rowVariant = 'alert'
      }

      // calculate error rate
      let errorRate = this.mistakes / english.length
      if (errorRate > 0.3) {
        score = -1
      }

      // calculate TIME
      let count = ((60000 - this.time) / 1000)
      let time
      if (count > 98) {
        time = '> 60s'
      } else {
        time = count + 's'
      }

      let entry = {
        English: english,
        Chinese: chinese,
        Answer: choice,
        Score: score,
        Time: time,
        Error: errorRate,
        _rowVariant: _rowVariant
      }

      this.answerData.push(entry)

      if (this.filter + 1 < this.testItems.length) {
        // console.log(this.filter, this.testItems.length)
        this.filter += 1
        this.mistakes = 0
        // document.getElementById(toString(this.filter)).focus()
        this.currentAnswer = ''
      } else {
        // console.log('filterMax')
        this.cancel()
      }
    },
    start: function (data) {
      this.sCount = 0
      this.qCount = 0
      this.startTime = new Date()
      this.showAnswers = false
      this.filter = 0
      this.answerData = []
      this.showTest = true
      this.$store.dispatch('testActive', true)
      if (data) {
        this.testItems = data.test
        this.settings = JSON.parse(data.settings)
      }
    },
    cancel: function () {
      // console.log('cancel')
      this.filter = null
      this.mistakes = 0
      this.showTest = false
      this.endTime = new Date()
      this.showModal()
      this.currentAnswer = ''
      this.checkAnswers()
    },
    checkAnswers: function () {
      // console.log('testEnded')
      this.showAnswers = true
      this.$store.dispatch('testActive', false)
      this.$store.dispatch('updateRecord', { mode: 'typeTest', answerData: this.answerData, settingsData: this.settings })
    },
    showModal: function () {
      this.$refs['complete'].show()
    },
    hideModal: function (mode) {
      if (mode === 'complete') {
        this.$refs['complete'].hide()
      } else {
        this.$refs['fail'].hide()
        this.msg = null
        this.waiting = true
      }
    },
    timeSpan: function () {
      let time = (this.endTime - this.startTime) / 1000
      let minutes = 0
      let seconds = 0
      if (time > 59) {
        minutes = Math.floor(time / 60)
        seconds = Math.floor(time - (minutes * 60))
        return minutes.toString() + ' minutes ' + seconds.toString() + ' seconds'
      } else {
        return Math.floor(time).toString() + ' seconds'
      }
    },
    addStar: function (word, set) {
      this.$store.dispatch('newStar', {word: word, set: set})
    },
    playAudio: function (arg) {
      // console.log('PLAY', arg)
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
    setCountdown: function () {
      this.time = 60000
      let _this = this
      this.clock = setInterval(function () {
        _this.time -= 100
      }, 100)
    },
    validStyle: function () {
      if (this.settings['feedback'] === 'fbComp' && !this.validCheck) {
        return 'bg-cream'
      } else if (this.settings['feedback'] === 'fbComp' && this.validCheck) {
        return 'bg-safe-light text-prime'
      } else if (this.settings['feedback'] === 'fbConst' && !this.validAnswer) {
        return 'bg-alert-light text-prime'
      } else if (this.settings['feedback'] === 'fbConst' && this.validAnswer) {
        return 'bg-third text-prime'
      } else {
        return 'bg-cream'
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
    inputStyle () {
      console.log('Answer length', window.innerWidth)
      let width = this.answerLength + '0%'

      if (window.innerWidth < 1000) {
        width = '100%'
      }
      return {'font-size': '30px', width: width, 'text-align': 'center', 'max-width': '100%'}
    },
    answerLength () {
      let answer = this.testItems[this.filter].English
      return answer.length
    },
    validAnswer () {
      let typed = null
      if (this.currentAnswer !== '') {
        typed = this.currentAnswer.length
      } else {
        return false
      }

      let answerSub = this.testItems[this.filter].English

      if (this.currentAnswer === this.testItems[this.filter].English) {
        return true
      } else if (this.currentAnswer === answerSub.substr(0, typed)) {
        return true
      } else if (typed > 0) {
        let _this = this
        _this.mistakes += 1
        return false
      }
    },
    validCheck () {
      let answer = this.testItems[this.filter].English
      if (this.currentAnswer === answer) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    filter: function () {
      clearInterval(this.clock)
      this.setCountdown()
      let sound = this.testItems[this.filter]
      if (sound && this.settings.sound === 'sdEn') {
        this.playAudio(sound.sdEn)
      } else if (sound && this.settings.sound === 'sdCh') {
        this.playAudio(sound.sdCh)
      }
    },
    exit: function () {
      this.cancel()
    }
  },
  created () {
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push('login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
