<template>
    <div class="reset">
    <b-container>
    <b-row class="mt-5 mx-auto">
      <b-col>
        <b-card v-if="waiting" header="Register" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">

            <b-input-group class="my-4" label="Account Name:" label-for="exampleInput0">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="person"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                            v-model="form.username"
                            required
                            placeholder="Enter email">
                </b-form-input>
            </b-input-group>

            <b-input-group class="my-4" label="Email address:" label-for="exampleInput4">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="envelope"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                            type="email"
                            v-model="form.email"
                            required
                            placeholder="Enter email">
                </b-form-input>
            </b-input-group>

            <button v-if="tokenCheck == false" class="buttonDiv bg-second text-cream px-3" style="width:140px" @click="requestToken()"> Request Token </button>

            <template v-else>
            <b-input-group class="my-4" label="Token:" label-for="exampleInput4">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="caret-right-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                            v-model="form.token"
                            required
                            placeholder="Check email for token">
                </b-form-input>
            </b-input-group>

            <b-input-group v-if="form.token && form.token.length > 100" id="password" label="Password:" label-for="exampleInput2">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="lock-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="exampleInput2"
                            type="password"
                            v-model="form.password"
                            placeholder="Password"
                            required>
                </b-form-input>
            </b-input-group>

            <b-input-group v-if="form.token && form.token.length > 100" class="my-4" id="exampleInputGroup3" label="Confirm Password:" label-for="exampleInput3">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="lock-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="exampleInput3"
                            type="password"
                            v-model="form.confirm"
                            placeholder="Password"
                            required>
                </b-form-input>
                <b-form-invalid-feedback :state="validPass">
                  You must enter the same password
                </b-form-invalid-feedback>
            </b-input-group>

            <div class="d-flex justify-content-between">
                <div>
                <button class="buttonDiv bg-second px-3" style="width:140px" type="submit"> <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward></button>
                &nbsp;&nbsp;
                <button class="buttonDiv bg-alert px-3" style="width:60px" type="reset"> <b-icon-x-circle variant="cream" font-scale="1.5"></b-icon-x-circle></button>
                </div>
            </div>
            </template>
          </b-form>

        </b-card>
        <div v-else align="center">
            <h4 class="text-prime"> Reseting Password </h4>
            <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
        </div>
      </b-col>
    </b-row>
  </b-container>

   <b-modal align="center" ref="success" hide-footer title="Reset Complete">
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-safe text-cream" style="width:60%"  @click="hideModal('success')">Close</button>
    </b-modal>

   <b-modal align="center" ref="fail" hide-footer title="Problem Found">
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('fail')">Close</button>
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
        username: '',
        password: '',
        confirm: ''
      },
      show: true,
      waiting: true,
      msg: null,
      tokenCheck: false
    }
  },
  methods: {
    showModal (msg) {
      this.msg = msg
      this.$refs['success'].show()
    },
    showAlert (msg) {
      this.msg = msg
      this.$refs['fail'].show()
    },
    hideModal (mode) {
      if (mode === 'success') {
        this.$refs['success'].hide()
        router.push('/login')
      } else {
        this.$refs['fail'].hide()
        this.msg = null
        this.waiting = true
      }
    },
    onSubmit (evt) {
      evt.preventDefault()
      if (this.validName && this.validPass) {
        this.reset()
        // alert(JSON.stringify(this.form))
      } else {
        alert('form is not complete')
      }
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      for (let item in this.form) {
        this.form[item] = ''
      }
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    },
    requestToken () {
      alert('token sent to email')
      let _this = this
      this.$store.dispatch('requestToken', { username: this.username, email: this.form.email })
        .then(function (response) {
          if (response.err) {
            _this.showAlert(response.msg)
            localStorage.setItem('tokenReady', false)
          } else {
            localStorage.setItem('tokenReady', true)
            _this.showModal(response.msg)
          }
        })
    },
    reset () {
      this.waiting = false
      let _this = this
      this.$store.dispatch('reset', { userData: this.form })
        .then(function (response) {
          if (response.err) {
            _this.showAlert(response.msg)
          } else {
            _this.showModal(response.msg)
          }
        })
    }
  },
  beforeCreated () {
    localStorage.setItem('tokenReady', false)
  }
}
</script>
