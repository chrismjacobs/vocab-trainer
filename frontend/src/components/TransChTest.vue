<template>
  <div class="TransCh">

    <audio id="audio"></audio>
    <audio id="cycle"></audio>

    <div :class="getClass('second', 'cream', 'mt-2 p-2 head')">
            <h2 align="center"> {{ title }} </h2>
    </div>

    <Toolbar :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" :title="title" v-on:newTest="start($event)" v-on:retry="start()"></Toolbar>

    <div v-if="showTest">
        <b-progress :value="filter" style="height:30px" :max="testItems.length" variant="warn-light" show-progress animated></b-progress>
      <div class="bg-grey">
        <div v-for="(item, key) in testItems" :key="key">
            <div v-if="testItems.indexOf(item) === filter">
                  <button class="questionDiv bg-second" @click="playAudio(item.sdCh)" @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: hover }" >
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
    <div class="bg-grey pb-3" v-if="replay && showTest">
        <b-row>
          <b-col align="center">
            <button class="buttonDiv bg-alert px-3" style="width:45%; height:50px" @click="playCycle(), replay = false"> <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise></button>
          </b-col>
        </b-row>
    </div>
   </div>

    <div class="bg-smoke"  v-if="showAnswers">
        <b-table
        striped hover
        fixed
        :items="answerData"
        :fields="fields"
        >

        <template #head(chinese)="data">
          <div align="right">
            <span v-if="data">Chinese</span>
          </div>
        </template>

        <template v-slot:cell(chinese)="data">
          <div style="float:left">
           <template v-if="data.item.English in starGet">
              <b-icon-star-fill variant="warn" @click="addStar(data.item.English, 0)"></b-icon-star-fill>
            </template>
            <template v-else>
              <b-icon-star variant="grey" @click="addStar(data.item.English, 1)"></b-icon-star>
            </template>
          </div>

          <div align="right">
            {{ data.value}}
          </div>
        </template>

        <template v-slot:cell(english)="data" >
          <div v-if="data.item._rowVariant === 'warn'">
            <b-icon icon="x" variant="alert" font-scale="1" ></b-icon> <span :id="data.item.Choice" @click="playAnswer(data.item.Choice)"> {{data.item.Choice}}</span> <br>
            <b-icon icon="check2" variant="safe" font-scale="1"></b-icon> <span :id="data.item.English" @click="playAnswer(data.item.English)"> {{data.item.English}}</span>
          </div>
          <div v-else>
            <span :id="data.item.English" @click="playAnswer(data.item.English)"> {{data.item.English}}</span>
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
  name: 'TransCh',
  components: {
    Toolbar
  },
  props: {
    s3: String,
    exit: Boolean
  },
  data () {
    return {
      pageHead: this.titleCheck(),
      testType: 'transCh',
      title: this.titleCheck(),
      toolbarShow: true,
      max: 100,
      value: 20,
      hover: false,
      hoverAns: false,
      showAnswers: false,
      showTest: false,
      answerData: [],
      filter: null,
      testItems: [],
      settings: {},
      fields: ['Chinese', 'English'],
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
      replay: false,
      startTime: null,
      endTime: null,
      qCount: 0,
      sCount: 0,
      markerIcon: null
    }
  },
  computed: {
    starGet () {
      return this.$store.getters.starGet
    },
    dictGet () {
      return this.$store.getters.makeList
    }
  },
  methods: {
    titleCheck: function () {
      if (this.$store.state.userProfile.vocab.includes('apan')) {
        return 'Chinese >> Japanese'
      } else {
        return 'Chinese >> English'
      }
    },
    recordAnswer: function (english, chinese, choice) {
      // console.log(english, chinese, choice)
      this.qCount += 1

      let correct = english
      let score
      let _rowVariant
      if (choice === correct) {
        score = 1
        this.sCount += 1
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
        // console.log('filterCheck', this.filter, this.testItems.length)
        if (this.settings.sound === 'sdEx') {
          this.filter += 1
          this.replay = false
          this.playCycle()
        } else {
          this.filter += 1
        }
      } else {
        // console.log('filterMax')
        this.cancel()
      }
    },
    start: function (data) {
      for (let index in this.buttonStyle) {
        this.buttonStyle[index] = this.neutralStyle
      }
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
      /// unique to this mode TransCh
      if (this.settings.sound === 'sdEx') {
        this.playCycle()
      }
    },
    checkAnswers: function () {
      // console.log('testEnded')
      this.showAnswers = true
      this.replay = false
      this.$store.dispatch('testActive', false)
      this.$store.dispatch('updateRecord', { mode: 'transCh', answerData: this.answerData, settingsData: this.settings })
    },
    cancel: function () {
      // console.log('cancel')
      this.filter = null
      this.showTest = false
      this.endTime = new Date()
      this.replay = false
      this.showModal()
      this.checkAnswers()
    },
    addStar: function (word, set) {
      this.$store.dispatch('newStar', {word: word, set: set})
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
    playAudio: function (arg) {
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
    playCycle: function () {
      // let silence = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/silence.mp3'
      for (let index in this.buttonStyle) {
        this.buttonStyle[index] = this.neutralStyle
      }
      let player = document.getElementById('cycle')
      let index = 0
      let _this = this
      let media = this.testItems[this.filter]['Choices'][index]['sdEn']

      // console.log('CYCLE', this.testItems[this.filter])
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
          if (_this.showTest) {
            _this.replay = true
          }
        }
      }
    }
  },
  watch: {
    filter: function () {
      let sound = this.testItems[this.filter]
      // console.log('FILTER', this.settings.sound)
      if (sound && this.settings.sound === 'sdTy') {
        this.playAudio(sound.sdEn)
      }
    },
    hover: function () {
      if (this.hover) {
        // console.log('hover_active')
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdCh)
      }
    },
    hoverAns: function () {
      if (this.hoverAns !== null && this.replay && this.settings.sound === 'sdEx') {
        // console.log('hoverAns_active')
        let sound = this.hoverAns
        this.playAudio(sound)
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
