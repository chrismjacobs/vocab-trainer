<template>
  <div class="TypeTest">

    <audio id="audio" autoplay></audio>

    <Toolbar :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" :title="title" v-on:newTest="start($event)" v-on:retry="start()"></Toolbar>
      <b-row no-gutters v-if="showTest" >
      <b-col cols="8">
            <b-progress :value="filter" style="height:30px" :max="testItems.length" animated variant="safe"></b-progress>
      </b-col>
      <b-col cols="3">
        <b-progress :value="time" style="height:30px" max="60000" animated variant="alert"></b-progress>
      </b-col>
      <b-col cols="1">
        <button class="buttonDiv bg-alert" style="height:30px;width:100%" @click="cancel()"><b-icon class="pb-1 pr-1" icon="x-circle" variant="cream" font-scale="1.5"></b-icon></button>
      </b-col>
      </b-row>

      <div class="bg-grey" v-if="showTest">
        <transition-group name="board">
          <div v-for="(item) in testItems" :key="item">
              <div v-if="testItems.indexOf(item) === filter">
                    <br>
                    <b-row class="px-5">
                      <button class="questionDiv bg-warn" @click="hover=true" :class="hoverStyle" align="center">
                          <h3>
                            <div >
                              <span v-html="item.Spelling"> </span>
                            </div>
                            <span v-if="settings.sound == 'sdOnly' || settings.sound == 'sdOn' "> <b-icon-soundwave></b-icon-soundwave></span>
                          </h3>
                      </button>
                    </b-row>

                    <b-row class="px-5 mt-3" v-if="settings.display !== 'all_Off'">
                      <button class="answerBtn bg-third" @click="hoverCh=true" align="center" >
                          <h3>
                            <span v-if="settings.display === 'text_On'" v-html="item.Chinese" ></span>
                            <span v-if="settings.display ==='label_On'"> {{item.Gr}}</span>
                          </h3>
                      </button>
                    </b-row>

                    <b-row align-h="center" class="mt-4">
                      <b-col cols="10">
                        <b-form-group>
                          <div>
                            <b-form-input align="center" style="font-size:30px;width:100%;text-align:center" :class="validStyle()" onblur="this.focus()" autofocus autocomplete="off" v-on:keyup.enter="recordAnswer(item.English, item.Chinese, currentAnswer) " id="type"  v-model="currentAnswer"></b-form-input>
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
        </transition-group>
      </div>

      <div v-if="showAnswers" class="bg-smoke">
      <b-table
      striped hover
      :items="answerData"
      :fields="fields"
      >
      </b-table>
      </div>
  </div>
</template>

<script>
import Toolbar from './Toolbar'

export default {
  name: 'TypeTest',
  components: {
    Toolbar
  },
  data () {
    return {
      pageHead: 'Typing Test',
      toolbarShow: true,
      testType: 'typeTest',
      title: 'Typing Test',
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
      currentAnswer: null,
      testItems: [],
      settings: {},
      fields: ['Chinese', 'English', 'Answer', 'Time']
    }
  },
  methods: {
    recordAnswer: function (english, chinese, choice) {
      // score
      let correct = english
      let score
      let _rowVariant
      if (choice === correct || choice === correct + ' ') {
        score = 1
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
        console.log(this.filter, this.testItems.length)
        this.filter += 1
        this.mistakes = 0
        // document.getElementById(toString(this.filter)).focus()
        document.getElementById('type').value = ''
      } else {
        console.log('filterMax')
        this.filter = null
        this.mistakes = 0
        this.showTest = false
        document.getElementById('type').value = ''
        this.checkAnswers()
      }
    },
    start: function (data) {
      this.showAnswers = false
      this.filter = 0
      this.answerData = []
      this.showTest = true
      if (data) {
        this.testItems = data.test
        this.settings = JSON.parse(data.settings)
      }
    },
    cancel: function () {
      this.filter = null
      this.mistakes = 0
      this.showTest = false
      document.getElementById('type').value = ''
      this.checkAnswers()
    },
    checkAnswers: function () {
      this.showAnswers = true
      this.$store.dispatch('updateRecord', { mode: 'typeTest', answerData: this.answerData, settingsData: this.settings })
    },
    playAudio: function (arg) {
      console.log('PLAY', arg)
      let player = document.getElementById('audio')
      player.src = arg
      player.play()
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
    validAnswer () {
      let typed = null
      if (this.currentAnswer) {
        typed = this.currentAnswer.length
      } else {
        return false
      }

      let answerSub = this.testItems[this.filter].English

      if (this.currentAnswer === this.testItems[this.filter].English ||
          this.currentAnswer === this.testItems[this.filter].English + ' ') {
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
      if (this.currentAnswer === answer || this.currentAnswer === answer + ' ') {
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
    hover: function () {
      if (this.hover === true) {
        this.hoverStyle = 'bg-warn-light'
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdEn)
        let _this = this
        setInterval(function () {
          _this.hover = false
          _this.hoverStyle = 'bg-info'
        }, 1800)
      }
    },
    hoverCh: function () {
      if (this.hoverCh === true) {
        this.hoverStyleCh = 'bg-prime'
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdCh)
        let _this = this
        setInterval(function () {
          _this.hoverCh = false
          _this.hoverStyleCh = 'bg-info'
        }, 1800)
      }
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
