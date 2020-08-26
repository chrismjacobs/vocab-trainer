<template>
  <div class="TransEng">

      <audio id="audio" autoplay></audio>

    <ToolbarMatch :toolbarShow='showTest' :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :socket="socket" :player="player" :waiting="waiting" :showAnswers='showAnswers' :testType="testType"></ToolbarMatch>

      <b-card class="mt-2" v-if="showTest">
         <b-progress :value="filter" :max="testItems.length" show-progress animated></b-progress>
      </b-card>

    <div>
      <b-card class="mt-2" v-if="showTest">
       <div v-for="(item, key) in testItems" :key="key">
        <b-row>
          <b-col>
            <b-card @mouseover="hover=true" @mouseleave="hover=false" :class="{ active: hover }" v-if="testItems.indexOf(item) === filter" align="center">
                <h3>
                  <span v-if="settings.sound !== 'sdEx' || hover == true"> {{ item.English }} </span>
                  <span v-if="settings.sound == 'sdEx' || settings.sound == 'sdOn'"> <b-icon-soundwave></b-icon-soundwave></span>
                </h3>
            </b-card>
          </b-col>
         </b-row>
        <b-row>
          <b-col>
              <b-card v-if="testItems.indexOf(item) === filter">
                <div v-for="(choice, index) in item.Choices" :key="index">
                  <b-button :name="item.English" :id="item.English + choice.Chinese" variant="success" block @click="recordAnswer(item.English, item.Chinese, choice.Chinese)">
                    {{ choice.Chinese }}
                  </b-button>
                    <br>
                    <br>
                </div>
              </b-card>
          </b-col>
        </b-row>
       </div>
      </b-card>
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
    socket: Object
  },
  data () {
    return {
      waiting: 0,
      pageHead: 'English --> Chinese',
      toolbarShow: true,
      showToolbar: true,
      hover: false,
      showAnswers: false,
      ready: [],
      answered: [],
      showTest: false,
      answerData: [],
      filter: null,
      testItems: [],
      settings: {},
      fields: ['English', 'Chinese'],
      clock: null,
      time: 0
    }
  },
  methods: {
    recordAnswer: function (english, chinese, choice) {
      // console.log(data)
      let correct = chinese
      let btnID = english + choice

      if (choice === correct) {
        this.socket.emit('answer', {room: this.p1, name: english, chinese: chinese, btnID: btnID, player: this.player, state: true})
      } else {
        this.socket.emit('answer', {room: this.p1, name: english, chinese: chinese, btnID: btnID, player: this.player, state: false})
      }
    },
    filterToggle: function () {
      if (this.filter + 1 < this.testItems.length) {
        console.log(this.filter, this.testItems.length)
        this.filter += 1
      } else {
        console.log('filterMax')
        this.filter = null
        this.showTest = false
        this.checkAnswers()
      }
      this.clock = null
      this.time = 5000
    },
    disable: function (name, btnID, player, state, chinese) {
      let btnClass = 'btn-' + player
      let button = document.getElementById(btnID)
      if (state) {
        button.style.color = 'green'
      } else {
        button.style.color = 'red'
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
        let _this = this
        setTimeout(function () {
          _this.answered = 0
          _this.filterToggle()
          _this.enterResult(name, chinese, player, state)
        }, 2000)
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
    enterResult: function (english, chinese, player, state) {
      console.log(state)
      let _rowVariant = 'warning'
      if (state) {
        _rowVariant = player
      }
      let entry = {
        English: english,
        Chinese: chinese,
        _rowVariant: _rowVariant
      }
      this.answerData.push(entry)
    },
    checkAnswers: function () {
      this.showAnswers = true
      this.$store.dispatch('updateRecord', { mode: 'matchTransEng' })
    },
    playAudio: function (arg) {
      document.getElementById('audio').src = arg
    },
    readyCheck: function () {
      console.log('length', this.ready, this.ready.length)
      if (this.ready.length === 2) {
        this.waiting = 2
        let _this = this
        setTimeout(function () {
          _this.start()
          _this.waiting = 0
          _this.ready = []
        }, 3000)
      }
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
.active {
  background: rgb(95, 216, 95);
}

.btn .mistake {
  border: 2px solid #4CAF50; /* Green */
}

</style>
