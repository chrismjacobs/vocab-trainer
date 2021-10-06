<template>
    <div class="login">
        <b-card v-if="waiting" header="Login" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">

          <h5 class="bg-warn text-cream" v-if="report !== ''"> If using {{report}} browser, you cannot log in. Please switch to Chrome /Safari / Brave browser </h5>
          <br>
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">

            <b-input-group label="Email:" label-for="exampleInput1">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="envelope"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="exampleInput1"
                            v-model="form.email"
                            required
                            placeholder="Enter Email">
                </b-form-input>
            </b-input-group>

            {{getLabel()}}
            <b-input-group class="my-4" label="Email" label-for="exampleInput2">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="lock-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="exampleInput2"
                            type="password"
                            v-model="form.password"
                            required
                            placeholder="Enter Password">
                </b-form-input>
            </b-input-group>

            <div class="d-flex justify-content-between">
                <div>
                <button class="buttonDiv bg-warn px-3" style="width:100px" type="submit" v-b-modal.modal1> <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward></button>
                </div>
            </div>
          </b-form>
          <template v-slot:footer>
            <div class="mb-3">
                <em><a href="#" @click="$router.push('/register')">Start New Account</a></em>
            </div>
            <em><a href="#" @click="resetDirect()">Forgot Password</a></em>
            <div v-if="showEmail">
              If you have forgotten your password please contact vocab trainer for a new password
              <a href="cjx02121981@gmail.com"> cjx02121981@gmail.com </a>
            </div>
          </template>
        </b-card>
      <div v-else align="center">
        <h4 class="text-prime"> Logging in </h4>
        <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
      </div>

  <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="success" hide-footer title="Logged In">
      <div class="d-block">
        <h3 :class="msgColor"> {{msg}} </h3>
        <div class="p-3 bg-cream" v-if="adverts.includes($store.state.userProfile.classroom)">
          <img src="https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/afld.PNG" alt="JUST LOGO" width="100">
          <a href="https://www.jinwen-english.com" target="_blank"> <h3 class="text-safe">www.jinwen-english.com </h3></a>
        </div>
      </div>
      <button class="buttonDiv mt-3 bg-prime text-cream" style="width:60%"  @click="hideModal('success')">Close</button>
  </b-modal>

  <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="reset" hide-footer title="Password Reset">
      <div class="d-block">
        <h3 :class="msgColor"> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-prime text-cream" style="width:60%"  @click="hideModal('reset')">Close</button>
  </b-modal>

   <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="fail" hide-footer title="Problem Found">
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('fail')">Close</button>
      <button class="buttonDiv mt-3 bg-info text-cream" style="width:60%"  @click="hideModal('register')">Join</button>
    </b-modal>

  </div>

</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      show: true,
      waiting: true,
      msg: null,
      showEmail: false,
      msgColor: 'text-prime',
      adverts: ['fhvs701'],
      report: ''
    }
  },
  methods: {
    showModal () {
      this.$refs['success'].show()
    },
    showReset () {
      this.$refs['reset'].show()
    },
    showAlert () {
      this.$refs['fail'].show()
    },
    hideModal (mode) {
      if (mode === 'success' && this.report === '') {
        this.$refs['success'].hide()
        this.$router.push('/account')
      } else if (mode === 'success') {
        this.$refs['success'].hide()
        this.$router.push('/login')
      } else if (mode === 'register') {
        this.$refs['fail'].hide()
        this.$router.push('/register')
      } else if (mode === 'reset') {
        this.$refs['fail'].hide()
        this.$router.push('/resetpass')
      } else {
        this.$refs['fail'].hide()
        this.msg = null
        this.waiting = true
      }
    },
    resetDirect () {
      this.$router.push('/reset')
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.authenticate()
    },
    getLabel () {
      if (localStorage.setItem('tokenReady', true)) {
        return 'Password Reset - Check Email for Temporary Password'
      } else {
        return null
      }
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form.email = ''
      this.form.password = ''
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    },
    authenticate () {
      let _this = this
      console.log(this.report)
      _this.msgColor = 'text-prime'
      if (this.report !== '') {
        _this.msg = 'WARNING - Vocab Trainer cannot be used with ' + this.report + ' browser. You must first switch to other browser (eg  Chrome / Safari / Brave) to use this webapp'
        _this.msgColor = 'text-alert'
        _this.report = false
        _this.showModal()
      } else {
        this.waiting = false
        this.$store.dispatch('login', { userData: this.form })
          .then(function (response) {
            console.log('RESPONSE', response)
            let msg = response.msg
            _this.msg = msg
            if (response.err) {
              if (response.err === 1) {
                _this.showAlert()
              } else if (response.err === 2) {
                localStorage.setItem('tokenReady', false)
                _this.msgColor = 'text-warn'
                _this.showReset()
              }
            }
            _this.showModal()
          })
      }
    }
  },
  created () {
    if (localStorage.floatEmail) {
      this.form.email = localStorage.floatEmail
    }
    var report = navigator.userAgent
    if (report.includes('Line')) {
      this.report = 'Line'
    }
    if (report.includes('Facebook')) {
      this.report = 'Facebook'
    }
  },
  beforeMount () {
    if (this.$store.getters.isAuthenticated) {
      this.$router.push('account')
    }
  }
}
</script>
