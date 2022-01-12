<template>
    <div class="register">
        <b-card header="Account Information" header-bg-variant="prime" header-text-variant="cream" header-tag="h3">
          <b-form @submit="onSubmit">
            <div class="d-flex">
              <b-col @click="browse()">
                <b-avatar :src="getPict" size="6rem" :text="userProfile.username[0]"></b-avatar>
              </b-col>
              <b-col >
                <h4> {{ userProfile.username }} </h4>
                <h4> #{{ userProfile.userID }} </h4>
              </b-col>
            </div>
            <br>
            <b-form-file accept="image/*" placeholder="Change Avatar" type="file" id="file" ref="file" v-on:change="handleFileUpload()"></b-form-file>
            <div v-if="lsi" class="bg-info text-cream p-2"> Ready to update </div>
            <br>
            <b-input-group class="mt-3" label="Student ID:" label-for="exampleInput2">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="person-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="username" v-model="userProfile.username" placeholder="Student ID (if joining a class)">
                </b-form-input>
                <b-form-invalid-feedback :state="validName">
                  Your username must be 3-20 characters long.
                </b-form-invalid-feedback>
            </b-input-group>
            <div class="helpTab1" v-if="$store.getters.getHelp"> {{$store.getters.getHelp['Account']['name']}}  </div>

            <b-input-group class="mt-3" label="Email address:" label-for="exampleInput4">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="envelope"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="email"
                required
                type="email"
                v-model="userProfile.email"
                placeholder="Email (required)"
                >
                </b-form-input>
            </b-input-group>
            <div class="helpTab1" v-if="$store.getters.getHelp"> {{$store.getters.getHelp['Account']['email']}}  </div>

            <div v-if="vocabOption">
            <b-input-group class="mt-3" label="Vocab:" label-for="exampleInput7">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="card-list"></b-icon>
                </b-input-group-prepend>
                <b-form-select id="vocab"
                required
                :options="vocabs"
                v-model="userProfile.vocab"
                >
                </b-form-select>
            </b-input-group>

           </div>

            <b-input-group class="mt-3" label="Classroom:" label-for="exampleInput3">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="people"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                            id="class"
                            v-model="userProfile.classroom"
                            placeholder="Classroom"
                            :class="getClass()">
                </b-form-input>
                <b-form-invalid-feedback :state="validClass" class="text-warn">
                  Please join a classroom to play MATCH MODE and ADD PICTURES/NEW WORDS; ask your teacher for a classroom code or contact LINE: chrisj0212 to create a new classroom
                </b-form-invalid-feedback>
            </b-input-group>
            <div class="helpTab1" v-if="$store.getters.getHelp"> {{$store.getters.getHelp['Account']['classroom']}}  </div>

            <b-input-group class="mt-3" label="Student ID:" label-for="exampleInput2">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="grid3x2-gap"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="student ID" v-model="userProfile.studentID" placeholder="Student ID (if joining a class)">
                </b-form-input>
            </b-input-group>
            <div class="helpTab1" v-if="$store.getters.getHelp"> {{$store.getters.getHelp['Account']['studentid']}}  </div>

            <b-input-group class="mt-3" label="School:" label-for="exampleInput3">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="geo-alt"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                            id="school"
                            v-model="userProfile.school"
                            placeholder="School name (if joining a class)">
                </b-form-input>
            </b-input-group>

            <div class="d-flex justify-content-between mt-3">
                <div>
                <button class="buttonDiv bg-info px-3" style="width:120px" type="submit"> <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward></button>
                </div>
            </div>

          </b-form>

        </b-card>

        <br>

        <b-card header="Account Status" header-bg-variant="prime" header-text-variant="cream" header-tag="h3" class="d-block d-lg-none"  no-body>
          <div class="p-3">
          <Dash :tableItems="tableItems" type="account" ></Dash>
          </div>
        </b-card>

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
import { imageValidation } from '@/utils'
import Dash from './Dash'

export default {
  name: 'Account',
  components: {
    Dash
  },
  data () {
    return {
      cName: 'Account',
      s3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/',
      userProfile: null,
      lsi: null,
      tableItems: [],
      fileData: null,
      msg: null,
      avatarLink: this.$store.state.userProfile.userID + '/avatar.jpg',
      vocabReset: false,
      vocabOption: false,
      vocabs: [
        {text: 'ESP Tourism', value: 'tourism'},
        {text: 'Food Viet', value: 'food'}
      ]
    }
  },
  computed: {
    validName () {
      return this.userProfile.username.length > 2 && this.userProfile.username.length < 20
    },
    validClass () {
      let value = false
      if (this.userProfile.classroom) {
        value = true
      }
      return value
    },
    getPict () {
      return this.s3 + this.avatarLink
    }
  },
  methods: {
    getClass () {
      if (this.userProfile.classroom) {
        return 'bg-safe-light'
      } else {
        return 'bg-warn-light'
      }
    },
    browse () {
      document.getElementById('file').click()
    },
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
      console.log(this.vocabReset)
      if (mode === 'success') {
        this.$refs['success'].hide()
      } else {
        this.$refs['fail'].hide()
      }
      if (this.vocabReset) {
        this.$store.dispatch('logout')
      }
    },
    onSubmit (evt) {
      evt.preventDefault()
      // check all is okay
      this.account()
    },
    account () {
      let _this = this
      console.log(localStorage.imageData)
      if (localStorage.imageData) {
        this.userProfile.imageData = JSON.parse(localStorage.imageData)
      } else {
        this.userProfile.imageData = null
      }

      if (!this.validName) {
        _this.showAlert('Invalid Name')
        return false
      }

      console.log(this.userProfile)
      this.$store.dispatch('account', { userData: this.userProfile })
        .then(function (response) {
          console.log('ACCOUNT', response)
          if (response.err) {
            let msg = response.msg
            _this.showAlert(msg)
          } else if (response.newVocab) {
            let msg = 'You are changing your classroom. Please log in again to update'
            _this.showModal(msg)
            _this.vocabReset = true
          } else {
            _this.showModal(response.msg)
            _this.avatarLink = _this.$store.state.userProfile.userID + '/avatar.jpg'
            localStorage.removeItem('imageData')
          }
        })
    },
    handleFileUpload () {
      imageValidation(document.getElementById('file'))
      let _this = this
      setTimeout(function () {
        if (localStorage.imageData) {
          console.log('IMAGE')
          _this.avatarLink = 'images.jpg'
          _this.lsi = localStorage.imageData
        }
      }, 3000)
    }
  },
  created () {
    localStorage.removeItem('imageData')
    this.userProfile = this.$store.state.userProfile
    this.userProfile.imageData = ''
    console.log(this.userProfile)
    this.tableItems = this.$store.getters.makeList
  }
}
</script>
