
<template>
  <div id="instructor">

    <div class="mt-2 bg-prime p-2 head">
      <div class="ml-2">
        <b-row >
          <b-col >
            <h3 class="text-cream" > Instructor Dashboard </h3>
          </b-col>
        </b-row>
      </div>
    </div>

    <div class="bg-white">

          <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Class</th>
                  <th scope="col">Students</th>
                  <th scope="col">Load</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in classGroups" :key="index" :class="getRow(entry.code)">
                  <th scope="row">{{index}}</th>
                  <td>{{entry.code}}</td>
                  <td>{{entry.count}}</td>
                  <td>  <button class="buttonDiv bg-info px-3" style="width:auto; height:auto" @click="getClass(entry.code)">
                    <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise>
                    </button>
                    <span class="ml-2" v-if="getRow(entry.code)"> (Logged in) </span>
                  </td>
                </tr>
              </tbody>
            </table>
    </div>

    <div class="mt-2 bg-prime p-2 head">
      <div class="ml-2">
        <b-row >
          <b-col >
            <h3 class="text-cream" > Class: {{$store.state.classLoad}} </h3>
          </b-col>
          <template>
              <b-col align="center" cols="4">
                <div class="bg-cream p-3">
                <b-form-group>
                  <b-form-radio-group
                    id="btn-radios-2"
                    v-model="show"
                    :options="optionsR"
                    style="width:100%:color:cream"
                    buttons
                    :button-variant="color[show]"
                    size="lg"
                    name="radio-btn-outline"
                  ></b-form-radio-group>
                </b-form-group>
                </div>
              </b-col>
          </template>
        </b-row>
      </div>
    </div>

    <div v-if="show === 'tests'" class="bg-white mt-0 p-0">
     <InstTests></InstTests>
    </div>

    <div v-else-if="classRecords && show === 'class'" class="bg-white mt-0 p-0">
     <InstClass></InstClass>
    </div>

    <div v-else-if="show === 'match'" class="bg-white mt-0 p-0">
     <InstMatch :s3="s3"></InstMatch>
    </div>

    <div v-else-if="waiting" align="center" class="bg-smoke">
      <br>
      <br>
        <h4 class="text-prime"> Loading Data </h4>
        <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
      <br>
      <br>
    </div>
  </div>

</template>

<script>
import InstClass from './InstClass'
import InstTests from './InstTests'
import InstMatch from './InstMatch'

export default {
  name: 'Instructor',
  props: {
    s3: String
  },
  components: {
    InstClass,
    InstTests,
    InstMatch
  },
  data () {
    return {
      show: 'tests',
      waiting: false,
      optionsR: [
        // { value: null, text: 'none' },
        { value: 'tests', text: 'TEST' },
        { value: 'class', text: 'CLASS' },
        { value: 'match', text: 'MATCH' }
      ],
      color: {
        class: 'info',
        tests: 'warn',
        match: 'grape'
      }
    }
  },
  methods: {
    getClass: function (group) {
      this.waiting = true
      this.show = 'tests'
      this.group = group
      this.$store.dispatch('instructorLogs', { group: group, action: 'getNotesInstructor' })
      this.$store.dispatch('instructorLogs', { group: group, action: 'getTests' })
      this.$store.dispatch('instructorLogs', { group: group, action: 'getResults' })
      this.$store.dispatch('classRecords', { userID: this.$store.state.userProfile.userID, classroom: group })
    },
    getTests: function () {
      this.waiting = true
      this.show = 'tests'
    },
    getRow: function (index) {
      if (index === this.$store.state.userProfile.classroom) {
        return 'bg-p1-light'
      } else {
        return null
      }
    }
  },
  created () {
    this.$store.dispatch('classGroups', { userID: this.$store.state.userProfile.userID })
    this.getClass(this.$store.state.userProfile.classroom)
  },
  computed: {
    classRecords () {
      return this.$store.getters.classRecords
    },
    classGroups () {
      return this.$store.getters.classGroups
    },
    testRecords () {
      return this.$store.getters.testRecords
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
