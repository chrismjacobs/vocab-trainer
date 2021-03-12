
<template>
  <div id="instructor">

    <div class="mt-2 bg-second p-2 head">
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
                <tr v-for="(entry, index) in classGroups" :key="index">
                  <th scope="row">{{index}}</th>
                  <td>{{entry.code}}</td>
                  <td> {{entry.count}}</td>
                  <td>  <button class="buttonDiv bg-info px-3" style="width:auto; height:auto" @click="getClass(entry.code)">
                    <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
    </div>

    <div class="mt-2 bg-second p-2 head">
      <div class="ml-2">
        <b-row >
          <b-col >
            <h3 class="text-cream" > Class: {{$store.state.classLoad}} </h3>
          </b-col>
          <template v-if="$store.state.classLoad">
              <b-col>
                <button class="buttonDiv bg-info text-cream px-3" style="width:auto; height:auto" @click="show = 'class'">
                            CLASS LIST
                </button>
              </b-col>
              <b-col>
                <button v-if="show === 'class'" class="buttonDiv bg-alert text-cream px-3" style="width:auto; height:auto" @click="saveRecords()">
                            SAVE NOTES
                </button>
              </b-col>
              <b-col>
                <button class="buttonDiv bg-warn text-cream px-3" style="width:auto; height:auto" @click="getTests()">
                            TESTS
                </button>
              </b-col>
          </template>
        </b-row>
      </div>
    </div>

    <div v-if="classRecords && show === 'class'" class="bg-white mt-0 p-0">
     <InstClass></InstClass>
    </div>
    <div v-else-if="testRecords && show === 'tests'" class="bg-white mt-0 p-0">
     <InstTests></InstTests>
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

export default {
  name: 'Instructor',
  props: {
    s3: String
  },
  components: {
    InstClass,
    InstTests
  },
  data () {
    return {
      show: null,
      waiting: false
    }
  },
  methods: {
    getClass: function (group) {
      this.waiting = true
      this.$store.dispatch('instructorLogs', { group: group, action: 'getNotesInstructor' })
      this.$store.dispatch('instructorLogs', { group: group, action: 'getTests' })
      this.$store.dispatch('classRecords', { userID: this.$store.state.userProfile.userID, classroom: group })
      this.show = 'class'
    },
    getTests: function () {
      this.waiting = true
      this.show = 'tests'
    },
    saveRecords: function () {
      if (this.$store.state.studentNotes !== {}) {
        this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setNotes', notes: this.$store.state.studentNotes })
      }
    }
  },
  created () {
    this.$store.dispatch('classGroups', { userID: this.$store.state.userProfile.userID })
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
  },
  beforeDestroy () {
    this.saveRecords()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
