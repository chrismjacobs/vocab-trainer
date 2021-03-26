
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
                <tr v-for="(entry, index) in classGroups" :key="index" :class="getRow(entry.code)[0]">
                  <th scope="row">{{index}}</th>
                  <td>{{entry.code}}</td>
                  <td>{{entry.count}}</td>
                  <td>  <button class="buttonDiv bg-info px-3" style="width:auto; height:auto" @click="getClass(entry.code)">
                    <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise>
                    </button>
                    <span class="ml-2" v-if="getRow(entry.code)[0]"> {{getRow(entry.code)[1]}} </span>
                  </td>
                </tr>
              </tbody>
            </table>
    </div>

    <div :class="'mt-2 p-2 head bg-' + color[show] ">
      <div class="ml-2">
        <b-row >
          <b-col >
            <h3 class="text-prime" > Class: {{classLoad}} </h3>
          </b-col>
          <template>
              <b-col align="right">
                <div>
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

    <div v-if="classRecords && show === 'class'" class="bg-white mt-0 p-0">
     <InstClass></InstClass>
    </div>

    <div v-else-if="classLoad && show === 'tests' " class="bg-white mt-0 p-0">
     <InstTests :group="classLoad"></InstTests>
    </div>

    <div v-else-if="classRecords && show === 'picts'" class="bg-white mt-0 p-0">
     <InstSent :group="classLoad"></InstSent>
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
import InstSent from './InstSent'

export default {
  name: 'Instructor',
  props: {
    s3: String
  },
  components: {
    InstClass,
    InstTests,
    InstMatch,
    InstSent
  },
  data () {
    return {
      show: 'tests',
      waiting: false,
      optionsR: [
        { value: 'tests', text: 'TEST' },
        { value: 'class', text: 'CLASS' },
        // { value: 'picts', text: 'PICTURES' },
        { value: 'match', text: 'MATCH' }
      ],
      color: {
        class: 'p1',
        tests: 'warn-light',
        picts: 'safe',
        match: 'grape-light'
      }
    }
  },
  methods: {
    getClass: function (group) {
      this.waiting = true
      this.$store.dispatch('clearRecords')
      this.$store.dispatch('classRecords', { userID: this.$store.state.userProfile.userID, classroom: group })
    },
    getTests: function () {
      this.waiting = true
      this.show = 'tests'
    },
    getRow: function (index) {
      if (index === this.$store.state.userProfile.classroom) {
        return ['bg-p1-light', 'logged in']
      } else if (this.classLoad === index) {
        return ['bg-warn-light', 'loaded']
      } else {
        return [null, null]
      }
    }
  },
  created () {
    if (!this.classGroups) {
      this.$store.dispatch('classGroups', { userID: this.$store.state.userProfile.userID })
    }
    if (!this.classLoad) {
      this.getClass(this.$store.state.userProfile.classroom)
    }
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
    },
    classLoad () {
      return this.$store.state.instructor.classLoad
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
