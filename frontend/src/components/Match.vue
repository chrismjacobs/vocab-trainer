<template>
  <div>
    <TransEngMatch :testType="testType" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" v-if="testType === 'TransEng'"></TransEngMatch>

    <b-container v-if="testType === null">
            <div class="mt-2 bg-secondary p-2">
            <h2 class="text-sand" align="center">
              Online Area
            </h2>
            </div>
          <div>
            <h3> Friends Online  </h3>
            <b-list-group>
            <div v-for="(user, index) in onlineUsers" :key="index">
            <b-list-group-item  v-if="!challengeList.includes(user.userID)" class="d-flex align-items-center">
                  <b-avatar :src="s3 + user.userID + '.jpg'" :text="user.username[0]" class="mr-3"></b-avatar>
                <span class="mr-auto">{{ user.username }}</span>
                <div v-if="user.userID !== userID">
                  <b-button  @click="sayHi(user.userID)"> Say Hi </b-button>
                  <b-button  @click="challenge(user.userID, 'TransEng')"> TransEng Match </b-button>
                </div>
            </b-list-group-item>
            </div>
          </b-list-group>
          </div>

          <div>
            <h3> Challengers </h3>
            <b-list-group>
              <div v-for="(chall, index) in challengeUsers" :key="index" >
                <b-list-group-item v-if="userList.includes(chall.userID)" class="d-flex align-items-center">
                  <b-avatar :id="index" :src="s3 + chall.userID + '.jpg'" :text="chall.sender[0]" class="mr-3"></b-avatar>
                  <span class="mr-auto">{{ chall.sender }}</span>
                  <span class="mr-auto">{{ chall.mode }}</span>
                  <b-button @click="acceptChallenge(chall.userID, chall.sender, chall.mode)"> Accept </b-button>
                  <b-button @click="declineChallenge(chall.userID)"> Decline </b-button>
                </b-list-group-item>
              </div>
          </b-list-group>
          </div>
    </b-container>

  </div>
</template>

<script>
import TransEngMatch from './TransEngMatch'

export default {
  name: 'Match',
  components: {
    TransEngMatch
  },
  data () {
    return {
      s3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/',
      pageHead: 'Match Area',
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
      player: null
    }
  },
  methods: {
    joinRoom: function () {
      this.socket.emit('join_room', {room: this.room, username: this.username, userID: this.userID})
    },
    startRoom: function () {
      this.socket.emit('start_room', {room: this.room, username: this.username, userID: this.userID})
    },
    sayHi: function (sid) {
      this.socket.emit('sayHi', {userID: this.userID, username: this.username, target: sid})
    },
    challenge: function (sid, mode) {
      this.socket.emit('challenge', {userID: this.userID, username: this.username, target: sid, mode: mode})
    },
    declineChallenge: function (uid) {
      console.log('sid', uid, this.challengeUsers)
      let newUsers = {}
      for (let c in this.challengeUsers) {
        console.log(c, uid)
        if (parseInt(c) !== uid) {
          newUsers[c] = this.challengeUsers[c]
        }
      }
      this.challengeUsers = newUsers
      console.log('change', this.challengeUsers)
    },
    acceptChallenge: function (uid, p1name, mode) {
      this.socket.emit('accept', {p2: this.userID, p2name: this.username, p1: uid, p1name: p1name, mode: mode})
    }
  },
  watch: {
    onlineUsers: function () {
      this.userList = []
      for (let u in this.onlineUsers) {
        this.userList.push(this.onlineUsers[u].userID)
      }
      console.log(this.userList)
    },
    challengeUsers: function () {
      this.challengeList = []
      for (let u in this.challengeUsers) {
        this.challengeList.push(this.challengeUsers[u].userID)
      }
      console.log(this.challengeList)
    }
  },
  created () {
    this.userID = this.$store.state.userProfile.userID
    this.username = this.$store.state.userProfile.username
    this.$store.dispatch('openSocket')
    this.socket = this.$store.state.socket
  },
  beforeDestroy () {
    this.socket.emit('offline', { userProfile: this.$store.state.userProfile })
    this.socket.close()
  },
  mounted () {
    let _this = this
    _this.socket.on('onlineUsers', function (data) {
      console.log('onlineUsers', data)
      _this.onlineUsers = JSON.parse(data.userList)
      console.log(_this.onlineUsers)
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
