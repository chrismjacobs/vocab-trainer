<template>
  <div>
    <b-container v-if="!showTest">
      <b-card class="my-2">
        <h2>
          {{ pageHead }}
        </h2>
      </b-card>
    </b-container>

    <b-container v-if="!showTest">
      <b-card class="my-2" >
        <b-button  @click="createMatch()">MATCH</b-button>
        <b-button  @click="startRoom()"> Start Room </b-button>
        <b-button  disabled> Room: {{ room }} </b-button>

          <b-form-input v-model="room"></b-form-input>
          <b-button @click="joinRoom()">Join Room</b-button>

      </b-card>
    </b-container>

    <b-container class="d-none d-lg-block">
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
            <b-progress :value="time" max="60000" animated style="height:30px" variant="alert"></b-progress>
          </b-col>
        </b-row>
      </b-card>
    </b-container>

    <b-container>
      <b-card>
        <b-row class="text-center">
          <div v-for="(btn, idx) in buttons" :key="idx" class="d-inline">
            <b-col :class="btn.class" @click="pressedBtn.push(btn)" :name="btn.name" align-v="center">
                <span class="textLine"> {{ btn.caption }} </span>
            </b-col>
          </div>
        </b-row>
      </b-card>
    </b-container>

    <b-container class="d-lg-none">
      <b-card class="my-2" cols="10" v-if="showTest">
        <b-row>
          <b-col cols="11" class="mt-1">
            <b-progress :value="answerCount" :max="answerMax" animated style="height:10px"></b-progress>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="11" class="mt-1">
            <b-progress :value="time" max="60000" animated style="height:10px" variant="danger"></b-progress>
          </b-col>
        </b-row>
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
      username: null,
      userID: null,
      tableItems: null,
      stringItems: null,
      matchNumber: 6,
      buttons: [],
      btnWatch: null,
      pressedBtn: [],
      showTest: false,
      answerCount: null,
      answerMax: 6,
      time: 60000,
      clock: null,
      socket: null,
      room: null,
      basicClass: 'basic bg-prime text-warn p-3 m-1'
    }
  },
  methods: {
    createMatch: function () {
      this.buttons = []
      let vocab = this.shuffle(this.tableItems)
      let testVocab = vocab.slice(0, this.matchNumber)
      for (let item in testVocab) {
        this.buttons.push(
          { caption: testVocab[item].English, name: testVocab[item].English, class: this.basicClass },
          { caption: testVocab[item].Chinese, name: testVocab[item].English, class: this.basicClass }
        )
      }
      this.showTest = true
      this.answerCount = 0
      this.setCountdown()
      // this.shuffle(this.buttons)
    },
    joinRoom: function () {
      this.socket.emit('join_room', {room: this.room, username: this.username, userID: this.userID})
    },
    startRoom: function () {
      this.socket.emit('start_room', {room: this.room, username: this.username, userID: this.userID})
    },
    clearSync: function () {
      for (let btn in this.buttons) {
        this.buttons[btn].class = this.basicClass
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
        { caption: newItem.English, name: newItem.English, class: this.basicClass },
        { caption: newItem.Chinese, name: newItem.English, class: this.basicClass }
      )
      // this.buttons = this.shuffle(newButtons)
      this.buttons = newButtons
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
    },
    buttonChange: function (b) {
      for (let btn in this.buttons) {
        if (this.buttons[btn] === b) {
          this.buttons[btn].class = 'basic bg-warn text-prime p-3 m-1'
        }
      }
    }
  },
  watch: {
    pressedBtn: function () {
      if (this.pressedBtn.length > 1) {
        if (this.pressedBtn[0].name === this.pressedBtn[1].name) {
          // alert('CORRECT')
          this.clearSync()
          this.deleteButtons(this.pressedBtn[0].name)
          this.pressedBtn = []
          this.answerCount += 1
        } else {
          this.time -= 5000
          this.pressedBtn = []
          this.clearSync()
        }
      } else {
        this.buttonChange(this.pressedBtn[0])
      }
      if (this.btnWatch !== JSON.stringify(this.buttons)) {
        this.socket.emit('buttons', {buttons: JSON.stringify(this.buttons), room: this.room})
      }
    },
    buttons: function () {
      if (this.btnWatch !== JSON.stringify(this.buttons)) {
        this.socket.emit('buttons', {buttons: JSON.stringify(this.buttons), room: this.room})
      }
    }
  },
  created () {
    this.username = this.$store.state.userProfile.username
    this.userID = this.$store.state.userProfile.userID
    this.tableItems = this.$store.getters.makeList
    this.stringItems = JSON.stringify(this.tableItems)
    this.socket = openSocket()
  },
  beforeDestroy () {
    this.socket.emit('offline', { username: this.username, userID: this.userID, room: this.room })
    this.socket.close()
  },
  mounted () {
    let _this = this
    _this.socket.on('buttons', function (data) {
      console.log('socketBTNS', data)
      _this.btnWatch = JSON.stringify(data.buttons)
      _this.buttons = data.buttons
    })

    _this.socket.on('roomReady', function (data) {
      console.log('roomReady', data)
      _this.room = data.room
    })

    _this.socket.on('playerReady', function (data) {
      console.log('roomReady', data)
      _this.room = data.room
    })
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.basic {
  width:300px;
  height:100px;
  line-height: 100px;
  display:flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width:650px) {
  .basic {
    width:130px;
    height:60px;
    line-height: 60px;
    display:flex;
    align-items: center;
    justify-content: center;
    font-size: 25px
  }
}

.textLine {
  font-size: 40px;
  line-height: 50px;
}

@media screen and (max-width:650px) {
  .textLine {
  font-size: 18px;
  line-height: 21px;
  }
}
</style>
