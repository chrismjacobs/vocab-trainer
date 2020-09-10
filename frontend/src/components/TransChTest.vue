<template>
  <div class="TransCh">

    <audio id="audio" autoplay></audio>

    <Toolbar :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" :title="title" v-on:newTest="start($event)" v-on:retry="start()"></Toolbar>
      <b-row no-gutters v-if="showTest" >
      <b-col cols="11">
            <b-progress :value="filter" style="height:30px" :max="testItems.length" variant="warn-light" show-progress animated></b-progress>
      </b-col>
      <b-col cols="1">
        <button class="buttonDiv bg-warn" style="height:30px;width:100%" @click="cancel()"><b-icon icon="x-circle" variant="cream"></b-icon></button>
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
                      <span v-if="settings.sound === 'sdEx'"> <b-icon-soundwave @mouseover="hoverAns=choice.sdEn" @mouseleave="hoverAns=null" font-scale="1.5"></b-icon-soundwave> </span>
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
      prime: '#205372',
      warn: '#E8804C',
      buttonStyle: {
        0: { color: this.prime },
        1: { color: this.prime },
        2: { color: this.prime },
        3: { color: this.prime },
        4: { color: this.prime },
        5: { color: this.prime }
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
          this.buttonStyle[this.buttonRotate - 1] = { color: this.prime }
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
    cancel: function () {
      console.log('cancel')
      clearInterval(this.timer)
      this.filter = null
      this.showTest = false
      this.checkAnswers()
    },
    timerSet: function () {
      let _this = this
      this.timer = setInterval(function () {
        console.log('buttonRotate', _this.buttonRotate, _this.settings.choices, _this.testItems[_this.filter])
        _this.buttonStyle[_this.buttonRotate - 1] = { color: _this.prime }
        _this.buttonStyle[_this.buttonRotate] = { color: _this.warn }

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
