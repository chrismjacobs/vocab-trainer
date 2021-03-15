
<template>
  <div id="instTests">
    <audio id="audio"></audio>

    <div class="bg-white mt-0 p-0">

      <div class="bg-grey p-2">
        <b-row>
          <b-col>
            <h3 class="text-cream"> Active Test: {{activeQuiz}} </h3>
            <b-form-select class="bg-second text-cream"
              @change="updateActive()"
              v-model="activeQuiz"
              :options="activeOptions"
              :select-size="1">
            </b-form-select>
          </b-col>
          <b-col align="right">
            <button class="buttonDiv bg-dark text-cream px-3" style="width:auto; height:auto" @click="newTest()">
                  New Test
            </button>
          </b-col>
        </b-row>
      </div>

      <table class="table table-striped">
              <thead>
                    <tr>
                      <th scope="col">Test</th>
                      <th scope="col">Type</th>
                      <th scope="col">Vocab</th>
                      <th scope="col">Results</th>
                      <th scope="col">Action</th>
                    </tr>
              </thead>
                    <tbody>
                      <template v-for="(test, index) in testRecords" >
                      <tr :key="index">
                        <th scope="row">{{index}}</th>
                        <td>{{test.type}}</td>
                        <td>{{test.list.length}}</td>
                        <td>
                          <button class="buttonDiv bg-info px-3" style="width:60px" @click="showResults(index)">
                            <b-icon variant="cream" font-scale="1" icon="arrow"></b-icon>
                          </button>
                        </td>
                        <td>
                          <button class="buttonDiv bg-safe px-3" style="width:auto; height:auto" @click="getDetails(index)">
                              <b-icon-arrow-clockwise variant="cream" font-scale="1"></b-icon-arrow-clockwise>
                          </button>
                          <button class="buttonDiv bg-danger px-3" style="width:60px;float:right" @click="deleteAlert(index)">
                            <b-icon variant="cream" font-scale="1" icon="trash-fill"></b-icon>
                          </button>

                        </td>
                      </tr>
                      <tr :key="index" v-if="results === index">
                        <td colspan="5">
                          <thead>
                            <tr>
                              <th scope="col">ID</th>
                              <th scope="col">Name</th>
                              <th scope="col">Grade</th>
                              <th scope="col">Time</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                           <tbody>
                            <template v-for="(res, idx) in $store.state.studentResults" >
                            <tr :key="idx">
                              <td> {{idx}} </td>
                              <td> {{res.name}} </td>
                              <td> {{getScore(res.quizData[index])[0]}} </td>
                              <td> {{getScore(res.quizData[index])[1]}} </td>
                              <td>  <button v-if="res.quizData[index]" @click="showAnswers(idx, index, res.quizData[index]['answerData'])" class="buttonDiv bg-info px-3">
                                      <b-icon-filter-left variant="cream" font-scale="1.5"></b-icon-filter-left>
                                    </button>
                                      <button v-if="res.quizData[index]" @click="deleteAnswers(idx, index)" class="buttonDiv bg-alert px-3">
                                        <b-icon-filter-left  variant="cream" font-scale="1.5"></b-icon-filter-left>
                                      </button>
                              </td>
                            </tr>
                            <tr v-if="answers === idx" :key="idx">
                              <td colspan="5">
                                <div class="bg-white mt-0 p-0">
                                  <InstAns :answerData="answerData" mode="CE"></InstAns>
                                </div>
                              </td>
                            </tr>
                            </template>
                          </tbody>
                        </td>
                      </tr>
                      </template>
                    </tbody>
      </table>

    </div>

    <div v-if="showDetails">
        <div class="mt-2 bg-warn p-2">
            <b-row >
              <b-col>
                <h3 class="text-cream"> Test Details: {{testDetails.title}} </h3>
                <b-input-group label="Test Title:" label-for="exampleInput1">
                    <b-input-group-prepend inline is-text>
                      <b-icon icon="filter-left"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input id="exampleInput1"
                                v-model="testDetails.title"
                                required
                                placeholder="Enter Test Name">
                    </b-form-input>
                </b-input-group>
              </b-col>
              <b-col align="right">
                <button class="buttonDiv bg-warning text-cream px-3" style="width:auto; height:auto" @click="saveTest()">
                      Save Test
                </button>
              </b-col>
            </b-row>
        <b-row class="mt-2">
          <b-col>
          <b-input-group label="Vocab:" label-for="exampleInput2">
              <b-input-group-prepend inline is-text>
                <b-icon icon="grid3x2-gap"></b-icon>
              </b-input-group-prepend>
              <b-form-input id="exampleInput2"
                          v-model="selected[0]"
                          placeholder="Search Vocab">
              </b-form-input>
          </b-input-group>
          </b-col>
        </b-row>
        </div>

        <div>
          <InstTable :selected="selected" :list="testDetails['list']" mode="instructor"></InstTable>
        </div>

    </div>

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="success" hide-footer title="Success">
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
import InstTable from './InstTable'
import InstAns from './InstAns'

export default {
  name: 'InstTests',
  components: {
    InstTable,
    InstAns
  },
  data () {
    return {
      masterDetails: {
        title: null,
        type: 'ECN',
        list: [],
        status: 0
      },
      testDetails: {
        title: null,
        type: 'ECN',
        list: [],
        status: 0
      },
      msg: null,
      results: null,
      answers: null,
      answerData: [],
      testRecords: {},
      showDetails: false,
      selected: ['', true],
      testTypes: [
        { value: 'ECN', label: 'Eng --> Ch (Normal)' }
      ]
    }
  },
  methods: {
    showModal: function (msg) {
      this.msg = msg
      this.$refs['success'].show()
    },
    showAlert: function (msg) {
      this.msg = msg
      this.$refs['fail'].show()
    },
    hideModal: function (mode) {
      this.$refs[mode].hide()
    },
    deleteAlert: function (index) {
      console.log(this.testRecords)
      let array = this.testRecords
      this.showDetails = false
      this.results = false
      if (array[index]) {
        delete array[index]
        this.testRecords = {...this.testRecords}
        this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setTests', testData: this.testRecords })
      }
    },
    deleteAnswers: function (idx, index) {
      console.log('delete', idx, index)
      this.studentTests = {...this.$store.state.studentResults[idx]}

      this.studentTests[index] = {
        answerData: [], score: 0, time: 0
      }
      this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setStudent', student: idx, studentTests: this.studentTests })
      this.answers = [null, null]
    },
    showAnswers: function (idx, index, answerData) {
      console.log('show', idx, index, answerData)
      if (this.answers === idx) {
        this.answerData = null
        this.answers = null
      } else {
        this.answerData = answerData
        this.answers = idx
      }
      console.log(this.answers)
    },
    showResults: function (index) {
      if (this.results === index) {
        this.results = null
      } else {
        this.results = index
      }
    },
    getScore: function (data) {
      console.log(data)
      if (data) {
        return [data.score, data.time]
      } else {
        return ['-', '-']
      }
    },
    updateActive: function () {
      this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setActive', activeQuiz: this.activeQuiz })
    },
    getDetails: function (test) {
      this.showDetails = true
      this.results = false
      this.testDetails = this.testRecords[test]
    },
    newTest: function () {
      this.showDetails = true
      this.testDetails = {...this.masterDetails}
    },
    saveTest: function () {
      this.showDetails = false
      this.selected[0] = ''
      this.testRecords[this.testDetails.title] = this.testDetails
      this.testRecords = {...this.testRecords}
      this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setTests', testData: this.testRecords })
    },
    getColor: function (index) {
      let status = this.testRecords[index].status
      let colors = {
        0: 'alert',
        1: 'warning'
      }
      return colors[status]
    },
    filterTable: function (row, filter) {
      if (filter[0] === '') {
        if (this.testDetails.list.includes(row.English)) {
          return true
        } else {
          return false
        }
      } else if (filter[0].length === 1) {
        if (filter[0] === row.English[0]) {
          return true
        }
      } else if (row.English.includes(filter[0].trim())) {
        return true
      } else {
        return false
      }
    },
    playAudio: function (arg, folder, link, normal) {
      // folder === '_en'
      let markerIcon = document.getElementById(this.audioMarker[0] + this.audioMarker[1])
      console.log(markerIcon, link)

      // sets unreset icon back
      if (markerIcon) {
        markerIcon.setAttribute('class', 'text-prime')
      }

      let textColor

      if (normal) {
        textColor = 'text-warn'
      } else {
        textColor = 'text-' + this.getSoundwave()
      }

      this.audioMarker = [arg, folder]
      let icon = document.getElementById(arg + folder)
      icon.setAttribute('class', textColor)

      let player = document.getElementById('audio')
      player.src = link

      let _this = this

      player.addEventListener('error', function (e) {
        console.log('Logging playback error: ' + e)
        icon.setAttribute('class', 'text-prime')
        _this.note = 'Sorry, no audio available'
        _this.showAlert()
      })

      player.play()
      player.onended = function () {
        icon.setAttribute('class', 'text-prime')
      }
    }
  },
  computed: {
    tableItems () {
      // console.log('tableGet', this.$store.getters.makeList)
      return this.$store.getters.makeList
    },
    activeOptions () {
      return this.$store.getters.makeActiveOptions
    },
    activeQuiz: {
      // getter
      get: function () {
        return this.$store.state.activeQuiz
      },
      // setter
      set: function (newValue) {
        this.$store.state.activeQuiz = newValue
      }
    }
  },
  created () {
    let recs = this.$store.getters.testRecords
    this.testRecords = {...recs}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
