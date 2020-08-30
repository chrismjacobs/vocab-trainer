<template>
    <div class="register">
    <b-container>
    <b-row class="mt-3 mx-auto">
      <b-col>
        <b-card v-if="waiting" header="Account Information" header-bg-variant="prime" header-text-variant="info" header-tag="h3">
          <b-form @submit="onSubmit" v-if="show">
            <div class="d-flex">
              <b-col >
                <b-avatar :src="s3 + userProfile.userID + '.jpg'" size="6rem" :text="userProfile.username[0]"></b-avatar>
              </b-col>
              <b-col >
                <h2> {{ userProfile.username }} </h2>
                <h3> #{{ userProfile.userID }} </h3>
              </b-col>
            </div>
            <br>

            <b-form-file accept="image/*" placeholder="Change Avatar" type="file" id="file" ref="file" v-on:change="handleFileUpload()" ></b-form-file>
            <br>
            <b-input-group class="my-4" label="Student ID:" label-for="exampleInput2">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="person-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="student ID" v-model="userProfile.username" disabled placeholder="Student ID (if joining a class)">
                </b-form-input>
            </b-input-group>

            <b-input-group class="my-4" label="Email address:" label-for="exampleInput4">
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

            <div v-if="join">
            <b-input-group class="my-4" label="Classroom:" label-for="exampleInput3">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="people"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                            id="school"
                            v-model="userProfile.classroom"
                            placeholder="Classroom (provided by your teacher)">
                </b-form-input>
            </b-input-group>

            <b-input-group class="my-4" label="Student ID:" label-for="exampleInput2">
                <b-input-group-prepend inline is-text>
                  <b-icon icon="grid3x2-gap"></b-icon>
                </b-input-group-prepend>
                <b-form-input id="student ID" v-model="userProfile.studentID" placeholder="Student ID (if joining a class)">
                </b-form-input>
            </b-input-group>

            <b-input-group class="my-4" label="School:" label-for="exampleInput3">
              <b-input-group-prepend inline is-text>
                  <b-icon icon="geo-alt"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                            id="school"
                            v-model="userProfile.school"
                            placeholder="School name (not required)">
                </b-form-input>
            </b-input-group>

            </div>
            <div class="d-flex justify-content-between">
                <div>
                <b-button type="submit" variant="prime">Submit</b-button>

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
import { imageValidation } from '@/utils'

export default {
  name: 'app',
  data () {
    return {
      s3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/',
      join: true,
      userProfile: null,
      form: {
        username: '',
        studentID: '',
        school: '',
        email: '',
        password: '',
        confirm: ''
      },
      show: true,
      waiting: true,
      fileData: null
    }
  },
  computed: {
    validName () {
      return this.form.username.length > 2 && this.form.username.length < 13
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      // check all is okay
      this.account()
    },
    account () {
      this.userProfile.imageData = JSON.parse(localStorage.imageData)
      console.log(this.userProfile)
      this.$store.dispatch('account', { userData: this.userProfile })
        .then(() => console.log('account action'))
      localStorage.removeItem('imageData')
    },
    handleFileUpload () {
      imageValidation(document.getElementById('file'))
    }
  },
  created () {
    this.userProfile = this.$store.state.userProfile
    this.userProfile.imageData = ''
    console.log(this.userProfile)
  }
}
</script>
