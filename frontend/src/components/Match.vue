<template>
  <div class="matchArea">
    <TransMatch v-on:leaveMatch="leaveMatch()" :testType="testType" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" v-if="testType && testType[1] === 'r'"></TransMatch>
    <TypeMatch v-on:leaveMatch="leaveMatch()" :testType="testType" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" v-if="testType && testType[1] === 'y'"></TypeMatch>
    <template v-if="waiting">
      <div v-if="testType === null">
          <div class="mt-2 bg-second p-2">
            <h2 class="text-cream" align="center">
              Match Zone
            </h2>
          </div>

          <div class="bg-prime text-third p-2">
            <b-row align="left">
              <b-col cols="7">
                <div style="color:red !important">
                    <b-form-radio-group
                      id="btn-radios-2"
                      v-model="gameSelect"
                      :options="gameTypes"
                      buttons
                      button-variant="p1"
                      name="radio-btn-outline"
                    ></b-form-radio-group>
                  </div>
              </b-col>
              <b-col align="right">
                <button class="buttonDiv bg-warn"  @click="friendAdder=!friendAdder"> Add <b-icon icon="person"></b-icon></button>
                <button class="buttonDiv bg-alert"  @click="friendDeleter=!friendDeleter"> Del <b-icon icon="x-square-fill"></b-icon> </button>
              </b-col>
            </b-row>
          </div>

          <div v-if="friendAdder" class="bg-prime p-2">
            <b-row no gutters>
              <b-col>
                <b-form inline>
                  <b-input
                    id="inline-form-input-name"
                    v-model="friend.username"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="Friend name"
                  ></b-input>
                  <b-input-group prepend="#" class="mb-2 mr-sm-2 mb-sm-0">
                    <b-input id="inline-form-input-username" placeholder="user ID" v-model="friend.userID"></b-input>
                  </b-input-group>
                </b-form>
              </b-col>
              <b-col>
                <button class="buttonDiv bg-third" style="width:100px" @click="addFriend()">Add</button>
              </b-col>
            </b-row>
          </div>

          <div class="bg-smoke text-prime p-2">

            <div v-for="(chall, indexC) in challengeUsers" :key="indexC" >
                <div v-if="onlineUsers[indexC]" class="d-flex align-items-center mt-2 p-2">
                  <b-avatar :src="s3 + indexC.toString() + '/avatar.jpg'"  size="50px" :badge="chall.sender" badge-offset="-0.5em" badge-variant="p1"></b-avatar>
                  &nbsp;&nbsp;
                  <button class="buttonDiv bg-smoke mx-1 " disabled> {{gameNames[chall.mode]}}</button>
                  <button class="buttonDiv bg-p2 mx-2" style="width:15%" @click="acceptChallenge(chall.userID, chall.sender, chall.mode)"> <b-icon icon="caret-right-square-fill"></b-icon> </button>
                  <button class="buttonDiv bg-alert mx-1" style="width:15%"  @click="declineChallenge(chall.userID)"> Del <b-icon icon="x-square-fill"></b-icon> </button>
                </div>
            </div>

            <div v-for="(user, indexO) in onlineUsers" :key="indexO">
              <div  v-if="!challengeUsers[indexO]" class="d-flex align-items-center p-3 mt-2">
                    <b-avatar :src="s3 + indexO + '/avatar.jpg'"  size="50px" :badge="user" badge-offset="-0.5em" badge-variant="safe"></b-avatar>
                    <button v-if="gameSelect" class="buttonDiv bg-prime mx-3" style="width:15%"  @click="challenge(indexO, gameSelect)"> <b-icon class="text-p1" icon="box-arrow-in-right"></b-icon></button>
                    <button v-if="friendDeleter" class="buttonDiv bg-alert mx-3" style="width:100px" @click="deleteFriend(indexO)"> <b-icon icon="x-square-fill"></b-icon></button>
              </div>
            </div>

            <div v-for="(user, indexF) in friends" :key="indexF">
              <div v-if="!onlineUsers[indexF]" class="d-flex align-items-center p-3 mt-2">
                    <b-avatar :src="s3 + indexF + '/avatar.jpg'"  size="50px" :badge="user" badge-offset="-0.5em" badge-variant="alert"></b-avatar>
                    <button v-if="friendDeleter" class="buttonDiv bg-alert mx-3" style="width:100px" @click="deleteFriend(indexF)"> <b-icon icon="x-square-fill"></b-icon></button>
              </div>
            </div>

          </div>

      </div>

    </template>

    <template v-else >
      <div align="center" class="mt-5">
        <h4 class="text-prime"> Updating friends.... </h4>
        <b-icon icon="person" animation="throb" variant="prime" font-scale="6"></b-icon>
      </div>
    </template>

    <b-modal align="center" ref="success" hide-footer title="Complete" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-safe text-cream" style="width:60%"  @click="hideModal('success')">Close</button>
    </b-modal>

   <b-modal align="center" ref="fail" hide-footer title="Problem Found" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('fail')">Close</button>
    </b-modal>

  </div>
</template>

<script>
import TransMatch from './TransMatch'
import TypeMatch from './TypeMatch'
import { openSocket } from '@/sockets'
import { checkFriend, deleteFriend } from '@/api'

export default {
  name: 'Match',
  props: {
    s3: String
  },
  components: {
    TransMatch,
    TypeMatch
  },
  data () {
    return {
      pageHead: 'Match Area',
      friends: {},
      friendAdder: false,
      friendDeleter: false,
      friend: {
        username: null,
        userID: null
      },
      username: null,
      userID: null,
      onlineUsers: {},
      userList: [],
      challengeUsers: {},
      challengeList: [],
      challengeMarker: null,
      socket: null,
      testType: null,
      p1: null,
      p2: null,
      p1name: null,
      p2name: null,
      player: null,
      message: null,
      waiting: true,
      msg: null,
      gameName: 'Select Game',
      gameSelect: 'TransEng',
      gameTypes: [
        { value: 'TransEng', text: 'En -> Ch' },
        { value: 'TransCh', text: 'Ch -> En' },
        { value: 'TypeMatch', text: 'Type' }
      ],
      gameNames: {
        TransEng: 'En -> Ch',
        TransCh: 'Ch -> En',
        TypeMatch: 'Type'
      }
    }
  },
  methods: {
    showModal: function () {
      this.$refs['success'].show()
    },
    showAlert: function () {
      this.$refs['fail'].show()
    },
    hideModal: function (mode) {
      if (mode === 'success') {
        this.$refs['success'].hide()
        this.waiting = true
      } else {
        this.$refs['fail'].hide()
        this.msg = null
        this.waiting = true
      }
    },
    startSocket: function () {
      this.socket = openSocket()
      this.socket.emit('checkOnline', { userID: this.userID })
    },
    closeSocket: function () {
      // this.socket.emit('offline', { userID: this.userID })
      this.socket.close()
    },
    leaveMatch: function () {
      console.log('leave activated')
      this.$store.dispatch('testActive')
      this.socket.emit('leftMatch', { userID: this.userID, p1: this.p1, p2: this.p2 })
      this.testType = null
      this.challengeUsers = {}
      this.p1 = null
      this.p1name = null
      this.p2 = null
      this.p2name = null
    },
    challenge: function (targetID, mode) {
      if (mode === null) {
        this.msg = 'Please set game type before making a challenge'
        this.showAlert()
      } else {
        // marker to stop two people challenging each other at the same time
        this.challengeMarker = targetID
        this.socket.emit('challenge', {userID: this.userID, username: this.username, targetID: targetID, mode: mode})
      }
    },
    declineChallenge: function (uid) {
      delete this.challengeUsers[uid]
      this.challengeUsers = JSON.parse(JSON.stringify(this.challengeUsers))
    },
    acceptChallenge: function (uid, p1name, mode) {
      this.socket.emit('accept', {p2: this.userID, p2name: this.username, p1: uid, p1name: p1name, mode: mode})
    },
    addFriend: function () {
      this.waiting = false
      let _this = this
      let friendName = this.friend.username
      let friendID = this.friend.userID
      return checkFriend({friendName: friendName, friendID: friendID, userID: _this.userID})
        .then(function (response) {
          if (response.data.check && response.data.friendID !== _this.userID) {
            console.log('response', response.data)
            _this.friends = JSON.parse(response.data.friends)
            _this.$store.dispatch('addFriend', {friendData: JSON.parse(response.data.friends)})
            _this.msg = 'Friend added:' + friendName + ' #' + friendID
            _this.closeSocket()
            _this.startSocket()
            _this.showModal()
          } else {
            _this.msg = 'Cannot add friend. Please check username and user ID'
            _this.showAlert()
          }
        })
        .catch(error => {
          console.log('Error Registering: ', error)
        })
    },
    deleteFriend: function (friendID) {
      this.waiting = false
      let _this = this
      return deleteFriend({friendID: friendID, userID: _this.userID})
        .then(function (response) {
          if (response.data.check) {
            console.log('response', response.data)
            _this.friends = JSON.parse(response.data.friends)
            _this.$store.dispatch('addFriend', {friendData: JSON.parse(response.data.friends)})
            _this.msg = 'Friend Deleted'
            _this.showModal()
          } else {
            _this.msg = 'Cannot delete friend right now'
            _this.showAlert()
          }
        })
        .catch(error => {
          console.log('Error Registering: ', error)
        })
    }
  },
  watch: {
    // challengeUsers: function () {
    //   this.challengeList = []
    //   for (let u in this.challengeUsers) {
    //     this.challengeList.push(this.challengeUsers[u].userID)
    //   }
    //   console.log(this.challengeList)
    // }
  },
  created () {
    console.log(this.s3)
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push('login')
      return false
    }

    let _this = this
    window.onbeforeunload = function () {
      if (_this.isAuthenticated && _this.$store.state.updateStatus === false) {
        _this.closeSocket()
      }
      return undefined
    }
  },
  beforeDestroy () {
    console.log('beforeDestroyMatch')
    this.closeSocket()
  },
  mounted () {
    this.userID = this.$store.state.userProfile.userID
    this.username = this.$store.state.userProfile.username
    this.friends = this.$store.state.logsRecord.friends
    this.startSocket()

    let _this = this
    _this.socket.on('onlineUsers', function (data) {
      console.log('onlineUsers0', _this.onlineUsers)
      if (_this.friends[data.userID]) {
        console.log('onlineUsers', data)
        _this.onlineUsers[data.userID] = data.username
        _this.onlineUsers = JSON.parse(JSON.stringify(_this.onlineUsers))
      }
    })
    _this.socket.on('offlineUsers', function (data) {
      console.log('offlineUsers', data)
      delete _this.onlineUsers[data.userID]
      _this.onlineUsers = JSON.parse(JSON.stringify(_this.onlineUsers))
    })
    _this.socket.on('disconnect', function (data) {
      console.log('disconnect')
    })
    _this.socket.on('challenge', function (data) {
      console.log('challenge', data)
      // stops two people sending challange at the same time
      if (_this.challengeMarker === data.userID) {
        _this.challengeMarker = null
        return false
      } else {
        let challenge = { sender: data.sender, mode: data.mode, userID: data.userID }
        for (let c in _this.challengeUsers) {
          console.log(_this.challengeUsers[c], challenge)
          if (_this.challengeUsers[c].userID === challenge.userID) {
            console.log('found')
            return false
          }
        }
        _this.challengeMarker = null
        _this.challengeUsers[challenge.userID] = challenge
      }
      // very ugly way of triggering the watcher
      // dupicate keys warning '2' meaning anita is observed twice?
      _this.challengeUsers = JSON.parse(JSON.stringify(_this.challengeUsers))
    })
    _this.socket.on('start', function (data) {
      console.log('start', data)
      _this.$store.dispatch('testActive')
      _this.challengeMarker = null
      _this.testType = data.mode
      _this.p1 = data.p1
      _this.p1name = data.p1name
      _this.p2 = data.p2
      _this.p2name = data.p2name
      if (_this.p1 === _this.$store.state.userProfile.userID) {
        _this.player = 'p1'
      } else {
        _this.player = 'p2'
      }
      console.log('player', _this.player)
    })
    _this.socket.on('leftRoom', function (data) {
      console.log('left', data)
      if (_this.testType) {
        _this.msg = 'Game Ended, ' + data.sender + ' has left the game'
        _this.showAlert()
        _this.leaveMatch() // this will clear the match and send an emit to leave the room if the player is away
      } else {
        _this.msg = 'You have left the match'
        _this.showModal()
      }
    })
    _this.socket.on('kickOff', function (data) {
      console.log('ko', data)
      if (_this.testType) {
        _this.msg = 'Game Ended, ' + data.opponent + ' has left the game'
        _this.showAlert()
        _this.leaveMatch()
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.userList {
  padding: 3px;
  margin-top: 2px
}

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
