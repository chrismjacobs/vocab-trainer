
<template>
  <div id="instTests">
    <audio id="audio"></audio>

    <div class="bg-white mt-0 p-0">

      <div class="bg-grey p-2">
        <b-row>
          <b-col align="right">
            <button class="buttonDiv bg-darkgrey text-cream px-3 ml-3" style="width:auto; height:auto" @click="getResults()">
                  Update
            </button>
            <button class="buttonDiv bg-warn text-cream px-3" style="width:auto; height:auto" @click="newTest()">
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
                      <th scope="col">Edit</th>
                      <th scope="col">Active</th>
                      <th scope="col">Copy</th>
                      <th scope="col">Delete</th>
                    </tr>
              </thead>
                    <tbody>
                      <template v-for="(test, index) in testRecords" >
                      <tr :key="index">
                        <th scope="row">{{index}}</th>
                        <td :class="getTypeCol(test.type)">{{test.type}}</td>
                        <td>{{test.list.length}}</td>
                        <td>
                          <button class="buttonDiv bg-smoke text-prime px-3" style="width:60px" @click="showResults(index)">
                            {{getCompleted(index)}}
                          </button>
                        </td>
                        <td>
                          <button class="buttonDiv bg-smoke text-safe px-3 mr-3" style="width:auto; height:auto" @click="getDetails(index)">
                              <b-icon-folder-plus variant="safe" font-scale="1"></b-icon-folder-plus>
                          </button>
                        </td>
                        <td>
                          <button v-if="index in activeQuiz" class="buttonDiv bg-warning px-3" style="width:auto; height:auto" @click="updateActive(index)">
                              <b-icon icon="check"></b-icon>
                          </button>
                          <button v-else class="buttonDiv bg-smoke px-3" style="width:auto; height:auto" @click="updateActive(index)">
                              <b-icon icon="check"></b-icon>
                          </button>
                        </td>
                        <td>
                          <button class="buttonDiv bg-smoke text-warn px-3 mr-3 " style="width:auto; height:auto" @click="copyDetails(index)">
                              <b-icon-collection variant="warn" font-scale="1"></b-icon-collection>
                          </button>
                        </td>
                        <td>
                          <button class="buttonDiv bg-smoke px-3 mr-3" style="width:60px" @click="deleteModal(null, index)">
                            <b-icon variant="alert" font-scale="1" icon="trash-fill"></b-icon>
                          </button>
                        </td>
                      </tr>
                      <transition name="tableboard" :key="index + '1'">
                        <tr v-if="results === index">
                          <td colspan="8">
                            <b-table
                              sticky-header="500px"
                              striped hover
                              :items="studentResults"
                              :fields="fields"
                              show-empty
                              fixed
                              head-variant="dark"
                              >

                            <template v-slot:cell(quizData)="data">
                                {{ getScore(data.item.quizData[index], index)[0] }}
                            </template>
                            <template v-slot:cell(time)="data">
                                {{ getScore(data.item.quizData[index], index)[2] }}
                            </template>
                            <template v-slot:cell(answers)="data">
                                  <button v-if="data.item.quizData[index]" @click="showAnswers(data.item.uid, index, data.item.quizData[index]['answerData'])" class="buttonDiv bg-grey px-3">
                                    <b-icon-filter-left variant="cream" font-scale="1"></b-icon-filter-left>
                                  </button>
                            </template>
                            <template v-slot:cell(delete)="data">
                                  <button v-if="data.item.quizData[index]" @click="deleteModal(data.item.uid, index)" class="buttonDiv bg-alert px-3">
                                    <b-icon variant="cream" font-scale="1" icon="trash-fill"></b-icon>
                                  </button>
                            </template>
                            </b-table>

                            <b-table
                              sticky-header="300px"
                              striped hover
                              :items="answerStats"
                              :fields="fieldStats"
                              show-empty
                              fixed
                              head-variant="light"
                              >
                            </b-table>
                          </td>
                        </tr>
                      </transition>

                      </template>

                    </tbody>
      </table>

    </div>

    <div v-if="showDetails">
        <div class="mt-2 bg-darkgrey p-2">
            <b-row >
              <b-col>
                <h3 class="text-cream"> Test Details: {{testDetails.title}} </h3>
                <b-input-group label="Test Title:" label-for="exampleInput1" v-if="!testRecords[testDetails.title]">
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
              <b-col>
                <h3 class="text-cream"> Count: {{testDetails.list.length}} </h3>
                <b-form-radio-group
                    id="btn-radios-2"
                    v-model="testDetails.type"
                    :options="testTypes"
                    buttons
                    :button-variant="getTypeVar()"
                    name="radio-btn-outline"
                  ></b-form-radio-group>
              </b-col>
              <b-col align="right">
                <button class="buttonDiv bg-warning text-cream px-3" style="width:auto; height:auto" @click="saveTest()">
                      <b-icon icon="cloud-upload" font-scale="2"></b-icon> SAVE
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

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="delete" hide-footer title="Delete">
      <div class="d-block">
        <h3> You are about to delete a record. Are you sure you want to delete? </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('delete')">No</button>

      <button class="buttonDiv mt-3 bg-safe text-cream" style="width:60%"  @click="deleteMode('delete')">Yes</button>
    </b-modal>

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="reset" hide-footer title="Reset">
      <div class="d-block">
        <h3> You are about to reset a students quiz. Are you sure you want to reset? </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('reset')">No</button>

      <button class="buttonDiv mt-3 bg-safe text-cream" style="width:60%"  @click="deleteMode('reset')">Yes</button>
    </b-modal>

   <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="fail" hide-footer title="Problem Found">
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('fail')">Close</button>
    </b-modal>

   <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="answers" hide-footer title="Student Answers">
      <div class="d-block">
         <div class="bg-white mt-0 p-0">
            <InstAns :answerData="answerData" mode="CE"></InstAns>
          </div>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('answers')">Close</button>
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
  props: {
    group: String
  },
  data () {
    return {
      testDetails: {
        title: null,
        type: null,
        list: [],
        status: 0
      },
      msg: null,
      holder: [null, null],
      testHolder: null,
      results: null,
      answers: null,
      answerData: [],
      showDetails: false,
      selected: ['', true],
      testTypes: [
        { value: 'E>C', text: 'Eng>Ch' },
        { value: 'C>E', text: 'Ch>Eng' }
      ],
      fields: [
        {key: 'studentID', label: 'ID', sortable: true},
        {key: 'user', label: 'Name', sortable: true},
        {key: 'quizData', label: 'Grade(%)', sortable: true},
        {key: 'time', label: 'Time'},
        {key: 'answers', label: 'Answers'},
        {key: 'delete', label: 'Delete'}
      ],
      fieldStats: [
        {key: 'vocab', label: 'Vocab', sortable: true},
        {key: 'errors', label: 'Errors', sortable: true}
      ]
    }
  },
  methods: {
    showModal: function (msg) {
      this.msg = msg
      this.$refs['success'].show()
    },
    showAnsModal: function (msg) {
      this.$refs['answers'].show()
    },
    deleteModal: function (idx, index) {
      console.log('deleteModal', idx, index)
      this.holder = [idx, index]
      if (idx) {
        this.$refs['reset'].show()
      } else {
        this.$refs['delete'].show()
      }
    },
    showAlert: function (msg) {
      this.msg = msg
      this.$refs['fail'].show()
    },
    hideModal: function (mode) {
      this.$refs[mode].hide()
    },
    deleteMode: function (mode) {
      this.$refs[mode].hide()
      if (!this.holder[0]) {
        this.deleteQuiz()
      } else {
        this.deleteAnswers()
      }
    },
    deleteQuiz: function () {
      // console.log(this.holder, this.activeQuiz)
      let index = this.holder[1]
      this.$refs['delete'].hide()
      this.showDetails = false
      this.results = false

      this.updateActive(index, true)

      if (this.testRecords[index]) {
        this.testHolder = {...this.testRecords}
        delete (this.testHolder[index])
        this.$store.dispatch('instructorLogs', { group: this.classLoad, action: 'setTests', testData: this.testHolder })
      }
    },
    deleteAnswers: function () {
      let idx = this.holder[0] // student
      let index = this.holder[1] // test

      console.log('delete', idx, index)
      this.studentTests = {...this.studentResults[idx]}

      this.studentTests[index] = {
        answerData: [], score: 0, time: 0
      }
      /// need to update student Results
      this.$store.dispatch('instructorLogs', { group: this.classLoad, action: 'setStudent', student: idx, studentTests: this.studentTests })
      this.$store.dispatch('instructorLogs', { group: this.classLoad, action: 'getResults' })
    },
    showAnswers: function (idx, index, answerData) {
      console.log('show', idx, index, answerData)
      this.answerData = answerData
      this.showAnsModal()
    },
    showResults: function (index) {
      if (this.results === index) {
        this.results = null
      } else {
        this.results = index
      }
    },
    getTypeVar: function () {
      if (this.testDetails.type) {
        return 'safe'
      } else {
        return 'warning'
      }
    },
    getTypeCol: function (type) {
      let colors = {
        'E>C': 'text-info',
        'C>E': 'text-warn',
        null: 'bg-alert'
      }
      return colors[type]
    },
    getCompleted: function (index) {
      console.log(index, this.studentResults)
      let results = this.studentResults
      let count = 0
      for (let s in results) {
        if (results[s].quizData[index]) {
          count += 1
        }
      }
      return count
    },
    getScore: function (data, index) {
      // console.log(data, index, this.testRecords)
      if (data) {
        let score = data.score
        let comp = data.answerData.length
        let list = this.testRecords[index].list.length
        let grade = (score / list) * 100
        let complete = (list / comp) * 100
        return [Math.round(grade), Math.round(complete), data.time]
      } else {
        return ['-', '-', '-']
      }
    },
    updateActive: function (index, action) {
      this.$store.dispatch('updateActive', { index: index, action: action })
    },
    getResults: function () {
      this.$store.dispatch('clearResults')
      this.$store.dispatch('instructorLogs', { group: this.group, action: 'getResults' })
    },
    getDetails: function (test) {
      if (this.showDetails && this.testDetails === this.testRecords[test]) {
        this.showDetails = false
        this.testDetails = {
          title: null,
          type: null,
          list: [],
          status: 0
        }
      } else {
        this.results = null
        this.showDetails = true
        this.results = false
        this.testDetails = this.testRecords[test]
      }
    },
    copyDetails: function (test) {
      this.testDetails = {
        title: this.testRecords[test].title + 'copy',
        type: null,
        list: this.testRecords[test].list
      }

      this.showDetails = true
      this.results = false
    },
    newTest: function () {
      let masterDetails = {
        title: null,
        type: null,
        list: []
      }
      this.showDetails = true
      this.results = null
      this.testDetails = {...masterDetails}
    },
    saveTest: function () {
      this.showDetails = false
      this.selected[0] = ''
      this.testRecords[this.testDetails.title] = this.testDetails
      this.testRecords = {...this.testRecords}
      this.$store.dispatch('instructorLogs', { group: this.classLoad, action: 'setTests', testData: this.testRecords })
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
    }
  },
  computed: {
    tableItems () {
      // console.log('tableGet', this.$store.getters.makeList)
      return this.$store.getters.makeList
    },
    activeQuiz () {
      return this.$store.state.instructor.activeQuiz
    },
    testRecords () {
      return this.$store.state.instructor.testRecords
    },
    classLoad () {
      return this.$store.state.instructor.classLoad
    },
    studentResults () {
      let classRec = this.$store.state.instructor.classRecords
      let oldResults = this.$store.state.instructor.studentResults
      let newResults = []
      if (oldResults.length > 0) {
        for (let n in classRec) {
          let found = oldResults.find(element => element.uid === n)
          let quizData = {}
          if (found) {
            quizData = found.quizData
          }
          newResults.push({uid: n, quizData: quizData, user: classRec[n].user, studentID: classRec[n].studentID})
        }
      }
      return newResults
    },
    answerStats () {
      let stats = {}
      for (let s in this.studentResults) {
        console.log('stats', this.studentResults[s].quizData)
        if (this.studentResults[s].quizData[this.results]) {
          let data = this.studentResults[s].quizData[this.results].answerData
          for (let a in data) {
            let english = data[a].English
            if (!stats[english]) {
              stats[english] = 0
            }
            if (data[a].Score === -1) {
              stats[english] += 1
            }
          }
        }
      }
      let arrayItems = []
      for (let e in stats) {
        arrayItems.push({vocab: e, errors: stats[e]})
      }
      return arrayItems
    }
  },
  created () {
    this.getResults()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
