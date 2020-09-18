<template>
  <div class="TransCh">

    <audio id="audio"></audio>
    <audio id="cycle"></audio>

    <Toolbar :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" :title="title" v-on:newTest="start($event)" v-on:retry="start()"></Toolbar>
      <b-row no-gutters v-if="showTest" >
      <b-col cols="11">
            <b-progress :value="filter" style="height:30px" :max="testItems.length" variant="warn-light" show-progress animated></b-progress>
      </b-col>
      <b-col cols="1">
        <button class="buttonDiv bg-warn" style="height:30px;width:100%" @click="cancel()"><b-icon class="pb-1 pr-1" icon="x-circle" variant="cream" font-scale="1.5"></b-icon></button>
      </b-col>
      </b-row>

      <div class="bg-grey" v-if="showTest">
        <div v-for="(item, key) in testItems" :key="key">
            <div v-if="testItems.indexOf(item) === filter">
                  <button class="questionDiv bg-second" @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: hover }" >
                    <span v-if="settings.label==='lbOn' || settings.label==='lbQu' "> &nbsp; ({{item.Gr}}) </span>
                    <span> {{ item.Chinese }} </span>
                  </button>

                <div class="p-3">
                  <div v-for="(choice, index) in item.Choices" :key="index">
                    <button class="answerBtn" :style="buttonStyle[index]" block @click="recordAnswer(item.English, item.Chinese, choice.English)">
                      <span v-if="settings.sound === 'sdEx'"> <b-icon-soundwave font-scale="1.5"></b-icon-soundwave> </span>
                      <span v-else-if="settings.label === 'lbAn' || settings.sound !== 'sdEx'"> ({{ choice.Gr }}) &nbsp;  {{ choice.English }} </span>
                      <span v-else>{{ choice.English }}</span>
                     </button>
                      <br>
                      <br>
                  </div>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-grey pb-3" v-if="replay">
        <b-row>
          <b-col align="center">
            <button class="buttonDiv bg-alert px-3" style="width:45%; height:50px" @click="playCycle(), replay = false"> <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise></button>
          </b-col>
        </b-row>
    </div>

    <div class="bg-smoke"  v-if="showAnswers">
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
  name: 'TransCh',
  components: {
    Toolbar
  },
  data () {
    return {
      pageHead: 'Chinese --> English',
      toolbarShow: true,
      max: 100,
      value: 20,
      testType: 'transCh',
      title: 'Chinese --> English',
      hover: false,
      hoverAns: false,
      showAnswers: false,
      showTest: false,
      answerData: [],
      filter: null,
      testItems: [],
      settings: {},
      fields: ['Chinese', 'English', 'Choice'],
      activeStyle: { background: '#4a758b', color: '#E8804C' },
      neutralStyle: { background: '#d8ecf1', color: '#205372' },
      buttonStyle: {
        0: this.neutralStyle,
        1: this.neutralStyle,
        2: this.neutralStyle,
        3: this.neutralStyle,
        4: this.neutralStyle,
        5: this.neutralStyle
      },
      replay: false
    }
  },
  methods: {
    recordAnswer: function (english, chinese, choice) {
      console.log(english, chinese, choice)
      let correct = english
      let score
      let _rowVariant
      if (choice === correct) {
        score = 1
        _rowVariant = 'safe'
      } else {
        score = -1
        _rowVariant = 'warn'
      }
      let entry = {
        English: english,
        Chinese: chinese,
        Choice: choice,
        Score: score,
        _rowVariant: _rowVariant
      }

      this.answerData.push(entry)

      if (this.filter + 1 < this.testItems.length) {
        console.log('filterCheck', this.filter, this.testItems.length)
        if (this.settings.sound === 'sdEx') {
          this.filter += 1
          this.replay = false
          this.playCycle()
        } else {
          this.filter += 1
        }
      } else {
        console.log('filterMax')
        this.filter = null
        this.showTest = false
        this.replay = false
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
      /// unique to this mode TransCh
      if (this.settings.sound === 'sdEx') {
        this.playCycle()
        // this.timerSet()
      }
    },
    checkAnswers: function () {
      this.showAnswers = true
      this.$store.dispatch('updateRecord', { mode: 'transCh', answerData: this.answerData, settingsData: this.settings })
    },
    playAudio: function (arg) {
      console.log('PLAY', arg)
      let player = document.getElementById('audio')
      player.src = arg
      player.play()
    },
    playCycle: function () {
      // let silence = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/silence.mp3'
      for (let index in this.buttonStyle) {
        this.buttonStyle[index] = this.neutralStyle
      }
      let player = document.getElementById('cycle')
      let index = 0
      let _this = this
      let media = this.testItems[this.filter]['Choices'][index]['sdEn']

      console.log('CYCLE', this.testItems[this.filter])
      player.src = media
      player.play()
      this.buttonStyle[index] = this.activeStyle
      player.onended = function () {
        _this.buttonStyle[index] = _this.neutralStyle
        if (index < _this.settings.choices - 1) {
          index += 1
          _this.buttonStyle[index] = _this.activeStyle
          media = _this.testItems[_this.filter]['Choices'][index]['sdEn']
          player.src = media
          player.play()
        } else {
          _this.replay = true
        }
      }
    },
    cancel: function () {
      console.log('cancel')
      this.filter = null
      this.showTest = false
      this.replay = false
      this.checkAnswers()
    }
  },
  watch: {
    filter: function () {
      let sound = this.testItems[this.filter]
      console.log('FILTER', this.settings.sound)
      if (sound && this.settings.sound === 'sdTy') {
        this.playAudio(sound.sdEn)
      }
    },
    hover: function () {
      if (this.hover) {
        console.log('hover_active')
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdCh)
      }
    },
    hoverAns: function () {
      if (this.hoverAns !== null && this.replay && this.settings.sound === 'sdEx') {
        console.log('hoverAns_active')
        let sound = this.hoverAns
        this.playAudio(sound)
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
