<template>
    <div class="register">
    <b-container>
    <b-row class="mt-5 mx-auto">
      <b-col>
        <b-card v-if="waiting" header="Account Information" header-bg-variant="primary" header-text-variant="info" header-tag="h3">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <div class="d-flex">
              <b-avatar src="s3 + userProfile.image" size="6rem" :text="userProfile.username[0]"></b-avatar>
              <h2 > {{ userProfile.username }} </h2>
            </div>
            <br>

            <b-form-file accept="image/*" placeholder="Change Avatar"></b-form-file>
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
                            required
                            placeholder="School name (not required)">
                </b-form-input>
            </b-input-group>

            </div>

            <div class="d-flex justify-content-between">
                <div>
                <b-button type="submit" variant="primary">Submit</b-button>&nbsp;
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
      s3: 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/',
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
      waiting: true
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
  },
  created () {
    this.userProfile = this.$store.state.userProfile
  }
}
</script>
