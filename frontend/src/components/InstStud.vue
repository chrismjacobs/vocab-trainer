
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

    <div class="bg-white">

          <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Quiz</th>
                  <th scope="col">Words</th>
                  <th scope="col">Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in $store.getters.testRecords" :key="index">
                  <th scope="row">{{index}}</th>
                  <td>{{entry.list.length}}</td>
                  <td>
                    <button  v-if="$store.state.activeQuiz === index && getScore(index) === 0" class="buttonDiv bg-warning px-3">
                      <b-icon-forward @click="startQuiz(index)" variant="cream" font-scale="1.5"></b-icon-forward>
                    </button>
                    <button  v-else-if="$store.state.activeQuiz === index && getScore(index) > 0" class="buttonDiv bg-warning px-3">
                      <b-icon-filter-left @click="showAnswers(index)" variant="cream" font-scale="1.5"></b-icon-filter-left> {{getScore(index)}}
                    </button>
                    <button  v-else-if="getScore(index) > 0" class="buttonDiv bg-info px-3">
                      <b-icon-filter-left @click="showAnswers(index)" variant="cream" font-scale="1.5"></b-icon-filter-left> {{getScore(index)}}
                    </button>
                    <button  v-else-if="getScore(index) === 0" class="buttonDiv bg-grey px-3" disabled>
                      <b-icon-filter-left @click="showAnswers(index)" variant="cream" font-scale="1.5"></b-icon-filter-left>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
    </div>

    <div v-if="showAns" class="bg-white mt-0 p-0">
     <InstAns :answerData="answerData" mode="CE"></InstAns>
    </div>

    <div v-if="showQuiz">
      <InstQuizEng  v-on:quizData="recordQuiz($event)"></InstQuizEng>
    </div>
  </div>

</template>

<script>
import InstQuizEng from './InstQuizEng'
import InstAns from './InstAns'
export default {
  name: 'InstStud',
  components: {
    InstQuizEng,
    InstAns
  },
  data () {
    return {
      showQuiz: false,
      waiting: false,
      studentTestDup: null,
      showAns: false,
      answerData: []
    }
  },
  methods: {
    getStudent: function () {
      let profile = this.$store.state.userProfile
      this.$store.dispatch('instructorLogs', { group: profile.classroom, action: 'getStudent', student: profile.userID })
    },
    getScore: function (index) {
      if (this.studentTests[index]) {
        return this.studentTests[index].score
      } else {
        return 0
      }
    },
    startQuiz: function () {
      this.showQuiz = true
    },
    showAnswers: function (index) {
      this.showAns = true
      console.log('answerData', index, this.studentTests, this.studentTests[index]['answerData'])
      this.answerData = this.studentTests[index]['answerData']
    },
    recordQuiz: function (payload) {
      // this.studentTestDup = {...this.studentTests}

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
