<template>
  <div>
    <b-container>
      <b-card class="my-2">
        <h2>
          {{ pageHead }}
        </h2>
      </b-card>
    </b-container>

    <b-container>
      <b-card class="my-2" v-if="!showTest">
        <b-button @click="createMatch()">START</b-button>
        <b-button @click="connectSocket()">CONNECT</b-button>
        <b-button @click="disconnectSocket()">DISCONNECT</b-button>
      </b-card>
    </b-container>

    <b-container>
      <b-card class="my-2" cols="10" v-if="showTest">
        <b-row>
          <b-col cols="1">
            <h4>{{answerCount}}</h4>
          </b-col>
          <b-col cols="11" class="mt-1">
            <b-progress :value="answerCount" :max="answerMax" animated style="height:30px"></b-progress>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="1">
            <h4>{{time/1000}}</h4>
          </b-col>
          <b-col cols="11" class="mt-1">
            <b-progress :value="time" max="60000" animated style="height:30px" variant="danger"></b-progress>
          </b-col>
        </b-row>
      </b-card>
    </b-container>

    <b-container>
      <b-card>
          <div v-for="(btn, idx) in buttons" :key="idx" class="d-inline">

            <b-button pill size="lg"
            style="width:300px"
            class="m-2"
            :pressed.sync="btn.state"
            :variant="btn.variant"
            :disabled="btn.disabled"
            :id="btn.id"
            @click="pressedBtn.push(btn.name)"
            >
              {{ btn.caption }}
            </b-button>
          </div>

      </b-card>
    </b-container>
  </div>
</template>

<script>
import {openSocket} from '@/sockets'

export default {
  name: 'MatchTest',
  data () {
    return {
      pageHead: 'Matching',
      tableItems: null,
      stringItems: null,
      matchNumber: 6,
      buttons: [],
      pressedBtn: [],
      showTest: false,
      answerCount: null,
      answerMax: 6,
      time: 60000,
      clock: null,
      socket: null
    }
  },
  methods: {
    createMatch: function () {
      this.buttons = []
      let vocab = this.shuffle(this.tableItems)
      let testVocab = vocab.slice(0, this.matchNumber)
      for (let item in testVocab) {
        this.buttons.push(
          { caption: testVocab[item].English, state: false, disabled: false, variant: 'outline-primary', name: testVocab[item].English },
          { caption: testVocab[item].Chinese, state: false, disabled: false, variant: 'outline-primary', name: testVocab[item].English }
        )
      }
      this.showTest = true
      this.answerCount = 0
      this.setCountdown()
      // this.shuffle(this.buttons)
    },
    connectSocket: function () {
      this.socket.emit('new', {'msg': 'ready'})
    },
    disconnectSocket: function () {
      this.socket.close()
    },
    clearSync: function () {
      for (let btn in this.buttons) {
        this.buttons[btn].state = false
      }
    },
    deleteButtons: function (label) {
      let newButtons = []
      for (let btn in this.buttons) {
        // console.log(this.buttons[btn].id[0])
        if (this.buttons[btn].name !== label) {
          newButtons.push(this.buttons[btn])
        }
      }
      this.answerMax += 1
      let newItem = this.shuffle(this.tableItems)[0]
      newButtons.push(
        { caption: newItem.English, state: false, disabled: false, variant: 'outline-primary', name: newItem.English },
        { caption: newItem.Chinese, state: false, disabled: false, variant: 'outline-primary', name: newItem.English }
      )
      // this.buttons = this.shuffle(newButtons)
      this.buttons = newButtons
    },
    markButtons: function (label) {
      for (let btn in this.buttons) {
        if (this.buttons[btn].name === label) {
          this.buttons[btn].variant = 'warning'
          this.buttons[btn].disabled = true
        }
      }
    },
    resetGame: function () {
      clearInterval(this.clock)
      this.clock = null
      this.pressedBtn = []
      this.buttons = []
      this.time = 60000
      this.answerCount = null
      this.answerMax = 6
      this.showTest = false
    },
    setCountdown: function () {
      this.time = 60000
      let _this = this
      this.clock = setInterval(function () {
        if (_this.time <= 0) {
          _this.resetGame()
        } else {
          _this.time -= 1000
        }
      }, 1000)
    },
    shuffle: function (array) {
      // Fisher-Yates shuffle
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
  },
  watch: {
    pressedBtn: function () {
      if (this.pressedBtn.length > 1) {
        if (this.pressedBtn[0] === this.pressedBtn[1]) {
          // alert('CORRECT')
          this.clearSync()
          this.deleteButtons(this.pressedBtn[0])
          this.pressedBtn = []
          this.answerCount += 1
        } else {
          // alert('INCORRECT')
          this.time -= 5000
          this.pressedBtn = []
          this.clearSync()
        }
      }
    }
  },
  created () {
    this.tableItems = this.$store.getters.makeList
    this.stringItems = JSON.stringify(this.tableItems)
    this.socket = openSocket()
  },
  beforeDestroy () {
    let userProfile = this.$store.state.userProfile
    this.socket.emit('offline', { username: userProfile.username, studentID: userProfile.studentID })
    this.socket.close()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.btn:focus {
    outline:none !important;
    outline-width: 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}

</style>
