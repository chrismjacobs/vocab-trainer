<template>
  <div class="TransEng">

      <audio id="audio" autoplay></audio>

    <Toolbar :toolbarShow='showTest' :showAnswers='showAnswers' :testType="testType" :title="title" v-on:newTest="start($event)" v-on:retry="start()"></Toolbar>

      <b-card class="mt-2" v-if="showTest">
         <b-progress :value="filter" :max="testItems.length" show-progress animated></b-progress>
      </b-card>

    <div>
      <div class="mt-2 bg-warn" v-if="showTest">
       <div v-for="(item, key) in testItems" :key="key">
        <b-row>
          <b-col>
            <b-card @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: hover }" v-if="testItems.indexOf(item) === filter" align="center">
                <h3>
                  <span v-if="settings.sound !== 'sdEx' || hover == true"> {{ item.English }} </span>
                  <span v-if="settings.label==='lbOn' && settings.sound !== 'sdEx'" > &nbsp; ({{item.Gr}}) </span>
                  <span v-if="settings.sound == 'sdEx' || settings.sound == 'sdOn'"> <b-icon-soundwave></b-icon-soundwave></span>
                </h3>
            </b-card>
          </b-col>
         </b-row>
        <b-row>
          <b-col>
              <b-card v-if="testItems.indexOf(item) === filter">
                <div v-for="(choice, index) in item.Choices" :key="index">
                  <button class="answerBtn bg-third" @click="recordAnswer(item.English, item.Chinese, choice.Chinese)">
                   <span v-if="settings.label === 'lbAn' || settings.label === 'lbOn'"> ({{ choice.Gr }}) &nbsp; </span>  {{ choice.Chinese }}
                  </button>
                    <br>
                    <br>
                </div>
              </b-card>
          </b-col>
        </b-row>
       </div>
      </div>
    </div>
    <div v-if="showAnswers">
      <b-card class="mt-2">
        <b-table
        striped hover
        :items="answerData"
        :fields="fields"
        >
        </b-table>
      </b-card>
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
      testType: 'TransEng',
      title: 'English Test',
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
    playAudio: function (arg) {
      document.getElementById('audio').src = arg
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
      if (this.hover === true) {
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
