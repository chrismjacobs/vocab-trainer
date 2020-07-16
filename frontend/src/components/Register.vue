<template>
    <div class="register">
    <b-container>
    <b-row class="mt-5 mx-auto">
      <b-col>
        <div class="d-flex justify-content-center">
          <b-card class="p-3 w-50">
          <h3 class="mb-4">Register</h3>
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group label="Username:" label-for="exampleInput1">
                <b-form-input
                            id="username"
                            v-model="form.username"
                            required
                            placeholder="Enter username">
                </b-form-input>
                <b-form-invalid-feedback :state="validName">
                  Your user ID must be 3-12 characters long.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validName">
                  Looks Good.
                </b-form-valid-feedback>
            </b-form-group>
            <b-form-group label="Student ID:" label-for="exampleInput2">
                <b-form-input
                            id="student ID"
                            v-model="form.studentID"
                            required
                            placeholder="Enter student ID">
                </b-form-input>
            </b-form-group>
            <b-form-group label="School:" label-for="exampleInput3">
                <b-form-input
                            id="school"
                            v-model="form.school"
                            required
                            placeholder="Enter school name">
                </b-form-input>
            </b-form-group>
            <b-form-group label="Email address:" label-for="exampleInput4">
                <b-form-input
                            type="email"
                            v-model="form.email"
                            required
                            placeholder="Enter email">
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup2" label="Password:" label-for="exampleInput2">
                <b-form-input id="exampleInput2"
                            type="password"
                            v-model="form.password"
                            required>
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup3" label="Confirm Password:" label-for="exampleInput3">
                <b-form-input id="exampleInput3"
                            type="password"
                            v-model="form.confirm"
                            required>
                </b-form-input>
                <b-form-invalid-feedback :state="validPass">
                  You must enter the same password
                </b-form-invalid-feedback>
            </b-form-group>
            <div class="d-flex justify-content-between">
                <div>
                <b-button type="submit" variant="primary">Submit</b-button>&nbsp;
                <b-button type="reset" variant="danger">Reset</b-button>
                </div>
            </div>
          </b-form>
        </b-card>
        </div>
      </b-col>
    </b-row>
  </b-container>

  </div>

</template>

<script>
// Andre Madarang https://www.youtube.com/watch?v=Vu5QKn24uYs
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      form: {
        username: '',
        studentID: '',
        school: '',
        email: '',
        password: '',
        confirm: ''
      },
      show: true
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
    registerAPI () {
      let host = window.location.hostname
      if (host.includes('127') || host.includes('local')) {
        host = 'http://127.0.0.1:5000'
      }

      axios.post(host + '/api/register', this.form)
        .then(response => {
          if (response.data.error) {
            alert('Info already used: ' + response.data.error)
          } else {
            this.$router.push('login')
            alert('You have been registered - you may proceed to login')
          }
        })
        .catch(error => {
          alert('sorry, an error has occured')
          console.log(error)
        })
    },
    register () {
      this.$store.dispatch('register', { userData: this.form })
        .then(() => this.$router.push('/login'))
    }
  }
}
</script>
