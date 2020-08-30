<template>
  <div class="TypeTest">

    <audio id="audio" autoplay></audio>

    <Toolbar :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" :title="title" v-on:newTest="start($event)" v-on:retry="start()"></Toolbar>

      <b-card class="mt-2" cols="10" v-if="showTest">

            <b-progress :value="filter" :max="testItems.length" animated variant="safe"></b-progress>
               <br>
            <b-progress :value="time" max="60000" animated variant="alert"></b-progress>

      </b-card>

      <div v-for="(item, key) in testItems" :key="key">
      <b-card class="mt-2" v-if="testItems.indexOf(item) === filter">
        <b-row>
           <b-card @click="hover=true" @mouseover="hover=true" @mouseleave="hover=false" :class="hoverStyle" align="center" class="mx-auto">
              <h3>
                <div v-if="!item.Spelling">
                  <span style="width:100%"> <b-icon-soundwave></b-icon-soundwave> </span>
                </div>
                <div v-else>
                  <span v-html="item.Spelling">  </span>
                </div>
                <span v-if="settings.sound == 'sdOnly' || settings.sound == 'sdOn' "> <b-icon-soundwave></b-icon-soundwave></span>
              </h3>
           </b-card>

        </b-row>
        <br>
        <b-row>
           <b-card @click="hoverCh=true" @mouseover="hoverCh=true" @mouseleave="hoverCh=false" :class="hoverStyleCh" align="center" class="mx-auto">
              <h3>
                <span v-if="settings.display === 'ch_text_On' || settings.display === 'ch_lb_On'" v-html="item.Chinese" ></span>
                <span v-if="settings.display ==='ch_lb_On' || settings.display === 'lb_On'"> &nbsp; ({{item.Gr}}) </span>
              </h3>
           </b-card>
        </b-row>

      <b-row class="justify-content-center">
            <b-form-group>

              <b-form-input align="center" :class="validStyle()" onblur="this.focus()" autofocus autocomplete="off" size="lg" v-on:keyup.enter="recordAnswer(item.English, item.Chinese, currentAnswer) " id="type"  v-model="currentAnswer" class="mt-5"></b-form-input>

            <div v-if="settings.feedback === 'fbConst'">
              <b-form-invalid-feedback :state="validAnswer">
                checking...
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validAnswer">
                Looks Good :)
              </b-form-valid-feedback>
            </div>
            <div v-if="settings.feedback === 'fbComp'">
              <b-form-invalid-feedback :state="validCheck">
                checking...
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validCheck">
                Looks Good :)
              </b-form-valid-feedback>
            </div>

          </b-form-group>
      </b-row>
      </b-card>

      </div>

      <b-card v-if="showAnswers" class="mt-2">
      <b-table
      striped hover
      :items="answerData"
      :fields="fields"
      >
      </b-table>
      </b-card>
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
      testType: 'TypeTest',
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
      this.showAnswers = false
      this.filter = null
      this.answerData = []
      this.showTest = false
      document.getElementById('type').value = ''
    },
    checkAnswers: function () {
      this.showAnswers = true
      this.$store.dispatch('updateRecord', { mode: 'type', answerData: this.answerData, settingsData: this.settings })
    },
    playAudio: function (arg) {
      // console.log(arg)
      document.getElementById('audio').src = arg
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
        this.hoverStyle = 'bg-safe'
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
        this.hoverStyleCh = 'bg-safe'
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
