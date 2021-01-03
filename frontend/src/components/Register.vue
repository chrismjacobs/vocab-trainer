<template>
    <div class="register">
        <b-card v-if="waiting" header="Join Vocab Trainer" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">

            <b-input-group class="my-2" label="Username:" label-for="exampleInput1">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="person-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                            id="username"
                            v-model="form.username"
                            required
                            placeholder="Enter username">
                </b-form-input>
                <b-form-invalid-feedback :state="validName">
                  Your username must be 3-20 characters long.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validName">
                  Looks Good.
                </b-form-valid-feedback>
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

            <!-- <b-input-group class="my-4" label="Class Code:" label-for="exampleInput7">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="people"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="class"
                required
                v-model="form.classroom"
                placeholder="Class Code"
                >
                </b-form-input>
            </b-input-group> -->

            <!-- <b-input-group class="my-4" label="Student ID:" label-for="exampleInput7">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="person-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="studentID"
                required
                v-model="form.studentID"
                placeholder="Student ID"
                >
                </b-form-input>
            </b-input-group> -->

            <b-input-group id="password" label="Password:" label-for="exampleInput2">
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
                <button class="buttonDiv bg-info px-3" style="width:140px" type="submit"> <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward></button>
                &nbsp;&nbsp;
                <button class="buttonDiv bg-alert px-3" style="width:60px" type="reset"> <b-icon-x-circle variant="cream" font-scale="1.5"></b-icon-x-circle></button>
                </div>
            </div>
          </b-form>
        </b-card>
        <div v-else align="center">
            <h4 class="text-prime"> Registering </h4>
            <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
        </div>

   <b-modal align="center" ref="success" hide-footer title="Registration Complete" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-third text-prime" style="width:60%"  @click="hideModal('success')">Close</button>
    </b-modal>

   <b-modal align="center" ref="fail" hide-footer title="Problem Found" hide-header-close no-close-on-esc no-close-on-backdrop>
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('fail', 0)">Close</button>
      <br>
      <button class="buttonDiv mt-3 bg-info text-cream" style="width:60%"  @click="hideModal('fail', err)">Login</button>
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
        username: '',
        email: '',
        // class: '',
        // studentID: '',
        password: '',
        confirm: ''
      },
      show: true,
      waiting: true,
      vocabs: [
        {text: 'ESP Tourism 1', value: 'tourism'},
        {text: 'ESP Food (Vietnamese)', value: 'food'}
      ],
      msg: null,
      err: 0
    }
  },
  computed: {
    validName () {
      return this.form.username.length > 2 && this.form.username.length < 20
    },
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
    hideModal (mode, arg) {
      if (mode === 'success') {
        this.$refs['success'].hide()
        router.push('/login')
      } else {
        this.$refs['fail'].hide()
        if (arg === 1) {
          router.push('/login')
        }
        this.msg = null
        this.waiting = true
      }
    },
    onSubmit (evt) {
      evt.preventDefault()
      if (this.validName && this.validPass) {
        this.register()
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
    register () {
      this.waiting = false
      let _this = this
      this.$store.dispatch('register', { userData: this.form })
        .then(function (response) {
          if (response.err) {
            _this.showAlert(response.msg)
            _this.err = response.err
          } else {
            _this.showModal(response.msg)
          }
        })
    }
  },
  created () {
    if (this.$store.getters.isAuthenticated) {
      this.$router.push('account')
    }
  }
}
</script>
