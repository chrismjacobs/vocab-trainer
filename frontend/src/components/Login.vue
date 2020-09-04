<template>
    <div class="login">
    <b-container style="height:100vh">
    <b-row class="mt-5">
      <b-col>
        <b-card v-if="waiting" header="Login" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">

            <b-input-group label="Email:" label-for="exampleInput1">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="person-fill"></b-icon>
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
            <em><a href="#">Forgot Password</a></em>
          </template>
        </b-card>
      <div v-else align="center">
        <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
      </div>
      </b-col>
    </b-row>
  </b-container>

  <b-modal id="modal1" title="Logging in...">
      <p> Please wait a moment while we log you in</p>
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
      waiting: true

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
      this.form.email = ''
      this.form.password = ''
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    },
    authenticate () {
      this.waiting = false
      this.$store.dispatch('login', { userData: this.form })
        .then(() => console.log('login action'))
    }
  }
}
</script>
