<template>
  <div id="app">
    <b-navbar toggleable sticky>
      <b-navbar-brand href="#"><span class="text-cream"> Vocab Trainer </span> </b-navbar-brand>

      <b-navbar-toggle  target="navbar-toggle-collapse" class="d-block d-lg-none">
        <b-avatar v-if="isAuthenticated" :src="s3 + $store.state.userProfile.userID + '.jpg'" size="3rem" :text="$store.state.userProfile.username[0]"></b-avatar>
       <b-avatar v-else size="3rem" text="VC"></b-avatar>
      </b-navbar-toggle>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
           <div v-if="isAuthenticated">
                <b-nav-item @click="logout()"><div class="sideBtn"><b-icon-power></b-icon-power>  <span text=""> Logout </span></div></b-nav-item>
                <b-nav-item @click="goTo('Account')"><div class="sideBtn"><b-icon-person-fill></b-icon-person-fill>  <span> Account #{{$store.state.userProfile.userID}} </span></div></b-nav-item>
                <br>
                <div>
                  <b-table class="text-cream" striped hover small borderless :items="currentRecItems"></b-table>
                </div>
            </div>
           <div v-else>
                <b-nav-item @click="goTo('Login')"><div class="sideBtn"><b-icon-power></b-icon-power>  <span> Login </span></div></b-nav-item>
                <b-nav-item @click="goTo('Register')"><div class="sideBtn"><b-icon-person-fill></b-icon-person-fill>  <span> Register </span></div></b-nav-item>
            </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-row no-gutters>
      <b-col v-if="isAuthenticated" cols="1" class="bg-prime d-none d-lg-block">
        <div :class="navSide('/Dictionary')" @click="goTo('Dictionary')"><b-icon-card-list></b-icon-card-list> <br> <span class="d-none d-xl-inline"> List </span> </div>
        <div :class="navSide('/TransEngTest')" @click="goTo('TransEngTest')"><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right> <br> <span class="d-none d-xl-inline"> Eng-Ch </span> </div>
        <div :class="navSide('/TransChTest')" @click="goTo('TransChTest')"><b-icon-box-arrow-up-left></b-icon-box-arrow-up-left> <br> <span class="d-none d-xl-inline"> Ch-Eng </span></div>
        <div :class="navSide('/TypeTest')" @click="goTo('TypeTest')"><b-icon icon="grid3x3-gap-fill"></b-icon> <br> <span class="d-none d-xl-inline"> Type </span></div>
        <div :class="navSide('/Match')" @click="goTo('Match')"><b-icon icon="gear-fill"></b-icon> <br> <span class="d-none d-xl-inline "> Match </span></div>
      </b-col>

      <b-col :class="contClass()" style="min-height:100vh">
        <b-container fluid >
           <router-view :s3="s3"></router-view>
        </b-container>
      </b-col>

      <b-col cols="2" class="d-none d-lg-block">
          <div class="p-2 bg-warn" style="height:100vh">
              <div align="center">
                    <div class="m-2">
                      <b-avatar v-if="isAuthenticated" :src="s3 + $store.state.userProfile.userID + '.jpg'" size="4rem" :text="$store.state.userProfile.username[0]"></b-avatar>
                      <b-avatar v-else size="4rem" text="VC"></b-avatar>
                    </div>
                    <div v-if="isAuthenticated" >
                      <h4 class="mb-2">Profile Dash</h4>
                      <h6> {{ $store.state.userProfile.username}}</h6>
                      <h6> #{{ $store.state.userProfile.userID}}</h6>
                      <h6> This Session:</h6>
                      <div>
                        <b-table striped hover small borderless :items="currentRecItems"></b-table>
                      </div>
                    </div>
                    <div v-if="isAuthenticated">
                      <div class="sideBtn" @click="goTo('Account')"><b-icon-person-fill></b-icon-person-fill>  <span> Account </span> </div>
                      <div class="sideBtn" @click="logout()"><b-icon-power></b-icon-power>  <span text=""> Logout </span> </div>
                    </div>
                    <div v-else>
                       <div class="sideBtn" @click="goTo('Login')"><b-icon-power></b-icon-power>  <span text=""> Login </span> </div>
                        <div class="sideBtn" @click="goTo('Register')"><b-icon-person-fill></b-icon-person-fill> <span> Register </span> </div>
                    </div>
              </div>
          </div>
        </b-col>
    </b-row>
    <div v-if="isAuthenticated" class="btnNav d-lg-none">
        <div :class="navStyle('/Dictionary')" @click="goTo('Dictionary')"><b-icon-card-list></b-icon-card-list>  <span class="d-none d-md-inline" text=""> &nbsp; List </span> </div>
        <div :class="navStyle('/TransEngTest')" @click="goTo('TransEngTest')"><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right>  <span class="d-none d-md-inline"> &nbsp; Eng-Ch </span> </div>
        <div :class="navStyle('/TransChTest')" @click="goTo('TransChTest')"><b-icon-box-arrow-up-left></b-icon-box-arrow-up-left>  <span class="d-none d-md-inline"> &nbsp; Ch-Eng </span></div>
        <div :class="navStyle('/TypeTest')" @click="goTo('TypeTest')"><b-icon icon="grid3x3-gap-fill"></b-icon> <span class="d-none d-md-inline"> &nbsp; Type </span></div>
        <div :class="navStyle('/Match')" @click="goTo('Match')"><b-icon icon="gear-fill"></b-icon> <span class="d-none d-md-inline"> &nbsp; Match </span></div>
    </div>
  </div>

</template>

<script>
import router from './router/index'

export default {
  name: 'app',
  data () {
    return {
      path: this.$route.path,
      s3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/',
      userProfile: null,
      contColor: 'bg-cream',
      btnCodes: {
        '/TransChTest': 'bg-third',
        '/TransEngTest': 'bg-third',
        '/TypeTest': 'bg-third',
        '/Match': 'bg-grape-light',
        '/Dictionary': 'bg-cream'
      },
      typeHeaders: {
        'transEng': 'Eng',
        'transCh': 'Ch',
        'type': 'Type'
      }
    }
  },
  computed: {
    isAuthenticated () {
      if (!this.$store.getters.isAuthenticated) {
        router.push('/home')
      }
      return this.$store.getters.isAuthenticated
    },
    isActiveCheck () {
      return this.$store.getters.isActive
    },
    currentRecItems () {
      let currentRecItems = []
      for (let type in this.$store.state.currentRecord) {
        let count = 0
        let score = 0
        let obj = this.$store.state.currentRecord[type]
        for (let index in obj) {
          if (index) {
            count += 1
            score += this.$store.state.currentRecord[type][index]
          }
        }
        currentRecItems.push({mode: this.typeHeaders[type], count: count, score: score})
      }
      return currentRecItems
    }
  },
  methods: {
    contClass: function () {
      if (this.getPath() in this.btnCodes) {
        return this.btnCodes[this.getPath()]
      } else {
        return this.contColor
      }
    },
    getPath: function () {
      return this.$route.path
    },
    navStyle: function (arg) {
      let path = this.getPath()
      if (path in this.btnCodes && path === arg) {
        return 'tabLink text-prime ' + this.btnCodes[path]
      } else {
        return 'tabLink bg-prime text-cream'
      }
    },
    navSide: function (arg) {
      let path = this.getPath()
      if (path in this.btnCodes && path === arg) {
        return 'sideLink h4 text-prime ' + this.btnCodes[path]
      } else {
        return 'sideLink h5 bg-prime text-cream'
      }
    },
    goTo: function (arg) {
      // router will be disbaled is game is active
      if (!this.$store.state.testActive) {
        this.$router.push(arg)
      } else {
        this.navStyle()
        this.navSide()
      }
    },
    logout: function (arg) {
      this.$store.dispatch('logout')
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
    },
    $route (to, from) {
      console.log('path change')
      if (this.isAuthenticated && this.$store.state.updateStatus === false) {
        this.$store.dispatch('saveData')
      }
    }
  },
  updated () {
    // check the login status everytime the page is change
    this.$store.dispatch('checkLogin')
    this.userProfile = this.$store.state.userProfile
  },
  created () {
    let _this = this
    window.onbeforeunload = function () {
      if (_this.isAuthenticated && _this.$store.state.updateStatus === false) {
        _this.$store.dispatch('saveData')
      }
      return undefined
    }
  }

}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400&display=swap');
@import "assets/scss/custom.scss";

body {
  font-family: 'Inconsolata', !important;
}

.navbar {
  background-color: theme-color("prime");
  color: theme-color("cream");
  border-bottom: 4px solid theme-color("warn");
}

.navbar .navbar-toggler:focus {
  border: 0px
}

.btnNav {
  position: sticky;
  bottom: 0px;
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: center
}

.sideBtn {
  background-color:theme-color('prime');
  color:theme-color('cream');
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
    color: red;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}

.selectColor{
    background-color: #e7e7e7;
}

.container-fluid {
    padding: 20px;
}

.buttonDiv {
    display:inline-block;
    color: theme-color('prime');
    border:0px solid #CCC;
    border-radius: 5px;
    box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
    cursor:pointer;
    vertical-align:middle;
    padding: 5px;
    text-align: center;
}

.buttonDiv:active {
    color: theme-color('warn');
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
    border:0px solid #CCC;
}

.buttonDiv:hover {
    color: theme-color('cream');
}

.answerBtn {
    display:inline-block;
    color: theme-color('prime');
    border:0px solid #CCC;
    border-radius: 5px;
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
    cursor:pointer;
    font-size: 30px;
    vertical-align:middle;
    padding: 10px;
    text-align: center;
    width: 100%;
    height: 70px
}

.answerBtn:active {
    color: theme-color('warn');
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
}

.answerBtn:disabled {
    color: theme-color('prime');
    background: theme-color('grey');
    opacity: 0.5;
    cursor: none;
    pointer-events: none;
}

.answerBtn:hover {
    color: theme-color('cream');
}

</style>
