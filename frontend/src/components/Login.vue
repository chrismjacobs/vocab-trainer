<template>
    <div class="login">
    <b-container>
    <b-row class="mt-5" style="background:blue">
      <b-col>
        <b-card class="p-3" border-variant="primary" header="Login" header-bg-variant="primary" header-text-variant="white" header-tag="h3">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="exampleInputGroup1"
                            label="Student ID:"
                            label-for="exampleInput1"
                            >
                <b-form-input id="exampleInput1"
                            v-model="form.studentID"
                            required
                            placeholder="Enter Student ID">
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup2"
                            label="Password:"
                            label-for="exampleInput2">
                <b-form-input id="exampleInput2"
                            type="password"
                            v-model="form.password"
                            required
                            placeholder="Enter Password">
                </b-form-input>
            </b-form-group>

            <div class="d-flex justify-content-between">
                <div>
                <b-button type="submit" variant="primary">Submit</b-button>&nbsp;
                <b-button type="reset" variant="danger">Reset</b-button>
                </div>
            </div>
          </b-form>
          <template v-slot:footer>
            <em><a href="#" v-b-modal.modal1>Forgot Password</a></em>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>

  <b-modal id="modal1" title="Forgot Password">
      <p> Would you like to reset your password?</p>
  </b-modal>
  </div>

</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      form: {
        studentID: '',
        password: ''
      },
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.authenticate()
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form.studentID = ''
      this.form.password = ''
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    },
    authenticate () {
      this.$store.dispatch('login', { userData: this.form })
        .then(() => this.$router.push('/'))
    }
  }
}
</script>
