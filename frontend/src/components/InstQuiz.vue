<template>
  <div class="InstQuiz">

      <audio id="audio" autoplay></audio>

    <div :class="getClass('second', 'cream', 'mt-2 p-2 head')">
            <h2 align="center"> {{ titles[testType] }} </h2>
    </div>

    <ToolbarQuiz :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" v-on:newTest="start($event)"  v-on:cancel="$emit('cancel')"></ToolbarQuiz>
    <div v-if="showTest">
        <b-progress :value="filter" style="height:30px" :max="testItems.length" variant="warn-light" show-progress animated></b-progress>

      <div class="bg-grey" v-if="showTest">
       <div v-for="(item, key) in testItems" :key="key">
          <div class="bg-second questionDiv" @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: 'active1' }" v-if="testItems.indexOf(item) === filter" align="center">
              <h3>
                <span v-if="settings.sound !== 'sdEx' || hover == true"> {{ item.Question }} </span>
                <span v-if="settings.sound == 'sdEx' || settings.sound == 'sdOn'"> <b-icon-soundwave></b-icon-soundwave></span>
              </h3>
          </div>

          <div v-if="testItems.indexOf(item) === filter" class="p-3">
            <div v-for="(choice, index) in item.Choices" :key="index">
              <button class="answerBtn bg-prime text-cream" :name="item.Question" :id="item.Question + choice.Answer" block @click="recordAnswer(item.Question, item.Answer, choice.Answer)">
                {{ choice.Answer }}
              </button>
                <br>
                <br>
            </div>
          </div>

       </div>
      </div>
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
import ToolbarQuiz from './ToolbarQuiz'
import InstAns from './InstAns'

export default {
  name: 'InstQuiz',
  components: {
    ToolbarQuiz,
    InstAns
  },
  props: {
    s3: String,
    exit: Boolean
  },
  data () {
    return {
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
      fields: ['English', 'Chinese'],
      titles: {
        'C>E': 'Chinese --> English',
        'E>C': 'English --> Chinese'
      }
    }
  },
  computed: {
    dictGet () {
      return this.$store.getters.makeList
    },
    starGet () {
      console.log('stars', this.$store.getters.starGet)
      return this.$store.getters.starGet
    },
    testType () {
      return this.$store.state.instructor.testRecords[this.$store.state.instructor.activeQuiz].type
    }
  },
  methods: {
    recordAnswer: function (english, chinese, choice) {
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
      console.log(data)
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
      this.$store.dispatch('testActive', false)
      this.$emit('quizData', { answerData: this.answerData, score: this.sCount, time: this.timeSpan() })
    },
    cancel: function () {
      console.log('cancel')
      this.filter = null
      this.showTest = false
      this.endTime = new Date()
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
        return minutes.toString() + ' m' + seconds.toString() + ' s'
      } else {
        return Math.floor(time).toString() + ' seconds'
      }
    },
    playAudio: function (arg) {
      console.log('PLAY', arg)
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
    }
  },
  watch: {
    filter: function () {
      let sound = this.testItems[this.filter]
      if (sound && this.settings.sound !== 'sdOff') {
        this.playAudio(sound.sdQue)
      }
    },
    hover: function () {
      if (this.hover) {
        console.log('hover_active')
        let sound = this.testItems[this.filter]
        this.playAudio(sound.sdQue)
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

.active {
  background: #bbe0eb;
}

</style>
