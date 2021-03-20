
<template>
  <div id="instTests">
    <audio id="audio"></audio>

    <div class="bg-white mt-0 p-0">

      <div class="bg-grey p-2">
        <b-row>
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
                        <td>{{test.type}}</td>
                        <td>{{test.list.length}}</td>
                        <td>
                          <button class="buttonDiv bg-info px-3" style="width:60px" @click="showResults(index)">
                            <b-icon-filter-left variant="cream" font-scale="1"></b-icon-filter-left>
                          </button>
                        </td>
                        <td>
                          <button class="buttonDiv bg-safe px-3 mr-3" style="width:auto; height:auto" @click="getDetails(index)">
                              <b-icon-folder-plus variant="cream" font-scale="1"></b-icon-folder-plus>
                          </button>
                        </td>
                        <td>
                          <button v-if="activeQuiz === index" class="buttonDiv bg-warning px-3" style="width:auto; height:auto" @click="activeCheck(index, 0)">
                              <b-icon icon="check"></b-icon>
                          </button>
                          <button v-else class="buttonDiv bg-grey px-3" style="width:auto; height:auto" @click="activeCheck(index, 1)">
                              <b-icon icon="check"></b-icon>
                          </button>
                        </td>
                        <td>
                          <button class="buttonDiv bg-warn px-3 mr-3 " style="width:auto; height:auto" @click="copyDetails(index)">
                              <b-icon-collection variant="cream" font-scale="1"></b-icon-collection>
                          </button>
                        </td>
                        <td>
                          <button class="buttonDiv bg-alert px-3 mr-3" style="width:60px" @click="deleteModal(null, index)">
                            <b-icon variant="cream" font-scale="1" icon="trash-fill"></b-icon>
                          </button>
                        </td>
                      </tr>
                      <tr :key="index + '1'" v-if="results === index">
                        <td colspan="8">
                          <b-table
                            striped hover
                            :items="$store.state.studentResults"
                            :fields="fields"
                            show-empty
                            fixed
                            head-variant="dark"
                            >

                          <template v-slot:cell(quizData)="data">
                              {{getScore(data.item.quizData[index])[0], index}}
                                </button>
                          </template>
                          <template v-slot:cell(time)="data">
                              {{getScore(data.item.quizData[index])[1], index}}
                          </template>
                          <template v-slot:cell(buttons)="data">
                                <button v-if="data.item.quizData[index]" @click="showAnswers(idx, index, data.item.quizData[index]['answerData'])" class="buttonDiv bg-info px-3">
                                  <b-icon-filter-left variant="cream" font-scale="1"></b-icon-filter-left>
                                </button>
                                <button v-if="data.item.quizData[index]" @click="deleteModal(idx, index)" class="buttonDiv bg-alert px-3">
                                  <b-icon variant="cream" font-scale="1" icon="trash-fill"></b-icon>
                                </button>
                          </template>
                          </b-table>
                        </td>
                      </tr>

                      <tr v-if="answers === idx" :key="index + '2'">
                        <td colspan="5">
                          <div class="bg-white mt-0 p-0">
                            <InstAns :answerData="answerData" mode="CE"></InstAns>
                          </div>
                        </td>
                      </tr>
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
              <b-col align="right">
                <button class="buttonDiv bg-warning text-cream px-3" style="width:auto; height:auto" @click="saveTest()">
                      <b-icon icon="cloud-upload" font-scale="2"></b-icon>
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

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="delete" hide-footer title="Success">
      <div class="d-block">
        <h3> You are about to delete a record. Are you sure you want to delete? </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('delete')">No</button>

      <button class="buttonDiv mt-3 bg-safe text-cream" style="width:60%"  @click="deleteMode()">Yes</button>
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
      testDetails: {
        title: null,
        type: 'ECN',
        list: [],
        status: 0
      },
      msg: null,
      holder: [null, null],
      results: null,
      answers: null,
      answerData: [],
      testRecords: {},
      showDetails: false,
      selected: ['', true],
      testTypes: [
        { value: 'ECN', label: 'Eng --> Ch (Normal)' }
      ],
      fields: [
        {key: 'studentID', label: 'ID', sortable: true},
        {key: 'user', label: 'Name', sortable: true},
        {key: 'quizData', label: 'Grade', sortable: true},
        {key: 'time', label: 'Time', sortable: true},
        {key: 'buttons', label: 'Action'}
      ]
    }
  },
  methods: {
    showModal: function (msg) {
      this.msg = msg
      this.$refs['success'].show()
    },
    deleteModal: function (idx, index) {
      console.log('deleteModal', idx, index)
      this.holder = [idx, index]
      this.$refs['delete'].show()
    },
    showAlert: function (msg) {
      this.msg = msg
      this.$refs['fail'].show()
    },
    hideModal: function (mode) {
      this.$refs[mode].hide()
    },
    deleteMode: function () {
      this.$refs['delete'].hide()
      if (!this.holder[0]) {
        this.deleteQuiz()
      } else {
        this.deleteAnswers()
      }
    },
    deleteQuiz: function () {
      console.log(this.holder, this.activeQuiz)
      let index = this.holder[1]
      this.$refs['delete'].hide()
      console.log(this.testRecords)
      let array = this.testRecords
      this.showDetails = false
      this.results = false
      /// a little mess to figure out here
      if (this.activeQuiz === index) {
        this.activeQuiz = ''
        this.updateActive()
      }
      if (array[index]) {
        delete array[index]
        this.testRecords = {...this.testRecords}
        this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setTests', testData: this.testRecords })
      }
    },
    deleteAnswers: function () {
      let idx = this.holder[0]
      let index = this.holder[1]

      console.log('delete', idx, index)
      this.studentTests = {...this.$store.state.studentResults[idx]}

      this.studentTests[index] = {
        answerData: [], score: 0, time: 0
      }
      this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setStudent', student: idx, studentTests: this.studentTests })
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
    activeCheck: function (index, action) {
      if (action === 0) {
        this.activeQuiz = ''
      } else {
        this.activeQuiz = index
      }
      this.updateActive()
    },
    updateActive: function () {
      this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setActive', activeQuiz: this.activeQuiz })
    },
    getDetails: function (test) {
      if (this.showDetails && this.testDetails === this.testRecords[test]) {
        this.showDetails = false
        this.testDetails = {
          title: null,
          type: 'ECN',
          list: [],
          status: 0
        }
      } else {
        this.showDetails = true
        this.results = false
        this.testDetails = this.testRecords[test]
      }
    },
    copyDetails: function (test) {
      this.testDetails = {
        title: this.testRecords[test].title + 'copy',
        type: 'ECN',
        list: this.testRecords[test].list
      }

      this.showDetails = true
      this.results = false
    },
    newTest: function () {
      let masterDetails = {
        title: null,
        type: 'ECN',
        list: []
      }
      this.showDetails = true
      this.testDetails = {...masterDetails}
    },
    saveTest: function () {
      this.showDetails = false
      this.selected[0] = ''
      this.testRecords[this.testDetails.title] = this.testDetails
      this.testRecords = {...this.testRecords}
      this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setTests', testData: this.testRecords })
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
