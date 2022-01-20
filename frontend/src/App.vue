<template>
  <div id="app">
    <b-navbar toggleable>
      <b-navbar-brand @click="goTo('Home')"><span class="text-cream" > VOCAB TRAINER </span> </b-navbar-brand>

      <div v-if="!isActiveCheck" class="d-block d-lg-none">
        <b-button id="toggler" v-b-toggle.navbar-toggle-collapse style="background:none; border:none">
          <b-avatar v-if="isAuthenticated" :src="s3 + $store.state.userProfile.userID + '/avatar.jpg'" size="3rem" :text="$store.state.userProfile.username[0]"></b-avatar>
          <b-avatar v-else size="3rem" text="VC"></b-avatar>
        </b-button>
      </div>

      <div v-else  @click="exitToggle()" class="d-block d-lg-none p-1">
        <b-avatar variant="alert" text="exit" size="3rem"></b-avatar>
      </div>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
           <div v-if="isAuthenticated">
                <Dash :tableItems="tableItems" type="nav"></Dash>
                <hr>
                <b-nav-item @click="goTo('Account')"><div class="sideBtn bg-second"><b-icon-person-fill></b-icon-person-fill>  <span> &nbsp;Account </span></div></b-nav-item>
                <b-nav-item @click="setHelp()"><div :class="setHelpClass('sideBtn ')"><b-icon-question-circle></b-icon-question-circle>  <span> &nbsp;Help Mode </span></div></b-nav-item>
                <b-nav-item v-if="checkQuiz()" @click="goTo('InstStud')"><div class="sideBtn bg-warning text-prime"><b-icon-check-square></b-icon-check-square>  <span> &nbsp;Quiz </span></div></b-nav-item>
                <b-nav-item @click="goTo('Help')"><div class="sideBtn bg-peel text-prime"><b-icon-question-circle></b-icon-question-circle>  <span> &nbsp;Feedback </span></div></b-nav-item>
                <b-nav-item @click="saveData()"><div class="sideBtn bg-cream text-prime"> <b-icon-cloud-upload></b-icon-cloud-upload><span> &nbsp;Save Data </span></div></b-nav-item>
                <b-nav-item @click="logout(), goTo('Home')"><div class="sideBtn bg-black"><b-icon-power></b-icon-power>  <span text=""> &nbsp;Logout </span></div></b-nav-item>

            </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-row no-gutters>
      <b-col v-if="isAuthenticated" cols="1" class="bg-prime d-none d-lg-block">
        <div :class="navSide('/Dictionary')" @click="goTo('Dictionary')"><b-icon-card-list></b-icon-card-list> <br> <span class="d-none d-xl-inline"> List </span> </div>
        <div :class="navSide('/TransEngTest')" @click="goTo('TransEngTest')"><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right> <br> <span class="d-none d-xl-inline"> {{getLanguage()[0]}} </span> </div>
        <div :class="navSide('/TransChTest')" @click="goTo('TransChTest')"><b-icon-box-arrow-up-left></b-icon-box-arrow-up-left> <br> <span class="d-none d-xl-inline"> {{getLanguage()[1]}} </span></div>
        <div :class="navSide('/TypeTest')" @click="goTo('TypeTest')"><b-icon icon="grid3x3-gap-fill"></b-icon> <br> <span class="d-none d-xl-inline"> Type </span></div>
        <div :class="navSide('/MatchBase')" @click="goTo('Match')"><b-icon icon="fullscreen-exit"></b-icon> <br> <span class="d-none d-xl-inline "> Match </span></div>
      </b-col>
      <b-col v-else cols="1" class="bg-prime d-none d-lg-block">
      </b-col>

      <b-col :class="contClass()" style="min-height:100vh"  @click="collapseCheck()">
        <b-container fluid v-if="this.$store.state.userRecord || !isAuthenticated">
          <transition name="board">
           <router-view :s3="s3" :exit="exit"></router-view>
          </transition>
        </b-container>
        <b-container v-else align="center">
          <div class="mt-5">
              <h4 class="text-prime"> Building Records </h4>
              <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
          </div>
        </b-container>
      </b-col>

      <b-col cols="2" class="d-none d-lg-block">
          <div class="p-3 bg-warn" style="height:100%">
              <div>
                <b-row no-gutters v-if="isAuthenticated" align="center">
                  <b-col class="text-cream">
                    <button v-if="!isActiveCheck" class="buttonDiv bg-prime text-cream px-1" style="height:80px; width:100%" @click="goTo('Account')">
                    <b-avatar :src="s3 + $store.state.userProfile.userID + '/avatar.jpg'" size="3rem" :text="$store.state.userProfile.username[0]"></b-avatar>
                      <span class="ml-3"> {{ $store.state.userProfile.username}} </span>
                     </button>
                    <button v-else class="buttonDiv bg-cream text-cream px-1" style="height:80px; width:100%" @click="exitToggle()">
                      <b-avatar variant="alert" text="exit" size="3rem"></b-avatar>
                    </button>
                  </b-col>
                </b-row>
                <b-row  v-else align="center">
                  <b-col>
                    <b-avatar size="4rem" text="VT" align="center"></b-avatar>
                  </b-col>
                </b-row>

              <hr>
                    <div v-if="isAuthenticated">
                      <Dash :tableItems="tableItems" type="side"></Dash>
                      <hr>
                    </div>

                    <div v-if="isAuthenticated">
                      <button v-if="$store.state.userProfile.instructor" class="buttonDiv mt-2 bg-info text-cream px-1" style="height:50px; width:100%" @click="goTo('Instructor')"><b-icon-person-fill></b-icon-person-fill>  <span> &nbsp;Instructor </span> </button>
                      <button v-if="$store.state.userProfile.userID === 1" class="buttonDiv mt-2 bg-grape text-cream px-1" style="height:50px; width:100%" @click="goTo('JGrabber')"><b-icon-person-fill></b-icon-person-fill>  <span> &nbsp;JSON </span> </button>
                      <button v-if="$store.state.userProfile.userID === 1" class="buttonDiv mt-2 bg-safe text-prime px-1" style="height:50px; width:100%" @click="goTo('ClassCodes')"><b-icon-person-fill></b-icon-person-fill>  <span> &nbsp;CODES </span> </button>
                      <button v-if="checkQuiz()" class="buttonDiv mt-2 bg-warning text-prime px-1" style="height:50px; width:100%" @click="goTo('InstStud')"><b-icon-check-square></b-icon-check-square>  <span> &nbsp;Quiz </span> </button>
                      <button :class="setHelpClass('buttonDiv ')" style="height:50px; width:100%" @click="setHelp()"><b-icon-question-circle></b-icon-question-circle>  <span text=""> &nbsp;Help Mode</span> </button>
                      <button class="buttonDiv mt-2 bg-peel text-prime px-1" style="height:50px; width:100%" @click="sendEmail()"><b-icon-question-circle></b-icon-question-circle>  <span text=""> &nbsp;Feedback </span> </button>
                      <button class="buttonDiv mt-2 bg-black text-cream px-1" style="height:50px; width:100%" @click="logout()"><b-icon-power></b-icon-power>  <span text=""> &nbsp;Logout </span> </button>
                    </div>
                    <div v-else align="center">
                     <b-card header="Welcome" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
                        <button class="buttonDiv  bg-warn text-cream" style="width:60%"  @click="$router.push('/login')"><b-icon-power></b-icon-power><span> &nbsp;Log In</span></button>
                        <button class="buttonDiv mt-3 bg-info text-cream" style="width:60%"  @click="$router.push('/register')"><b-icon-person-fill></b-icon-person-fill><span> &nbsp;Join</span></button>
                      </b-card>
                    </div>
              </div>
          </div>
        </b-col>
    </b-row>
    <div v-if="isAuthenticated" class="btnNav d-lg-none" style="z-index: 5">
        <button :class="navStyle('/Dictionary')" @click="goTo('Dictionary')"><b-icon-card-list></b-icon-card-list>  <span class="d-none d-md-inline" text=""> &nbsp; List </span> </button>
        <button :class="navStyle('/TransEngTest')" @click="goTo('TransEngTest')"><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right>  <span class="d-none d-md-inline"> &nbsp; {{getLanguage()[0]}} </span> </button>
        <button :class="navStyle('/TransChTest')" @click="goTo('TransChTest')"><b-icon-box-arrow-up-left></b-icon-box-arrow-up-left>  <span class="d-none d-md-inline"> &nbsp; {{getLanguage()[1]}} </span></button>
        <button :class="navStyle('/TypeTest')" @click="goTo('TypeTest')"><b-icon icon="grid3x3-gap-fill"></b-icon> <span class="d-none d-md-inline"> &nbsp; Type </span></button>
        <button :class="navStyle('/MatchBase')" @click="goTo('Match')"><b-icon icon="gem"></b-icon> <span class="d-none d-md-inline"> &nbsp; Match </span></button>
    </div>

    <b-modal align="center" ref="fail" hide-footer title="Test Mode" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> Would you like to exit this activity now? </h3>
      </div>
      <button class="buttonDiv mt-3 bg-info text-cream" style="width:40%"  @click="hideModal('stay')">No</button>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:40%"  @click="hideModal('exit')">Exit</button>
    </b-modal>

    <b-modal align="center" ref="access" hide-footer title="Access" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> Match mode is not open right now </h3>
      </div>
      <button class="buttonDiv mt-3 bg-info text-cream" style="width:40%"  @click="hideModal('access')">Close</button>
    </b-modal>

    <b-modal align="center" ref="reload" hide-footer title="Reload" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> You are reloading and your data will be saved </h3>
      </div>
      <button class="buttonDiv mt-3 bg-info text-cream" style="width:40%"  @click="hideModal('reload')">Close</button>
    </b-modal>

  </div>

</template>

<script>
import router from './router/index'
import Dash from './components/Dash'

export default {
  name: 'app',
  components: {
    Dash
  },
  data () {
    return {
      path: this.$route.path,
      s3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/',
      exit: true,
      userProfile: null,
      contColor: 'bg-cream',
      tableItems: [],
      btnCodes: {
        '/TransChTest': this.getClass('third', 'prime'),
        '/TransEngTest': this.getClass('third', 'prime'),
        '/TypeTest': this.getClass('peel', 'prime'),
        '/Match': this.getClass('cream', 'prime'),
        '/Dictionary': this.getClass('cream', 'prime')
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
    }
  },
  methods: {
    getLanguage () {
      if (this.$store.state.userProfile.vocab.includes('apan')) {
        return ['Jp-Ch', 'Ch-Jp']
      } else {
        return ['En-Ch', 'Ch-En']
      }
    },
    collapseCheck: function () {
      if (document.getElementById('navbar-toggle-collapse').classList.contains('show')) {
        document.getElementById('toggler').click()
      }
    },
    showFail: function () {
      this.$refs['fail'].show()
    },
    showAccess: function () {
      this.$refs['access'].show()
    },
    showReload: function () {
      this.$refs['reload'].show()
    },
    hideModal: function (arg) {
      if (arg === 'stay') {
        this.$refs['fail'].hide()
      } else if (arg === 'access' || arg === 'reload') {
        this.$refs[arg].hide()
      } else {
        this.exitToggle()
        this.$refs['fail'].hide()
      }
    },
    contClass: function () {
      if (this.getPath() in this.btnCodes) {
        return this.btnCodes[this.getPath()]
      } else {
        return this.contColor
      }
    },
    exitToggle: function () {
      console.log(router.currentRoute.fullPath)
      if (router.currentRoute.fullPath[1] !== 'M') {
        this.$store.dispatch('testActive', false)
      }
      this.exit = !this.exit
      console.log(this.exit)
    },
    setHelp: function () {
      console.log('setHelp')
      this.$store.dispatch('setHelp')
    },
    setHelpClass: function (note) {
      if (this.$store.state.helpMode) {
        return note + 'mt-2 bg-alert text-cream px-1'
      } else {
        return note + 'mt-2 bg-cream text-alert px-1'
      }
    },
    checkQuiz: function () {
      return this.$store.getters.checkQuiz
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
        return 'sideLink m-0 h4 text-prime ' + this.btnCodes[path]
      } else {
        return 'sideLink m-0 h5 bg-prime text-cream'
      }
    },
    goTo: function (arg) {
      // disable match mode for certain classrooms
      // if (arg === 'Match' && this.$store.state.userProfile.classroom === 'work@pvqc') {
      //   this.showAccess()
      //   return false
      // }

      // router will be disbaled is game is active
      if (!this.isActiveCheck && arg) {
        if (arg === 'Home' && this.isAuthenticated) {
          arg = 'Account'
        }
        this.$router.push(arg)
        // const userId = '123'
        // router.push({ name: 'user', params: { userId } }) // -> /user/123
        // router.push({ path: `/user/${userId}` }) // -> /user/123
      } else {
        this.showFail()
      }
    },
    logout: function (arg) {
      if (!this.$store.state.updateStatus) {
        this.$store.dispatch('saveData')
      }
      this.$store.dispatch('logout')
    },
    saveData: function (arg) {
      if (!this.$store.state.updateStatus) {
        this.$store.dispatch('saveData')
      }
      alert('Data Saved')
    },
    currentCount: function () {
      let count = 0
      for (let key in this.$store.state.currentActivity) {
        if (key) {
          count++
        }
      }
      return count
    },
    sendEmail: function () {
      this.$store.dispatch('sendEmail', { userID: this.$store.state.userProfile.userID })
    }
  },
  watch: {
    btnSelect: function () {
      if (this.btnSelect !== null) {
        this.contColor = this.contMode[this.btnSelect]
      }
    },
    $route (to, from) {
      // console.log('path change')
    }
  },
  updated () {
    // check the login status everytime the page is change
    this.$store.dispatch('checkLogin')
    this.userProfile = this.$store.state.userProfile
    if (this.$store.state.userRecord && this.isAuthenticated) {
      this.tableItems = this.$store.getters.makeList
    }
  },
  created () {
    if (!this.$store.state.userRecord && this.isAuthenticated) {
      // console.log('created: get api records')
      this.$store.dispatch('apiRecords', { userID: this.$store.state.userProfile.userID })
      if (this.$store.state.userProfile.classroom) {
        this.$store.dispatch('instructorLogs', { group: this.$store.state.userProfile.classroom, action: 'getTests' })
      }
    }

    let _this = this
    window.onbeforeunload = function () {
      _this.showReload()
      if (_this.isAuthenticated && _this.$store.state.updateStatus === false) {
        _this.$store.dispatch('saveData')
      }
      return undefined
    }
    window.onblur = function () {
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

.board-enter-active, .board-leave-active  {
  transition: opacity 0.3s ease-in-out, transform 0.5s ease;
}

.board-enter-active {
  transition-delay: 0.5s;
}

.board-enter {
  opacity: 0;
}

.board-enter-to {
  opacity: 1;
}

.board-leave {
  opacity: 1;
  transform: translateY(0px);
}

.board-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.tableboard-enter-active, .tableboard-leave-active  {
  transition: opacity 0.2s ease-in-out, transform 0.3s ease;
}

.tableboard-enter-active {
  transition-delay: 0.2s;
}

.tableboard-enter {
  opacity: 0;
}

.tableboard-enter-to {
  opacity: 1;
}

.tableboard-leave {
  opacity: 1;
  transform: translateY(0px);
}

.tableboard-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

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
  justify-content: center;
  border-radius: 5px;
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

.tabLink:active {
  color: theme-color('warn') !important;
  background-color:theme-color('smoke') !important;
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

.sideLink:hover {
  color: theme-color('warn') !important;
  background-color:theme-color('smoke') !important;
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

.head {
  border:0px solid #CCC;
  border-radius: 10px 10px 0px 0px;
}

.foot {
  border:0px solid #CCC;
  border-radius: 0px 0px 10px 10px;
}

.headDiv {
    display:inline-block;
    border:0px solid #CCC;
    outline:none;
    border-radius: 50px, 50px, 0px, 0px;
    box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
    vertical-align:middle;
    padding: 5px;
    text-align: center;
    width: 100%
}

.spanDiv {
    display:inline-block;
    color: theme-color('prime');
    height: 15px;
    width: 60%;
    border:0px solid #CCC;
    outline:none;
    border-radius: 5px;
    box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
    vertical-align:middle;
    padding: 1px;
    text-align: center;
}

.buttonDiv {
    display:inline-block;
    color: theme-color('prime');
    border:0px solid #CCC;
    outline:none;
    border-radius: 5px;
    box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
    cursor:pointer;
    vertical-align:middle;
    padding: 5px;
    text-align: center;
}

.buttonSample {
    display:inline-block;
    color: theme-color('prime');
    border:0px solid #CCC;
    outline:none;
    border-radius: 5px;
    box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
    vertical-align:middle;
    padding: 5px;
    text-align: center;
}

.buttonDiv:active {
    color: theme-color('warn');
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
    border:0px solid #CCC;
    outline:none;
}

.buttonDiv:hover {
    color: theme-color('cream');
    outline:none
}

.buttonDiv:after {
    outline:none
}

.questionDiv {
    display:inline-block;
    color: theme-color('cream');
    border:0px solid #CCC;
    border-radius: 5px;
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
    cursor:pointer;
    font-size: 30px;
    vertical-align:middle;
    padding: 10px;
    text-align: center;
    width: 100%;
    min-height: 70px
}

.answerBtn {
    display:inline-block;
    background: #eeecec;
    color: theme-color('prime');
    border:0px solid #CCC;
    border-radius: 5px;
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
    cursor:pointer;
    font-size: 25px;
    vertical-align:middle;
    padding: 10px;
    text-align: center;
    width: 100%;
    min-height: 60px
}

.answerBtn:active {
    color: theme-color('warn');
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
}

.answerBtn:disabled {
    color: theme-color('prime');
    background: theme-color('cream');
    opacity: 0.5;
    cursor: none;
    pointer-events: none;
}

.answerBtn:hover {
    color: theme-color('cream');
    background: theme-color('grey');
}
.answerBtn:hover:after {
    color: theme-color('prime');
    background:  #c2c2c2;
    content:"";
}
.answerBtn:active:after {
    color: theme-color('prime');
    background:  #c2c2c2;
    content:"";
}

.helpTab1 {
  background: theme-color('fade');
  color: theme-color('alert');
  padding: 6px;
  border-radius: 5px;
}

.helpTab2 {
  background: theme-color('fade');
  color: theme-color('alert');
  padding: 6px;
}

</style>
