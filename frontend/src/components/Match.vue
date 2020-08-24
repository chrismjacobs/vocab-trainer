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
      <b-list-group style="max-width: 300px;">
      <b-list-group-item v-for="(user, index) in onlineUsers" :key="index" class="d-flex align-items-center">
        <b-avatar :src="s3 + user.userID + '.jpg'" :text="user.username[0]" class="mr-3"></b-avatar>
        <span class="mr-auto">{{ user.username }}</span>
        <b-button @click="sayHi(user.userID)"> Say Hi </b-button>
      </b-list-group-item>
    </b-list-group>
    </b-container>

  </div>
</template>

<script>
import {openSocket} from '@/sockets'

export default {
  name: 'Match',
  data () {
    return {
      s3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/',
      pageHead: 'Match Area',
      username: null,
      userID: null,
      onlineUsers: null,
      socket: null,
      room: null
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
    }
  },
  watch: {

  },
  created () {
    this.userID = this.$store.state.userProfile.userID
    this.username = this.$store.state.userProfile.username
    this.socket = openSocket()
  },
  beforeDestroy () {
    this.socket.emit('offline', { userProfile: this.$store.state.userProfile })
    this.socket.close()
  },
  mounted () {
    let _this = this
    _this.socket.on('roomReady', function (data) {
      console.log('roomReady', data)
      _this.room = data.room
    })
    _this.socket.on('playerReady', function (data) {
      console.log('roomReady', data)
      _this.room = data.room
    })
    _this.socket.on('onlineUsers', function (data) {
      console.log('onlineUsers', data)
      _this.onlineUsers = JSON.parse(data.userList)
      console.log(_this.onlineUsers)
    })
    _this.socket.on('sayHi', function (data) {
      console.log(data)
      alert('Hello, from ' + data.sender)
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
