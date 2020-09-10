<template>
  <div>
    <TransEngMatch :testType="testType" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" v-if="testType === 'TransEng'"></TransEngMatch>

    <b-container v-if="testType === null">
            <div class="mt-2 bg-prime p-2">
            <h2 class="text-third" align="center">
              Online Area
            </h2>
            </div>
            <div class="mt-2 bg-prime p-2">
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
                <button class="buttonDiv bg-third" @click="addFriend()">Add</button>
            </div>

          <div class="mt-2 bg-second p-2">
            <h3> Online </h3>
            <b-list-group>
            <div v-for="(user, index) in onlineUsers" :key="index">
            <b-list-group-item  v-if="!challengeUsers[index]" class="d-flex align-items-center bg-cream">
                  <b-avatar :src="s3 + index + '/avatar.jpg'"  size="50px" :badge="user" badge-offset="-0.5em" badge-variant="safe"></b-avatar>
                  <button class="buttonDiv bg-p1 mx-3"  @click="challenge(index, 'TransEng')"> Eng --> Ch </button>
            </b-list-group-item>
            </div>
          </b-list-group>
          </div>

          <div class="mt-2 bg-second p-2">
            <h3> Challengers </h3>
            <b-list-group>
              <div v-for="(chall, index) in challengeUsers" :key="index" >
                <b-list-group-item v-if="onlineUsers[index]" class="d-flex align-items-center bg-cream">
                  <b-avatar :src="s3 + index.toString() + '/avatar.jpg'"  size="50px" :badge="chall.sender" badge-offset="-0.5em" badge-variant="p1"></b-avatar>
                  <button class="buttonDiv bg-p2 mx-3 " @click="acceptChallenge(chall.userID, chall.sender, chall.mode)"> {{chall.mode}} Accept </button>
                  <button class="buttonDiv bg-alert mx-3 " @click="declineChallenge(chall.userID)"> Decline </button>
                </b-list-group-item>
              </div>
          </b-list-group>
          </div>

          <div class="mt-2 bg-second p-2">
            <h3> Friends </h3>
            <b-list-group>
            <div v-for="(user, index) in friends" :key="index">
            <b-list-group-item  v-if="!onlineUsers[index]" class="d-flex align-items-center bg-cream">
                  <b-avatar :src="s3 + index + '/avatar.jpg'"  size="50px" :badge="user" badge-offset="-0.5em" badge-variant="alert"></b-avatar>
            </b-list-group-item>
            </div>
          </b-list-group>
          </div>

    </b-container>

    <b-modal ref="my-modal" id="bv-modal-example" title="Logging in...">
      <p> {{message}} </p>
    </b-modal>

  </div>
</template>

<script>
import TransEngMatch from './TransEngMatch'
import { openSocket } from '@/sockets'
import { checkFriend } from '@/api'

export default {
  name: 'Match',
  props: {
    s3: String
  },
  components: {
    TransEngMatch
  },
  data () {
    return {
      pageHead: 'Match Area',
      friends: {},
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
      socket: null,
      testType: null,
      p1: null,
      p2: null,
      p1name: null,
      p2name: null,
      player: null,
      message: null
    }
  },
  methods: {
    joinRoom: function () {
      this.socket.emit('join_room', {room: this.room, username: this.username, userID: this.userID})
    },
    startRoom: function () {
      this.socket.emit('start_room', {room: this.room, username: this.username, userID: this.userID})
    },
    sayHi: function (targetID) {
      this.socket.emit('sayHi', {userID: this.userID, username: this.username, targetID: targetID})
    },
    challenge: function (targetID, mode) {
      this.socket.emit('challenge', {userID: this.userID, username: this.username, targetID: targetID, mode: mode})
    },
    declineChallenge: function (uid) {
      delete this.challengeUsers[uid]
      this.challengeUsers = JSON.parse(JSON.stringify(this.challengeUsers))

      // console.log('sid', uid, this.challengeUsers)
      // let newUsers = {}
      // for (let c in this.challengeUsers) {
      //   console.log(c, uid)
      //   if (parseInt(c) !== uid) {
      //     newUsers[c] = this.challengeUsers[c]
      //   }
      // }
      // this.challengeUsers = newUsers
      // console.log('change', this.challengeUsers)
    },
    acceptChallenge: function (uid, p1name, mode) {
      this.socket.emit('accept', {p2: this.userID, p2name: this.username, p1: uid, p1name: p1name, mode: mode})
    },
    startSocket: function () {
      this.socket = openSocket()
      this.socket.emit('checkOnline', { userID: this.userID })
    },
    closeSocket: function () {
      this.socket.emit('offline', { userID: this.userID })
      this.socket.close()
    },
    addFriend: function () {
      let _this = this
      let friendName = this.friend.username
      let friendID = this.friend.userID
      return checkFriend({friendName: friendName, friendID: friendID, userID: _this.userID})
        .then(function (response) {
          if (response.data.check && response.data.friendID !== _this.userID) {
            console.log('response', response.data)
            _this.friends = JSON.parse(response.data.friends)
            _this.$store.dispatch('addFriend', {friendData: JSON.parse(response.data.friends)})
            alert('friend added')
          } else {
            alert('Cannot add friend. Please check username and user ID')
          }
        })
        .catch(error => {
          console.log('Error Registering: ', error)
        })
    }
  },
  watch: {
    challengeUsers: function () {
      this.challengeList = []
      for (let u in this.challengeUsers) {
        this.challengeList.push(this.challengeUsers[u].userID)
      }
      console.log(this.challengeList)
    }
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
      console.log('onlineUsers', data)
      _this.onlineUsers[data.userID] = data.username
      _this.onlineUsers = JSON.parse(JSON.stringify(_this.onlineUsers))
    })
    _this.socket.on('offlineUsers', function (data) {
      console.log('offlineUsers', data)
      delete _this.onlineUsers[data.userID]
      _this.onlineUsers = JSON.parse(JSON.stringify(_this.onlineUsers))
    })
    _this.socket.on('sayHi', function (data) {
      console.log(data)
      alert('Hello, from ' + data.sender)
    })
    _this.socket.on('disconnect', function (data) {
      console.log('disconnect')
    })
    _this.socket.on('challenge', function (data) {
      console.log('challenge', data)
      let challenge = { sender: data.sender, mode: data.mode, userID: data.userID }
      for (let c in _this.challengeUsers) {
        console.log(_this.challengeUsers[c], challenge)
        if (_this.challengeUsers[c].userID === challenge.userID) {
          console.log('found')
          return false
        }
      }
      _this.challengeUsers[challenge.userID] = challenge
      // very ugly way of triggering the watcher
      _this.challengeUsers = JSON.parse(JSON.stringify(_this.challengeUsers))
      console.log(_this.challengeUsers, _this.challengeList)
    })
    _this.socket.on('start', function (data) {
      console.log('start', data)
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
      _this.message = 'Sorry, ' + data.sender + ' has left the game'
      _this.$refs['my-modal'].show()
      _this.testType = null
      _this.p1 = null
      _this.p1name = null
      _this.p2 = null
      _this.p2name = null
      delete _this.onlineUsers[data.userID]
      _this.onlineUsers = JSON.parse(JSON.stringify(_this.onlineUsers))

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
