<template>
  <div id="app">
    <b-navbar toggleable sticky>
      <b-navbar-brand href="#">Vocab Trainer</b-navbar-brand>

      <b-navbar-toggle target="navbar-toggle-collapse" class="d-block d-lg-none">
        <b-avatar src="https://placekitten.com/300/300" size="3rem"></b-avatar>
      </b-navbar-toggle>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#">Link 1</b-nav-item>
          <b-nav-item href="#">Link 2</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-row no-gutters>
      <b-col cols="1" class="bg-primary d-none d-lg-block">
        <div :class="navSide('D')" @click="goTo('Dictionary'), btnSelect='D'"><b-icon-card-list></b-icon-card-list> <br> <span class="d-none d-xl-inline"> DICT </span> </div>
        <div :class="navSide('EC')" @click="goTo('TransEngTest'), btnSelect='EC'"><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right> <br> <span class="d-none d-xl-inline"> Eng-Ch </span> </div>
        <div :class="navSide('CE')" @click="goTo('TransChTest'), btnSelect='CE'"><b-icon-box-arrow-up-left></b-icon-box-arrow-up-left> <br> <span class="d-none d-xl-inline"> Ch-Eng </span></div>
        <div :class="navSide('T')" @click="goTo('TypeTest'), btnSelect='T'"><b-icon icon="grid3x3-gap-fill"></b-icon> <br> <span class="d-none d-xl-inline"> Type </span></div>
        <div :class="navSide('M')" @click="goTo('MatchTest'), btnSelect='M'"><b-icon icon="gear-fill"></b-icon> <br> <span class="d-none d-xl-inline "> Match </span></div>
      </b-col>

      <b-col :class="contClass()" style="min-height:100vh">
        <b-container fluid >
           <router-view ></router-view>
        </b-container>
      </b-col>

      <b-col cols="2" class="d-none d-lg-block">
          <b-card style="height:100vh">
              <div align="center" v-if="isAuthenticated">
                    <div class="m-2">
                    <b-avatar src="https://placekitten.com/300/300" size="4rem"></b-avatar>
                    </div>
                  <h4 class="mb-2">Profile Dash</h4>
                  <h6> {{ $store.state.userProfile.username}}</h6>
                  <h6> This Session:</h6>
                  <h6> Translation {{ transRec[0] }} </h6>
                  <h6> Score {{ transRec[1] }} </h6>
                  <button @click="saveData()"> SAVE DATA </button>
                  <br>
                  <button @click="goTo('Account')"> My Account </button>
              </div>
              <div v-else align="center" >
                <h1>Welcome :) </h1>
                  <b-button @click="goTo('Login')"> Login </b-button>
                  <br>
                  <b-button @click="goTo('Register')"> Register </b-button>
              </div>
          </b-card>
        </b-col>
    </b-row>
    <div class="btnNav d-lg-none">
        <div :class="navStyle('D')" @click="goTo('Dictionary'), btnSelect='D'"><b-icon-card-list></b-icon-card-list>  <span class="d-none d-md-inline" text=""> &nbsp; DICT </span> </div>
        <div :class="navStyle('EC')" @click="goTo('TransEngTest'), btnSelect='EC'"><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right>  <span class="d-none d-md-inline"> &nbsp; Eng-Ch </span> </div>
        <div :class="navStyle('CE')" @click="goTo('TransChTest'), btnSelect='CE'"><b-icon-box-arrow-up-left></b-icon-box-arrow-up-left>  <span class="d-none d-md-inline"> &nbsp; Ch-Eng </span></div>
        <div :class="navStyle('T')" @click="goTo('TypeTest'), btnSelect='T'"><b-icon icon="grid3x3-gap-fill"></b-icon> <span class="d-none d-md-inline"> &nbsp; Type </span></div>
        <div :class="navStyle('M')" @click="goTo('MatchTest'), btnSelect='M'"><b-icon icon="gear-fill"></b-icon> <span class="d-none d-md-inline"> &nbsp; Match </span></div>
    </div>
  </div>

</template>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js"></script>

<script>
import router from './router/index'

export default {
  name: 'app',
  data () {
    return {
      auth: this.isAuthenticated,
      btnSelect: null,
      contColor: 'bg-info',
      contMode: {
        D: 'bg-warning',
        M: 'bg-sand',
        EC: 'bg-info',
        CE: 'bg-info',
        T: 'bg-info'
      },
      connection: null
    }
  },
  computed: {
    isAuthenticated () {
      if (!this.$store.getters.isAuthenticated) {
        router.push('/home')
      }
      return this.$store.getters.isAuthenticated
    },
    transRec () {
      let count = 0
      let score = 0
      let obj = this.$store.state.currentRecord.trans
      for (let index in obj) {
        if (index) {
          count += 1
          score += this.$store.state.currentRecord.trans[index]
        }
      }
      return [count, score]
    }
  },
  methods: {
    contClass: function () {
      return this.contColor
    },
    navStyle: function (arg) {
      if (arg === this.btnSelect) {
        return 'tabLink text-primary ' + this.contMode[arg]
      } else {
        return 'tabLink bg-primary text-info'
      }
    },
    navSide: function (arg) {
      if (arg === this.btnSelect) {
        return 'sideLink h4 text-primary ' + this.contMode[arg]
      } else {
        return 'sideLink h5 bg-primary text-info'
      }
    },
    goTo: function (arg) {
      this.$router.push(arg)
    },
    logout: function (arg) {
      this.$store.dispatch('logout')
    },
    saveData: function (arg) {
      this.$store.dispatch('saveData')
    },
    currentCount: function () {
      let count = 0
      for (let key in this.$store.state.currentActivity) {
        if (key) {
          count++
        }
      }
      return count
    }
  },
  watch: {
    btnSelect: function () {
      if (this.btnSelect !== null) {
        this.contColor = this.contMode[this.btnSelect]
      }
    }
  },
  updated () {
    // check the login status everytime the page is changed
    this.$store.dispatch('checkLogin')
  },
  created () {
    window.onbeforeunload = function () {
      if (this.isAuthenticated) {
        this.saveData()
      } else {
        // console.log('Not logged in: created')
      }
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200&display=swap');
@import "assets/scss/custom.scss";
@import "../node_modules/bootstrap/scss/bootstrap.scss";
@import "../node_modules/bootstrap-vue/dist/bootstrap-vue.css";

body {
  background: #EEF1F4 !important;
  font-family: 'Inconsolata', !important;
}
.nav-background {
  background: #353535;
}

.navbar {
  background-color: #2c3531;
  color: #ffcb98
}

.navbar .navbar-brand {
  color: #ffcb98
}

.navbar .navbar-toggler {
  color: #ffcb98
}

.navbar .navbar-toggler:focus {
  border: 0px
}

.btnNav {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: center
}

.tabLink {
  flex: 1;
  text-align: center;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s
}

.sideNav {
  display: flex;
}

.sideLink {
  flex: 1;
  text-align: center;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 30px 5px;
  width:auto;
  transition: 0.3s
}

.select option {
    margin: 40px;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}

.selectColor{
    background-color: #e7e7e7;
}

.container-fluid {
    padding: 20px;
}

</style>
