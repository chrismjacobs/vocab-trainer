<template>
    <div class="change">
    <b-container>
    <b-row class="mt-5 mx-auto">
      <b-col>
        <b-card v-if="waiting" header="Reset Password" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
          <b-form @submit="onSubmit">

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

            <b-input-group  class="mt-4" id="password" label="Password:" label-for="exampleInput2">
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

            <b-input-group class="my-4" id="exampleInputGroup3" label="Confirm Password:" label-for="exampleInput3">
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
                </div>
            </div>
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
export default {
  name: 'change',
  data () {
    return {
      form: {
        email: '',
        password: '',
        confirm: ''
      },
      waiting: true,
      msg: null
    }
  },
  computed: {
    validPass () {
      return this.form.password === this.form.confirm
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
        this.$router.push('/login')
      } else {
        this.$refs['fail'].hide()
        this.msg = null
        this.waiting = true
      }
    },
    onSubmit (evt) {
      console.log(evt)
      evt.preventDefault()
      this.changePassword()
    },
    changePassword () {
      if (!this.validPass) {
        this.showAlert('Check Password')
        return false
      }
      this.waiting = false
      let _this = this
      this.$store.dispatch('changePassword', { userData: this.form })
        .then(function (response) {
          if (!response.status) {
            _this.showAlert(response.msg)
          } else {
            _this.showModal(response.msg)
          }
        })
    }
  },
  created () {
    if (localStorage.floatEmail) {
      this.form.email = localStorage.floatEmail
    }
  }
}
</script>
