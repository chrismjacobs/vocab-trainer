
<template>
  <div id="InstStud">

    <div class="mt-2 bg-second p-2 head">
      <div class="ml-2">
        <b-row >
          <b-col >
            <h3 class="text-cream" > Quiz Dashboard </h3>
          </b-col>
        </b-row>
      </div>
    </div>

    <div class="bg-white" v-if="!showQuiz">

          <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Quiz</th>
                  <th scope="col">Words</th>
                  <th scope="col">Grade</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(entry, index) in $store.getters.testRecords">
                <tr :key="index">
                  <th scope="row">{{index}}</th>
                  <td><button @click="showVocab(index)" class="buttonDiv bg-info px-3">
                      <b-icon-filter-left variant="cream" font-scale="1.5"></b-icon-filter-left>
                    </button> ({{entry.list.length}})
                    </td>
                  <td>
                    <div v-if="$store.state.activeQuiz === index && getScore(index) === 0"  >
                      <button  @click="startQuiz(index)" class="buttonDiv bg-warning px-3">
                      <b-icon-forward variant="cream" font-scale="1.5"></b-icon-forward>
                      </button>
                    </div>
                    <div v-else-if="$store.state.activeQuiz === index && getScore(index) > 0" >
                      <button  @click="showAnswers(index)" class="buttonDiv bg-warning px-3">
                      <b-icon-filter-left variant="cream" font-scale="1.5"></b-icon-filter-left>
                    </button>  {{getScore(index)}}%
                    </div>
                    <div v-else-if="getScore(index) > 0" @click="showAnswers(index)" >
                      <button  class="buttonDiv bg-info px-3">
                      <b-icon-filter-left variant="cream" font-scale="1.5"></b-icon-filter-left>
                    </button> {{getScore(index)}}%
                    </div>
                    <div v-else-if="getScore(index) === 0" >
                      <button  class="buttonDiv bg-grey px-3" disabled>
                      <b-icon-filter-left variant="cream" font-scale="1.5"></b-icon-filter-left>
                    </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="showAns" :key="index + '1'">
                  <td colspan="3">
                    <div class="bg-white mt-0 p-0">
                      <InstAns :answerData="answerData" mode="CE"></InstAns>
                    </div>
                  </td>
                </tr>
                <tr v-if="showVoc" :key="index + '2'">
                  <td colspan="3">
                    <div class="bg-white mt-0 p-0">
                      <InstTable :selected="['', true]" :list="entry.list" mode="student"></InstTable>
                    </div>
                  </td>
                </tr>
               </template>
              </tbody>
            </table>
    </div>

    <div v-if="showQuiz">
      <InstQuizEng  v-on:quizData="recordQuiz($event)"></InstQuizEng>
    </div>
  </div>

</template>

<script>
import InstQuizEng from './InstQuizEng'
import InstAns from './InstAns'
import InstTable from './InstTable'

export default {
  name: 'InstStud',
  components: {
    InstQuizEng,
    InstAns,
    InstTable
  },
  data () {
    return {
      showQuiz: false,
      waiting: false,
      studentTestDup: null,
      showAns: false,
      showVoc: false,
      answerData: []
    }
  },
  methods: {
    getStudent: function () {
      let profile = this.$store.state.userProfile
      this.$store.dispatch('instructorLogs', { group: profile.classroom, action: 'getStudent', student: profile.userID })
    },
    getScore: function (index) {
      console.log(index, this.studentTests[index])
      if (this.studentTests[index]) {
        let score = this.studentTests[index].score
        let list = this.$store.state.testRecords[index].list.length
        let grade = (score / list) * 100
        return Math.round(grade)
      } else {
        return 0
      }
    },
    startQuiz: function () {
      this.showQuiz = true
    },
    showAnswers: function (index) {
      this.answerData = this.studentTests[index]['answerData']
      this.showAns = !this.showAns
    },
    showVocab: function (index) {
      this.showAns = false
      this.showVoc = true
      this.answerData = this.studentTests[index]['answerData']
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
