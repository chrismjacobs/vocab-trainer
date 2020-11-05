<template>
  <div class="TransEng">

      <audio id="audio" autoplay></audio>

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
                          <button class="questionDiv bg-second"  @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: hover }" >
                                <span v-if="settings.sound !== 'sdEx' || hover == true"> {{ item.English }} </span>
                                <span v-if="settings.label==='lbOn' && settings.sound !== 'sdEx'" > &nbsp; ({{item.Gr}}) </span>
                                <span v-if="settings.sound == 'sdEx' || settings.sound == 'sdOn'"> <b-icon-soundwave></b-icon-soundwave></span>
                          </button>

                          <div class="p-3">
                              <div v-for="(choice, index) in item.Choices" :key="index">
                                <button class="answerBtn bg-smoke" @click="recordAnswer(item.English, item.Chinese, choice.Chinese)">
                                <span v-if="settings.label === 'lbAn' || settings.label === 'lbOn'"> ({{ choice.Gr }}) &nbsp; </span>  {{ choice.Chinese }}
                                </button>
                                  <br>
                                  <br>
                              </div>
                          </div>
                    </div>
            </div>
      </div>

      <div class="bg-smoke" v-if="showAnswers">
        <b-table
        striped hover
        :items="answerData"
        :fields="fields"
        >
        <template #head(english)="data">
          <div align="right">
            English
          </div>
        </template>

        <template v-slot:cell(english)="data" >
          <div align="right">
            {{data.value}}
          </div>
        </template>

        <template v-slot:cell(chinese)="data" style="width:50%" >
          <div v-if="data.item._rowVariant === 'warn'">
            <b-icon icon="x" font-scale="1" ></b-icon> {{data.item.Choice}}<br>
            <b-icon icon="check2" font-scale="1"></b-icon> {{data.item.Chinese}}
          </div>
          <div v-else>
            {{data.item.Chinese}}
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
  name: 'TransEngTest',
  components: {
    Toolbar
  },
  data () {
    return {
      pageHead: 'English --> Chinese',
      testType: 'transEng',
      title: 'English --> Chinese',
      toolbarShow: true,
      hover: false,
      showAnswers: false,
      showTest: false,
      answerData: [],
      filter: null,
      testItems: [],
      settings: {},
      startTime: null,
      endTime: null,
      qCount: 0,
      sCount: 0,
      fields: ['English', 'Chinese']
    }
  },
  methods: {
    recordAnswer: function (english, chinese, choice) {
      // console.log(english, chinese, choice)
      this.qCount += 1

      let correct = chinese
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
        this.filter += 1
      } else {
        console.log('filterMax')
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
      if (data) {
        this.testItems = data.test
        this.settings = JSON.parse(data.settings)
      }
      this.$store.dispatch('testActive', true)
    },
    checkAnswers: function () {
      console.log('testEnded')
      this.showAnswers = true
      this.$store.dispatch('testActive', false)
      this.$store.dispatch('updateRecord', { mode: 'transEng', answerData: this.answerData, settingsData: this.settings })
    },
    cancel: function () {
      console.log('cancel')
      this.filter = null
      this.showTest = false
      this.endTime = new Date()
      this.showModal()
      this.checkAnswers()
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
      console.log('PLAY', arg)
      let player = document.getElementById('audio')
      player.src = arg
      player.play()
    }
  },
  watch: {
    filter: function () {
      let sound = this.testItems[this.filter]
      if (sound && this.sound !== 'sdOff') {
        this.playAudio(sound.sdEn)
      }
    },
    hover: function () {
      if (this.hover) {
        console.log('hover_active')
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdEn)
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

.active {
  background: #bbe0eb;
}

</style>
