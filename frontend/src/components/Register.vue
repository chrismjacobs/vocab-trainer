<template>
    <div class="register">
    <b-container>
    <b-row class="mt-5 mx-auto">
      <b-col>
        <b-card v-if="waiting" header="Register" header-bg-variant="prime" header-text-variant="info" header-tag="h3">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">

            <b-input-group class="my-4" label="Username:" label-for="exampleInput1">
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
                  Your username must be 3-12 characters long.
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

            <b-input-group id="password" label="Password:" label-for="exampleInput2">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="lock-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="exampleInput2"
                            type="password"
                            v-model="form.password"
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
                            required>
                </b-form-input>
                <b-form-invalid-feedback :state="validPass">
                  You must enter the same password
                </b-form-invalid-feedback>
            </b-input-group>

            <div class="d-flex justify-content-between">
                <div>
                <b-button type="submit" variant="prime">Submit</b-button>&nbsp;
                <b-button type="reset" variant="danger">Reset</b-button>
                </div>
            </div>
          </b-form>
        </b-card>
        <b-card v-else align="center">
            <b-icon icon="three-dots" animation="cylon" font-scale="6"></b-icon>
        </b-card>
      </b-col>
    </b-row>
  </b-container>

  </div>

</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirm: ''
      },
      show: true,
      waiting: true
    }
  },
  computed: {
    validName () {
      return this.form.username.length > 2 && this.form.username.length < 13
    },
    validPass () {
      return this.form.password === this.form.confirm
    }
  },
  methods: {
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
      this.$store.dispatch('register', { userData: this.form })
        .then(() => console.log('registration action'))
    }
  }
}
</script>
