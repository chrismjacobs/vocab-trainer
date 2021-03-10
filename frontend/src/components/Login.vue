<template>
    <div class="login">
        <b-card v-if="waiting" header="Login" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
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

            <b-input-group class="my-4" label="Password:" label-for="exampleInput2">
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
            <em><a href="#" @click="showEmail = true">Forgot Password</a></em>
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
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-prime text-cream" style="width:60%"  @click="hideModal('success')">Close</button>
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
import router from '../router/index'

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
      showEmail: false
    }
  },
  methods: {
    showModal (msg) {
      this.msg = msg
      this.$refs['success'].show()
      // router.push('/login')
    },
    showAlert (msg) {
      this.msg = msg
      this.$refs['fail'].show()
    },
    hideModal (mode) {
      if (mode === 'success') {
        this.$refs['success'].hide()
        router.push('/account')
      } else if (mode === 'register') {
        this.$refs['fail'].hide()
        router.push('/register')
      } else {
        this.$refs['fail'].hide()
        this.msg = null
        this.waiting = true
      }
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.authenticate()
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
      this.waiting = false
      let _this = this
      this.$store.dispatch('login', { userData: this.form })
        .then(function (response) {
          console.log('RESPONSE', response)
          if (response.err) {
            _this.showAlert(response.msg)
          } else {
            let msg = response.msg
            var report = navigator.userAgent
            console.log(report)
            if (report.includes('Line')){
              msg = 'WARNING - You are using LINE to use this webapp. Please switch to other browser for a better user experience.'
            } else if (report.includes('FB')){
              msg = 'WARNING - You are using FACEBOOK to use this webapp. Please switch to other browser for a better user experience.'
            }
            _this.showModal(msg)
          }
        })
    }
  },
  created () {
    if (localStorage.floatEmail) {
      this.form.email = localStorage.floatEmail
    }
  },
  beforeMount () {
    if (this.$store.getters.isAuthenticated) {
      this.$router.push('account')
    }
  }
}
</script>
