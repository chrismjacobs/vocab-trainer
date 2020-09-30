<template>
    <div class="help">
    <b-container style="height:100vh">
    <b-row class="mt-5">
      <b-col>
        <b-card v-if="waiting" header="Question" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">

            <b-input-group class="my-4" label="Topic:" label-for="exampleInput7">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="card-list"></b-icon>
                </b-input-group-prepend>
                <b-form-select id="topic"
                required
                :options="issues"
                v-model="form.topic"
                >
                </b-form-select>
            </b-input-group>

            <b-input-group class="my-4" label="Device:" label-for="exampleInput8">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="card-list"></b-icon>
                </b-input-group-prepend>
                <b-form-select id="device"
                required
                :options="devices"
                v-model="form.device"
                >
                </b-form-select>
            </b-input-group>

            <b-input-group label="Email:" label-for="exampleInput1">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="envelope"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="exampleInput1"
                            v-model="form.issue"
                            placeholder="Explain your question or problem">
                </b-form-input>
            </b-input-group>

            <div class="d-flex justify-content-between">
                <div>
                <button class="buttonDiv bg-safe px-3" style="width:100px" type="submit" v-b-modal.modal1> <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward></button>
                </div>
            </div>
          </b-form>
        </b-card>
      <div v-else align="center">
        <h4 class="text-warn"> Sending Question </h4>
        <b-icon icon="three-dots" animation="cylon" variant="warn" font-scale="6"></b-icon>
      </div>
      </b-col>
    </b-row>
  </b-container>

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
    </b-modal>

  </div>

</template>

<script>
// import router from '../router/index'

export default {
  name: 'app',
  data () {
    return {
      form: {
        issue: '',
        topics: '',
        device: ''
      },
      show: true,
      waiting: true,
      msg: null,
      issues: [
        {text: 'Login', value: 'login'},
        {text: 'Account', value: 'account'},
        {text: 'Adding Friend', value: 'friend'},
        {text: 'Playing a Match', value: 'match'},
        {text: 'Dictionary', value: 'dictionary'},
        {text: 'Performance Data', value: 'performance'},
        {text: 'Typing', value: 'typing'},
        {text: 'Adding Picture', value: 'picture'},
        {text: 'English -> Chinese', value: 'ec'},
        {text: 'Chinese -> English', value: 'ce'},
        {text: 'Sound', value: 'sound'},
        {text: 'Other', value: 'othe '}
      ],
      devices: [
        {text: 'iPhone', value: 'ios'},
        {text: 'Android Phone', value: 'android'},
        {text: 'Windows Computer', value: 'windows'},
        {text: 'MacBook', value: 'mac'}
      ]
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
    sendTicket () {
      this.waiting = false
      let _this = this
      this.$store.dispatch('ticket', { userData: this.form })
        .then(function (response) {
          console.log('RESPONSE', response)
          if (response.err) {
            _this.showAlert(response.msg)
          } else {
            _this.showModal(response.msg)
          }
        })
    }
  }
}
</script>
