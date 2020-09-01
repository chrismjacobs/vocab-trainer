<template>
  <div class="TransEng">
    <audio id="audio" autoplay></audio>

     <div class="bg-second p-3" v-if="showProgress">
         <div class="mt-2 bg-third p-2" style="height:100px" align="center">
           <div style="width:45%;height:70px;display:inline-block;" class="">
             <b-avatar :src="s3 + p1.toString() + '.jpg'"  size="72px" :badge="p1name" badge-offset="-0.5em" badge-variant="p1"></b-avatar>
             <b-avatar v-if="ready.includes('p1')" icon="person-check" variant="safe"></b-avatar>
           </div>
           <div style="width:45%;height:70px;display:inline-block;" class="">
             <b-avatar :src="s3 + p2.toString() + '.jpg'" size="72px" :badge="p2name" badge-offset="-0.5em" badge-variant="p2"></b-avatar>
             <b-avatar v-if="ready.includes('p2')" icon="person-check" variant="safe"></b-avatar>
           </div>
         </div>
         <div>
            <b-progress  style="height:30px" :max="testItems.length"  class="mt-2" show-value>
                <b-progress-bar :value="progressValues.p1" variant="p1"></b-progress-bar>
                <b-progress-bar :value="progressValues.warn" variant="warn-light"></b-progress-bar>
                <b-progress-bar :value="progressValues.p2" variant="p2"></b-progress-bar>
              </b-progress>

            <br>

            <b-progress v-if="time" :value="time" max="5000" animated variant="alert"></b-progress>
          </div>
      </div>

    <ToolbarMatch :toolbarShow='showTest' :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :socket="socket" :player="player" :waiting="waiting" :showAnswers='showAnswers' :testType="testType" v-on:waitUpdate="waiting=1"></ToolbarMatch>

      <div v-if="showTest">
       <div v-for="(item, key) in testItems" :key="key">
          <div class="bg-third p-3" @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: hover }" v-if="testItems.indexOf(item) === filter" align="center">
              <h3>
                <span v-if="settings.sound !== 'sdEx' || hover == true"> {{ item.English }} </span>
                <span v-if="settings.sound == 'sdEx' || settings.sound == 'sdOn'"> <b-icon-soundwave></b-icon-soundwave></span>
              </h3>
          </div>

          <div v-if="testItems.indexOf(item) === filter">
            <div v-for="(choice, index) in item.Choices" :key="index">
              <button class="answerBtn bg-grey" :name="item.English" :id="item.English + choice.Chinese" block @click="recordAnswer(item.English, item.Chinese, choice.Chinese)">
                {{ choice.Chinese }}
              </button>
                <br>
                <br>
            </div>
          </div>

       </div>
      </div>

    <div v-if="showAnswers">
      <div class="mt-2">
        <b-table
        striped hover
        :items="answerData"
        :fields="fields"
        >
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import ToolbarMatch from './ToolbarMatch'

export default {
  name: 'TransEngMatch',
  components: {
    ToolbarMatch
  },
  props: {
    testType: String,
    p1: Number,
    p1name: String,
    p2: Number,
    p2name: String,
    player: String,
    socket: Object,
    s3: String
  },
  data () {
    return {
      waiting: 0,
      pageHead: 'English --> Chinese',
      toolbarShow: true,
      showToolbar: true,
      showAnswers: false,
      showTest: false,
      showProgress: true,
      hover: false,
      ready: [],
      answered: [],
      answerData: [],
      filter: null,
      testItems: [],
      settings: {},
      fields: ['English', 'Chinese'],
      time: null,
      clock: null,
      progressValues: {
        p1: 0,
        p2: 0,
        warn: 0
      }
    }
  },
  methods: {
    setCountdown: function () {
      this.time = 5000
      let _this = this
      this.clock = setInterval(function () {
        if (_this.time === 0) {
          clearInterval(_this.clock)
          _this.time = 5000
          _this.disableAll()
        } else {
          _this.time -= 100
        }
      }, 100)
    },
    start: function () {
      this.showAnswers = false
      this.filter = 0
      this.answerData = []
      this.showTest = true
      this.setCountdown()
    },
    readyCheck: function () {
      console.log('length', this.ready, this.ready.length)
      if (this.ready.length === 2) {
        this.waiting = 2
        let _this = this
        setTimeout(function () {
          _this.start()
          // go to true
          _this.$store.dispatch('testActive')
          _this.waiting = 0
          _this.ready = []
        }, 3000)
      }
    },
    recordAnswer: function (english, chinese, choice) {
      // console.log(data)
      let correct = chinese
      // required for disbaling buttons
      let btnID = english + choice
      // show if player was correct of not
      let result = (choice === correct)
      console.log('RESULT', result)

      this.socket.emit('answer', {room: this.p1, name: english, chinese: chinese, btnID: btnID, player: this.player, state: result})
    },
    disableAll: function () {
      let _this = this
      let english = this.testItems[this.filter].English
      let chinese = this.testItems[this.filter].Chinese
      let buttons = document.getElementsByName(english)
      console.log(buttons)
      for (let b in buttons) {
        console.log('buttons', b, buttons[b], this.time)
        if (b != 'length') {
          buttons[b].disabled = true
        }
      }
      setTimeout(function () {
        _this.answered = 0
        if (_this.answerData.length === _this.filter) {
          _this.enterResult(english, chinese, null, false)
          _this.filterToggle()
          _this.setCountdown()
        } else {
          console.log('duplicate answer', 'timeout')
        }
      }, 2000)
    },
    disable: function (name, btnID, player, state, chinese) {
      let btnClass = 'bg-' + player
      let button = document.getElementById(btnID)
      if (state) {
        button.classList.add('text-safe')
      } else {
        button.classList.add('text-alert')
      }
      button.classList.add(btnClass)
      button.disabled = true

      let buttons = document.getElementsByName(name)
      console.log(buttons)
      if (player === this.player) {
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true
        }
      }
      if (state) {
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true
        }
      }
      this.answered += 1

      if (state || this.answered > 1) {
        clearInterval(_this.clock)
        _this.time = 5000
        let _this = this
        setTimeout(function () {
          _this.answered = 0
          if (_this.answerData.length === _this.filter) {
            _this.enterResult(name, chinese, player, state)
            _this.filterToggle()
            _this.setCountdown()
          } else {
            console.log('duplicate answer', player)
          }
        }, 2000)
      }
    },
    enterResult: function (english, chinese, player, state) {
      console.log(state)

      let _rowVariant = 'warn'

      if (state) {
        _rowVariant = player
      }

      let entry = {
        English: english,
        Chinese: chinese,
        _rowVariant: _rowVariant
      }

      this.progressValues[_rowVariant] += 1
      console.log(_rowVariant, this.progressValues)

      this.answerData.push(entry)
    },
    filterToggle: function () {
      if (this.filter + 1 < this.testItems.length) {
        console.log(this.filter, this.testItems.length)
        this.time = 5000
        this.filter += 1
      } else {
        console.log('filterMax')
        // go back to false
        this.$store.dispatch('testActive')
        this.filter = null
        this.showTest = false
        this.checkAnswers()
      }
    },
    checkAnswers: function () {
      this.showAnswers = true
      // this.$store.dispatch('updateRecord', { mode: 'matchTransEng' })
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
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  mounted () {
    let _this = this
    _this.socket.on('go', function (data) {
      console.log('roomReady', data, data.testItems.length)
      _this.room = data.room
      if (data.testItems.length > 0) {
        _this.testItems = data.testItems
      }
      if (!_this.ready.includes(data.player)) {
        _this.ready.push(data.player)
        console.log(data.player)
      }
      _this.readyCheck()
    })
    _this.socket.on('answer', function (data) {
      _this.disable(data.name, data.btnID, data.player, data.state, data.chinese)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
