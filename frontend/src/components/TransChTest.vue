<template>
  <div class="TransCh">

    <audio id="audio" autoplay></audio>

    <Toolbar :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" :title="title" v-on:newTest="start($event)" v-on:retry="start()"></Toolbar>

      <div class="mt-2 bg-sand p-2" v-if="showTest">
         <b-progress :value="filter" :max="testItems.length" show-progress animated></b-progress>
      </div>

      <div class="mt-2 bg-safe" v-if="showTest">
        <div v-for="(item, key) in testItems" :key="key">
          <b-row>
            <b-col>
              <div @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: hover }" v-if="testItems.indexOf(item) === filter" align="center">
                  <h3>
                    <span v-if="settings.label==='lbOn' || settings.label==='lbQu' "> &nbsp; ({{item.Gr}}) </span>
                    <span> {{ item.Chinese }} </span>
                  </h3>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-card v-if="testItems.indexOf(item) === filter">
                <div v-for="(choice, index) in item.Choices" :key="index">
                  <button class="answerBtn bg-third" :style="buttonStyle[index]" block @click="recordAnswer(item.English, item.Chinese, choice.English)">
                   <span v-if="settings.sound === 'sdEx'"> <b-icon-soundwave @mouseover="hoverAns=choice.sdEn" @mouseleave="hoverAns=null"></b-icon-soundwave> </span>
                   <span v-else-if="settings.label === 'lbAn' || settings.sound !== 'sdEx'"> ({{ choice.Gr }}) &nbsp;  {{ choice.English }} </span>
                   <span v-else>{{ choice.English }}</span>
                  </button>
                    <br>
                    <br>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </div>
      </div>

    <b-container v-if="showAnswers">
      <b-card class="mt-2">
        <b-table
        striped hover
        :items="answerData"
        :fields="fields"
        >
        </b-table>
      </b-card>
    </b-container>
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
      title: 'Chinese -> English',
      buttonRotate: null,
      hover: false,
      hoverAns: false,
      showAnswers: false,
      showTest: false,
      answerData: [],
      filter: null,
      testItems: [],
      settings: {},
      timer: null,
      fields: ['Chinese', 'English', 'Choice'],
      buttonStyle: {
        0: { color: 'blue' },
        1: { color: 'blue' },
        2: { color: 'blue' },
        3: { color: 'blue' },
        4: { color: 'blue' },
        5: { color: 'blue' }
      }
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
        _rowVariant = 'danger'
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
          this.buttonStyle[this.buttonRotate - 1] = { color: 'white' }
          clearInterval(this.timer)
          this.buttonRotate = 0
          this.timerSet()
        }
        this.filter += 1
      } else {
        console.log('filterMax')
        clearInterval(this.timer)
        this.filter = null
        this.showTest = false
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
        this.buttonRotate = 0
        this.timerSet()
      }
    },
    checkAnswers: function () {
      this.showAnswers = true
      this.$store.dispatch('updateRecord', { mode: 'transCh', answerData: this.answerData, settingsData: this.settings })
    },
    playAudio: function (arg) {
      document.getElementById('audio').src = arg
    },
    timerSet: function () {
      let _this = this
      this.timer = setInterval(function () {
        console.log('buttonRotate', _this.buttonRotate, _this.settings.choices, _this.testItems[_this.filter])
        _this.buttonStyle[_this.buttonRotate - 1] = { color: 'blue' }
        _this.buttonStyle[_this.buttonRotate] = { color: 'orange' }

        if (_this.buttonRotate < _this.settings.choices) {
          let media = _this.testItems[_this.filter]['Choices'][_this.buttonRotate]
          _this.playAudio(media['sdEn'])
          _this.buttonRotate += 1
          console.log('plus1')
        } else {
          console.log('clear')
          _this.buttonRotate = null
          clearInterval(_this.timer)
        }
      }, 1800)
    }
  },
  watch: {
    filter: function () {
      let sound = this.testItems[this.filter]
      if (sound && this.settings.sound !== 'sdOff' && this.buttonRotate === null) {
        this.playAudio(sound.sdEn)
      }
    },
    hover: function () {
      if (this.hover === true && this.buttonRotate === null) {
        console.log('hover_active')
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdCh)
      }
    },
    hoverAns: function () {
      if (this.hoverAns !== null && this.buttonRotate === null && this.settings.sound === 'sdEx') {
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
