<template>
  <div class="matchArea">
    <TransMatch  v-on:leave="leaveMatch()" :testType="testType" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" v-if="testType && testType[1] === 'r'"></TransMatch>
    <TypeMatch   v-on:leave="leaveMatch()" :testType="testType" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" v-if="testType && testType[1] === 'y'"></TypeMatch>
    <template v-if="waiting && friends !== null">
      <div v-if="testType === null">
            <div class="mt-2 p-2 bg-grape head">
              <h2 class="text-cream" align="center">
                Match Zone
              </h2>
            </div>

            <div class="bg-third text-third p-2">
              <b-row align="left">
                <b-col cols="10">
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
                <b-col align="right" style="display:none">
                  <button class="buttonDiv bg-warn mt-2"  @click="friendAdder=!friendAdder"> Add <b-icon icon="person"></b-icon></button>
                  <button class="buttonDiv bg-alert mt-2"  @click="friendDeleter=!friendDeleter"> Del <b-icon icon="x-square-fill"></b-icon> </button>
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

              <b-table
                :items="friends"
                :fields="fields"
                thead-class="d-none"
                :filter="selected"
                :filter-function="filterWaiting"
                v-model="waiter"
                >
                  <template v-slot:cell(id)="data">
                    <b-row>
                      <b-col>
                       <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="2rem"></b-avatar> <div align="center" @click="acceptChallenge(data.item.id, data.item.mode)" class="nameTag bg-p1 text-prime">{{data.item.name}} <b-icon icon="circle-fill" animation="throb"></b-icon></div>
                      </b-col>
                      <b-col cols="3" align="right" class="pr-3">
                        <button class="buttonDiv bg-alert mx-1" style="width:40px"  @click="declineChallenge(data.item.id)"> <b-icon icon="x-square-fill"></b-icon> </button>
                      </b-col>
                    </b-row>

                  </template>
              </b-table>

              <b-table
                :items="friends"
                :fields="fields"
                thead-class="d-none"
                :filter="selected"
                :filter-function="filterChallenge"
                v-model="challenger"
                >
                  <template v-slot:cell(id)="data">
                    <b-row>
                      <b-col>
                        <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="2rem"></b-avatar> <div align="center" class="nameTag bg-p2 text-cream">{{data.item.name}} <b-icon icon="circle-fill" animation="throb"></b-icon></div>
                      </b-col>
                      <b-col cols="3" align="right" class="pr-3">
                        <button  class="buttonDiv bg-alert mx-1" style="width:40px"  @click="challengeRetract(data.item.id)"> <b-icon icon="x-square-fill"></b-icon> </button>
                      </b-col>
                    </b-row>
                  </template>
              </b-table>

              <b-table
                v-if="waiter.length === 0 && challenger.length === 0"
                :items="friends"
                :fields="fields"
                thead-class="d-none"
                :filter="selected"
                :filter-function="filterOnline"
                >
                  <template v-slot:cell(id)="data">
                    <div v-if="data.item.status === 1">
                      <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="2rem"></b-avatar> <div align="center" class="nameTag bg-safe text-cream">{{data.item.name}}</div><button v-if="gameSelect" class="buttonDiv bg-prime mx-3" style="width:15%"  @click="challengeSend(data.value, gameSelect)"> <b-icon class="text-p1" icon="box-arrow-in-right"></b-icon></button>
                      <button v-if="friendDeleter" class="buttonDiv bg-alert mx-3" style="width:100px" @click="deleteFriend()"> <b-icon icon="x-square-fill"></b-icon></button>
                    </div>
                    <div v-else>
                      <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="2rem"></b-avatar> <div align="center" class="nameTag bg-warn text-cream">{{data.item.name}}</div>
                   </div>
                  </template>
              </b-table>

              <b-table
                v-if="waiter.length === 0 && challenger.length === 0"
                :items="friends"
                :fields="fields"
                thead-class="d-none"
                :filter="selected"
                :filter-function="filterOffline"
                >
                  <template v-slot:cell(id)="data">
                      <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="2rem"></b-avatar> <div align="center" class="nameTag bg-alert text-cream">{{data.item.name}}</div>
                  </template>
              </b-table>

              </div>
      </div>
    </template>

    <template v-else >
      <div align="center" class="mt-5">
        <h4 class="text-prime"> Updating.... </h4>
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

   <b-modal align="center" ref="quit" hide-footer title="Game Over" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-third text-prime" style="width:60%"  @click="hideModal('quit')">Close</button>
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
      fields: [
        {key: 'id'}
      ],
      selected: 'true',
      waiter: [],
      challenger: [],
      pageHead: 'Match Area',
      friends: null,
      friendAdder: false,
      friendDeleter: false,
      friend: {
        username: null,
        userID: null
      },
      username: null,
      userID: null,
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
      gameSelect: 'TransEng',
      gameTypes: [
        { value: 'TransEng', text: 'En -> Ch' },
        { value: 'TransCh', text: 'Ch -> En' },
        { value: 'TypeMatch', text: 'Spelling' }
      ],
      gameNames: {
        TransEng: 'En -> Ch',
        TransCh: 'Ch -> En',
        TypeMatch: 'Spelling'
      }
    }
  },
  methods: {
    filterOnline: function (row) {
      if (row.status === 1 || row.status === 2) {
        return true
      }
    },
    filterOffline: function (row) {
      if (row.status === 0) {
        return true
      }
    },
    filterChallenge: function (row) {
      if (row.status === 3) {
        return true
      }
    },
    filterWaiting: function (row) {
      if (row.status === 4) {
        return true
      }
    },
    showModal: function () {
      this.$refs['success'].show()
    },
    showAlert: function () {
      this.$refs['fail'].show()
    },
    showQuit: function () {
      this.$refs['quit'].show()
    },
    hideModal: function (mode) {
      if (mode === 'success') {
        this.$refs['success'].hide()
        this.waiting = true
      } else if (mode === 'success') {
        this.$refs['fail'].hide()
        this.waiting = true
      } else {
        this.$refs['quit'].hide()
        this.$emit('resetMatch')
      }
    },
    startSocket: function () {
      console.log('STARTSOCKET')
      this.socket = openSocket()
      this.socket.emit('checkOnline', { userID: this.userID })
    },
    closeSocket: function () {
      this.socket.close()
    },
    leaveMatch: function () {
      this.socket.emit('resetEmit')
      console.log('leave activated')
    },
    challengeSend: function (targetID, mode) {
      // this.challengeMarker = targetID
      let payload = {userID: this.userID, username: this.username, targetID: targetID, mode: mode, action: 'send'}
      console.log('send challenge', payload)
      this.socket.emit('challenge', payload)
      let found = this.friends.find(element => element.id === targetID)
      found.status = 3
    },
    challengeRetract: function (targetID, mode) {
      // this.challengeMarker = targetID
      let payload = {userID: this.userID, username: this.username, targetID: targetID, mode: 'mode', action: 'retract'}
      console.log('retract challenge', payload)
      this.socket.emit('challenge', payload)
      let found = this.friends.find(element => element.id === targetID)
      found.status = 1
    },
    declineChallenge: function (targetID, mode) {
      let payload = {userID: this.userID, username: this.username, targetID: targetID, mode: 'mode', action: 'decline'}
      console.log('decline challenge', payload)
      this.socket.emit('challenge', payload)
      let found = this.friends.find(element => element.id === targetID)
      found.status = 1
    },
    acceptChallenge: function (targetID, mode) {
      let payload = {userID: this.userID, username: this.username, targetID: targetID, mode: mode, action: 'accept'}
      console.log(' accept challenge', payload)
      this.socket.emit('challenge', payload)
      // this.socket.emit('accept', {p2: this.userID, p2name: this.username, p1: uid, p1name: p1name, mode: mode})
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
            _this.$emit('resetMatch')
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
          console.log('Error Deleting: ', error)
        })
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
    // window.onblur = function () {
    //   if (_this.isAuthenticated && _this.$store.state.updateStatus === false) {
    //     _this.closeSocket()
    //   }
    //   return undefined
    // }
  },
  beforeDestroy () {
    console.log('beforeDestroyMatch')
    this.closeSocket()
  },
  mounted () {
    // 0 offline
    // 1 online
    // 2 busy
    // 3 challenge sent
    // 4 challenge waiting
    this.userID = this.$store.state.userProfile.userID
    this.username = this.$store.state.userProfile.username
    // this.friends = this.$store.state.userProfile.classmates
    this.startSocket()

    let _this = this

    _this.socket.on('offlineUsers', function (data) {
      console.log('offlineUsers', data)
      let found = _this.friends.find(element => element.id === data.userID)
      found.status = 0
    })
    _this.socket.on('onlineUsers', function (data) {
      console.log('onlineUsers', data)
      if (data.friends) {
        _this.friends = data.friends
      } else {
        let found = _this.friends.find(element => element.id === data.userID)
        found.status = 1
      }
    })
    _this.socket.on('busy', function (data) {
      console.log('busy', data)
      let found1 = _this.friends.find(element => element.id === data.userID)
      let found2 = _this.friends.find(element => element.id === data.targetID)
      if (data.action === 'send') {
        found1.status = 2
        found2.status = 2
      } else if (data.action === 'decline') {
        found1.status = 1
      } else {
        found1.status = 1
        found2.status = 1
      }
    })
    _this.socket.on('challengeMatch', function (data) {
      console.log('challengeMatch', data)
      let found = _this.friends.find(element => element.id === data.userID)
      if (data.action === 'decline') {
        found.status = 1
      } else if (data.action === 'retract') {
        found.status = 1
      } else {
        found.status = 4
        found['mode'] = data.mode
      }
    })
    _this.socket.on('start', function (data) {
      console.log('start', data)
      _this.$store.dispatch('testActive', true)
      _this.testType = data.mode

      let p1 = _this.friends.find(element => element.id === data.p1)

      if (p1) {
        _this.player = 'p2'
        _this.p1 = data.p1
        _this.p1name = p1.name
      } else if (p1 === undefined) {
        _this.player = 'p1'
        _this.p1 = data.p1
        _this.p1name = _this.username
      } else {
        console.log('PLAYER ERROR')
      }

      _this.p2 = data.p2
      _this.p2name = data.p2name

      console.log('player', _this.player)
    })
    _this.socket.on('reset', function (data) {
      _this.$store.dispatch('testActive', false)
      if (_this.testType) {
        console.log('reset', data)
        _this.msg = 'Game Ended, ' + data.opponent + ' has left the game'
        _this.showQuit()
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

.nameTag {
  width: 160px;
  height: 35px;
  display: inline-block;
  margin-left: 2px;
  padding: 3px;
  border: 0px solid #CCC;
  box-shadow: 0 0 5px -1px rgba(0,0,0,0.3);
  border-radius: 12px;
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
