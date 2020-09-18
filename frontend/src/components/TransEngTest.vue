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
                                <button class="answerBtn" @click="recordAnswer(item.English, item.Chinese, choice.Chinese)">
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
        </b-table>
      </div>

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
      fields: ['English', 'Chinese', 'Choice']
    }
  },
  methods: {
    recordAnswer: function (english, chinese, choice) {
      // console.log(data)

      let correct = chinese
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
        console.log(this.filter, this.testItems.length)
        this.filter += 1
      } else {
        console.log('filterMax')
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
    },
    checkAnswers: function () {
      this.showAnswers = true
      this.$store.dispatch('updateRecord', { mode: 'transEng', answerData: this.answerData, settingsData: this.settings })
    },
    cancel: function () {
      console.log('cancel')
      clearInterval(this.timer)
      this.filter = null
      this.showTest = false
      this.checkAnswers()
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
  mounted () {
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
