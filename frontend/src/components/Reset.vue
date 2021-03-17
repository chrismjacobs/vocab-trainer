<template>
  <div class="reset">
    <b-container>
    <b-row class="mt-5 mx-auto">
      <b-col>
        <b-card header="Reset" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
          <b-form @submit="onSubmit">

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

            <button class="buttonDiv bg-alert second text-cream px-3" style="width:140px" @click="requestToken()"> New Password </button>
          </b-form>
        </b-card>
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
  name: 'reset',
  data () {
    return {
      form: {
        email: ''
      },
      msg: null
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
      }
    },
    onSubmit (evt) {
      console.log(evt)
      evt.preventDefault()
      this.requestToken()
    },
    requestToken () {
      let _this = this
      this.$store.dispatch('requestToken', { email: this.form.email })
        .then(function (response) {
          if (!response.status) {
            _this.showAlert(response.msg)
          } else {
            localStorage.setItem('floatEmail', this.form.email)
            localStorage.setItem('tokenReady', true)
            _this.showModal(response.msg)
          }
          _this.$router.push('login')
        })
    }
  }
}
</script>
