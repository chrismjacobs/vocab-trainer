
<template>
  <div id="InstStud">

    <div class="mt-2 bg-prime p-2 head"  v-if="!showQuiz">
      <div class="ml-2">
        <b-row >
          <b-col >
            <h3 class="text-cream" > Quiz Dashboard </h3>
          </b-col>
        </b-row>
      </div>
    </div>

    <div class="bg-white table-responsive" v-if="!showQuiz">

          <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Quiz</th>
                  <th scope="col">Type</th>
                  <th scope="col">Preview</th>
                  <th scope="col">Answers</th>
                  <th scope="col">Grade</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(entry, index) in $store.state.testRecords">
                <tr :key="index" :class="getRow(index)">
                  <th scope="row">{{index}}</th>
                  <td scope="row"> {{entry.type}}</td>

                  <td>
                     <button @click="showVocab(index, entry.list)" class="buttonDiv bg-info px-3">
                      <b-icon-filter-left variant="cream" font-scale="1"></b-icon-filter-left>
                     </button> ({{entry.list.length}})
                  </td>

                  <td>
                    <button :class="getCompColor(index)" @click="showAnswers(index)">
                      <b-icon-bookmark-check variant="cream" font-scale="1"></b-icon-bookmark-check>
                    </button>
                     <span v-if="getScore(index)[1] < 100 && getScore(index)[1] > 0"> {{getScore(index)[1]}}% Complete </span>

                  </td>

                  <td>
                    <div v-if="$store.state.activeQuiz === index && getScore(index)[0] === 0">
                      <button  @click="startQuiz(index)" class="buttonDiv bg-safe px-3">
                        <b-icon-forward variant="cream" font-scale="1"></b-icon-forward>
                      </button>
                    </div>
                    <div v-else>
                       {{getScore(index)[0]}}%
                    </div>
                  </td>
                </tr>
               </template>
              </tbody>
            </table>
    </div>

    <div v-if="showQuiz">
      <InstQuiz  v-on:quizData="recordQuiz($event)"  v-on:cancel="showQuiz = false" ></InstQuiz>
    </div>

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="answers" hide-footer title="Student Answers">
      <div class="d-block">
         <div class="bg-white mt-0 p-0">
            <InstAns :answerData="answerData" mode="CE"></InstAns>
          </div>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('answers')">Close</button>
    </b-modal>

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="vocabs" hide-footer title="Quiz Vocab">
      <div class="d-block">
         <div class="bg-white mt-0 p-0">
            <InstTable :selected="['', true]" :list="listData" mode="student"></InstTable>
          </div>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('vocabs')">Close</button>
    </b-modal>

  </div>

</template>

<script>
import InstQuiz from './InstQuiz'
import InstAns from './InstAns'
import InstTable from './InstTable'

export default {
  name: 'InstStud',
  components: {
    InstQuiz,
    InstAns,
    InstTable
  },
  data () {
    return {
      showQuiz: false,
      waiting: false,
      studentTestDup: null,
      showAns: null,
      showVoc: null,
      answerData: [],
      listData: []
    }
  },
  methods: {
    showAnsModal: function (msg) {
      this.$refs['answers'].show()
    },
    showVocModal: function (msg) {
      this.$refs['vocabs'].show()
    },
    hideModal: function (mode) {
      this.$refs[mode].hide()
    },
    getCompColor: function (index) {
      let colors = {
        1: 'buttonDiv bg-safe px-3',
        2: 'buttonDiv bg-warn px-3'
      }
      let comp = this.getScore(index)[1]
      if (comp < 100) {
        return colors[2]
      } else {
        return colors[1]
      }
    },
    getRow: function (index) {
      if (this.$store.state.activeQuiz === index) {
        return 'bg-peel'
      }
    },
    getStudent: function () {
      let profile = this.$store.state.userProfile
      this.$store.dispatch('instructorLogs', { group: profile.classroom, action: 'getStudent', student: profile.userID })
      this.$store.dispatch('instructorLogs', { group: profile.classroom, action: 'getTests', student: profile.userID })
    },
    getScore: function (index) {
      console.log(index, this.studentTests[index])
      let student = this.studentTests[index]
      if (student && student.score > 0) {
        let score = student.score
        let comp = student.answerData.length
        let list = this.$store.state.testRecords[index].list.length
        let grade = (score / list) * 100
        let complete = (list / comp) * 100
        return [Math.round(grade), Math.round(complete)]
      } else {
        return [0, 0]
      }
    },
    startQuiz: function () {
      this.showQuiz = true
    },
    showAnswers: function (index) {
      this.answerData = this.studentTests[index]['answerData']
      this.showAnsModal()
    },
    showVocab: function (index, list) {
      this.listData = list
      this.showVocModal()
    },
    recordQuiz: function (payload) {
      // this.studentTestDup = {...this.studentTests}
      this.showQuiz = false
      this.studentTests[this.$store.state.activeQuiz] = payload
      let profile = this.$store.state.userProfile

      this.$store.dispatch('instructorLogs', { group: profile.classroom, action: 'setStudent', student: profile.userID, studentTests: this.studentTests })
    }
  },
  created () {
    this.getStudent()
  },
  computed: {
    studentTests () {
      return this.$store.state.studentTests
    }
  },
  beforeDestroy () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
