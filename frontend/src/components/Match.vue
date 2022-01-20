<template>
  <div class="matchArea">
    <TransMatch  v-on:leave="leaveMatch()" :testType="testType" :gameOver="gameOver" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" :exit="exit" v-if="testType && testType[1] === 'r'"></TransMatch>
    <TransAI  v-on:leave="leaveMatch()" :testType="testType" :gameOver="gameOver" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" :exit="exit" v-if="testType && testType[1] === 'I' && testType[2] === 'T' "></TransAI>
    <MemoryAI  v-on:leave="leaveMatch()" :testType="testType" :gameOver="gameOver" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" :exit="exit" v-if="testType && testType[1] === 'I' && testType[2] === 'M' "></MemoryAI>
    <TypeMatch   v-on:leave="leaveMatch()" :testType="testType" :gameOver="gameOver" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" :exit="exit" v-if="testType && testType[1] === 'y'"></TypeMatch>
    <MemoryMatch v-on:leave="leaveMatch()" :testType="testType" :gameOver="gameOver" :p1="p1" :p2="p2" :p1name="p1name" :p2name="p2name" :player="player" :socket="socket" :s3="s3" :exit="exit" v-if="testType && testType[1] === 'e'"></MemoryMatch>
    <template v-if="waiting && friends !== null">
      <div v-if="testType === null">
            <div class="mt-2 p-2 bg-darkgrey head">
              <h2 class="text-cream" align="center">
                Game Zone
              </h2>
            </div>

            <div v-if="validClass === null" class="bg-grape text-cream p-2" align="center">
              <h5> Hellooo? Sorry no classmates here, please go to ACCOUNT and join a classroom first </h5>
              <h5> Or just play with AI Bot </h5>
            </div>

      <div class="helpTab1" v-if="$store.getters.getHelp && validClass"> <h6 style="border-bottom: 2px solid grey" v-for="(t, key) in breaker($store.getters.getHelp['Toolbar']['games'])" :key="key"> {{t}} </h6>  </div>

            <div class="bg-grey text-cream">
              <b-row align="center">
                <b-col>
                  <div>
                      <b-form-radio-group
                        id="btn-radios-2"
                        v-model="gameSelect"
                        :options="gameTypes"
                        buttons
                        style="width:100%"
                        :button-variant="gameColors[gameSelect]"
                        name="radio-btn-outline"
                      ></b-form-radio-group>
                    </div>
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
                      <b-col cols="8">
                       <div class="nameTag bg-p1 pt-2">
                         <b-row>
                           <b-col cols="3">
                             <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="1.5rem" class="ml-2"></b-avatar>
                           </b-col>
                           <b-col>
                             <span> {{getName(data.item.name)}} </span>
                             <b-icon icon="circle-fill" style="float:right" class="mr-2 mt-1" animation="throb"></b-icon>
                           </b-col>
                          </b-row>
                        </div>
                      </b-col>
                      <b-col>
                        <button :class="classColors[challengeMode]" style="width:60%;height:40px"  @click="acceptChallenge(data.item.id, data.item.mode)"> <b-icon icon="box-arrow-in-left"></b-icon> </button>
                        <b-icon @click="declineChallenge(data.item.id)" class="text-alert mt-1" style="float:right" font-scale="1.5" icon="x-square-fill"></b-icon>
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
                      <b-col cols="8">
                       <div class="nameTag bg-p2 pt-2">
                         <b-row>
                           <b-col cols="3">
                             <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="1.5rem" class="ml-2"></b-avatar>
                           </b-col>
                           <b-col>
                             <span> {{getName(data.item.name)}} </span>
                             <b-icon icon="circle-fill" style="float:right" class="mr-2 mt-1" animation="throb"></b-icon>
                           </b-col>
                          </b-row>
                        </div>
                      </b-col>
                      <b-col>
                        <b-icon v-if="data.item.id !== 100000" @click="challengeRetract(data.item.id)" class="text-alert mt-2" style="float:right" font-scale="1.5" icon="x-square-fill"></b-icon>
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
                    <b-row v-if="data.item.status === 1" >
                      <b-col cols="8">
                       <div class="nameTag bg-safe pt-2">
                         <b-row>
                           <b-col cols="3">
                             <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="1.5rem" class="ml-2"></b-avatar>
                           </b-col>
                           <b-col>
                             <span> {{getName(data.item.name)}} </span>
                             <b-icon icon="circle-fill" style="float:right" class="mr-2 mt-1" animation="throb"></b-icon>
                           </b-col>
                          </b-row>
                        </div>
                      </b-col>
                      <b-col>
                        <button :class="classColors[gameSelect]" style="width:60%;height:40px"  @click="challengeSend(data.value, gameSelect)"> <b-icon icon="box-arrow-in-right"></b-icon> </button>
                      </b-col>
                    </b-row>
                    <b-row v-else>
                      <b-col cols="8">
                       <div class="nameTag bg-warn pt-2">
                         <b-row>
                           <b-col cols="3">
                             <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="1.5rem" class="ml-2"></b-avatar>
                           </b-col>
                           <b-col>
                             <span class="text-cream"> {{getName(data.item.name)}} </span>
                             <b-icon icon="circle-fill" style="float:right" class="mr-2 mt-1" animation="throb"></b-icon>
                           </b-col>
                          </b-row>
                        </div>
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
                :filter-function="filterOffline"
                >
                  <template v-slot:cell(id)="data">
                    <b-row>
                      <b-col cols="8">
                       <div class="nameTag bg-alert pt-2">
                         <b-row>
                           <b-col cols="3">
                             <b-avatar :src="s3 + data.value + '/avatar.jpg'" size="1.5rem" class="ml-2"></b-avatar>
                           </b-col>
                           <b-col>
                             <span class="text-cream"> {{getName(data.item.name)}} </span>
                             <b-icon style="float:right" icon="exclamation-circle" class="text-cream mr-2 mt-1"></b-icon>
                           </b-col>
                          </b-row>
                        </div>
                      </b-col>
                    </b-row>
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

   <b-modal align="center" ref="reject" hide-footer title="Problem Found" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('reject')">Close</button>
    </b-modal>

   <b-modal align="center" ref="quit" hide-footer title="Game Over" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('quit')">Quit</button>
      <button class="buttonDiv mt-3 bg-grey text-prime" style="width:60%"  @click="hideModal('cancel')">Cancel</button>
    </b-modal>

  </div>
</template>

<script>
import TransMatch from './TransMatch'
import TypeMatch from './TypeMatch'
import TransAI from './TransAI'
import MemoryMatch from './MemoryMatch'
import MemoryAI from './MemoryAI'
import { openSocket } from '@/sockets'
import { checkFriend, deleteFriend } from '@/api'

export default {
  name: 'Match',
  props: {
    s3: String,
    exit: Boolean
  },
  components: {
    TransMatch,
    TypeMatch,
    TransAI,
    MemoryMatch,
    MemoryAI
  },
  data () {
    return {
      friends: [],
      fields: [
        {key: 'id'}
      ],
      selected: 'true',
      waiter: [],
      challenger: [],
      pageHead: 'Match Area',
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
      gameOver: false,
      message: null,
      waiting: true,
      msg: null,
      challengeMode: null,
      gameSelect: 'TransEng',
      gameTypes: [
        { value: 'TransEng', text: this.getLanguage()[0] },
        { value: 'TransCh', text: this.getLanguage()[1] },
        { value: 'TypeMatch', text: 'Spelling' },
        { value: 'MemoryMatch', text: 'Memory' }
      ],
      gameColors: {
        TransEng: 'third',
        TransCh: 'warn',
        TypeMatch: 'safe',
        MemoryMatch: 'grape-light'
      },
      classColors: {
        TransEng: 'buttonDiv bg-info text-cream',
        TransCh: 'buttonDiv bg-warn text-cream',
        TypeMatch: 'buttonDiv bg-safe text-cream',
        MemoryMatch: 'buttonDiv bg-grape text-cream'
      }
    }
  },
  computed: {
    friendsGet () {
      return this.$store.getters.friendsGet
    },
    validClass () {
      return this.$store.state.userProfile.classroom
    }
  },
  methods: {
    getLanguage () {
      if (this.$store.state.userProfile.vocab.includes('apan')) {
        return ['Jp > Ch', 'Ch > Jp']
      } else {
        return ['En > Ch', 'Ch > En']
      }
    },
    breaker: function (text) {
      var tList = text.split(';')
      return tList
    },
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
    showReject: function () {
      this.$refs['reject'].show()
    },
    hideModal: function (mode) {
      if (mode === 'success') {
        this.$refs['success'].hide()
        this.waiting = true
      } else if (mode === 'reject') {
        this.$refs['reject'].hide()
      } else if (mode === 'cancel') {
        this.$refs['quit'].hide()
      } else if (mode === 'quit') {
        console.log('quit; gameOVer:', this.gameOver)
        if (this.gameOver === false) {
          // only the quitter sends out the socket signal
          this.socket.emit('resetEmit', { player: this.username })
        }
        // change friend status
        let found
        if (this.player === 'p1') {
          found = this.friends.find(element => element.id === this.p2)
        } else {
          found = this.friends.find(element => element.id === this.p1)
        }
        found.status = 1

        this.$refs['quit'].hide()
        this.$store.dispatch('setFriends', {friends: this.friends})
        this.$emit('resetMatch')
        this.$store.dispatch('testActive', false)
        this.closeSocket()
      }
    },
    getName: function (name) {
      let newName
      let cut = name.split(' ')
      if (cut[1]) {
        newName = cut[0] + ' ' + cut[1][0]
        return newName
      } else {
        // console.log(cut[0])
        return name
      }
    },
    startSocket: function () {
      // console.log('STARTSOCKET')
      this.socket = openSocket()
      this.socket.emit('checkOnline', { userID: this.userID })
    },
    closeSocket: function () {
      this.socket.close()
    },
    leaveMatch: function () {
      // console.log('leaveActivated')
      this.msg = 'Warning, you are about to leave the game'
      this.showQuit()
    },
    challengeSend: function (targetID, mode) {
      // this.challengeMarker = targetID
      let payload = {userID: this.userID, username: this.username, targetID: targetID, mode: mode, action: 'send'}
      console.log('send challenge', payload)
      this.socket.emit('challenge', payload)
      let found = this.friends.find(element => element.id === targetID)
      found.status = 3
      if (targetID === 100000) {
        if (this.gameSelect.includes('ype')) {
          this.msg = 'Sorry, AI Bot is not good at spelling right now. Try test mode or find a friend :)'
          found.status = 1
          this.showReject()
        } else {
          this.startAI()
        }
      }
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
    },
    startAI: function () {
      let _this = this
      console.log('startAI')
      setTimeout(function () {
        console.log('TIMEOUT')
        // let found = _this.friends.find(element => element.id === 100000)
        _this.p1 = _this.userID
        _this.p1name = _this.username
        _this.p2 = 100000
        _this.p2name = 'AI Bot'
        _this.player = 'p1'
        _this.testType = 'AI' + _this.gameSelect
        _this.$store.dispatch('testActive', true)
        // found.status = 1
      }, 2000)
    }
  },
  created () {
    this.friends = this.friendsGet
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
  watch: {
    gameSelect: function () {
      localStorage.setItem('gameSelect', this.gameSelect)
    }
  },
  mounted () {
    // 0 offline
    // 1 online
    // 2 busy
    // 3 challenge sent
    // 4 challenge waiting
    if (localStorage.gameSelect) {
      this.gameSelect = localStorage.gameSelect
    }
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
      console.log('onlineUsers', data, {..._this.friends})
      if (data.friends) {
        if (Object.keys(_this.friends).length === 0) {
          _this.friends = data.friends
        }
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
        if (found1.id !== 100000) {
          found1.status = 2
        }
        if (found2.id !== 100000) {
          found2.status = 2
        }
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
        _this.challengeMode = data.mode
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
    _this.socket.on('leaveRoom', function (data) {
      _this.gameOver = true
      console.log('reset', data)
      _this.msg = 'Game Ended, ' + data.opponent + ' has left the game'
      _this.showQuit()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.nameTag {
  width: 100%;
  height: 40px;
  display: inline-block;
  margin-left: 1px;
  padding: 3px;
  border: 0px solid #CCC;
  box-shadow: 0 0 5px -1px rgba(0,0,0,0.3);
  border-radius: 12px;
}

@media screen and (max-width: 600px) {
  div.nameTag {
    font-size: 15px;
  }
}

@media screen and (min-width: 601px) {
  div.nameTag {
    width: 70%;
  }
}

</style>
