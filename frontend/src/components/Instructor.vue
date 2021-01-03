
<template>
  <div>
    <b-container>
      <div class="bg-grey p-3">
          <b-row>
            <b-col align="center">
              <button class="buttonDiv bg-alert px-3" style="width:45%; height:50px" @click="getClass()"> <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise></button>
            </b-col>
          </b-row>
      </div>

      <table class="table">
                    <tbody>
                      <div v-for="(item, key) in classRecords" :key="key">
                        <tr>
                          <td  style="width:150px" >{{key}}# {{item.user}}</td>
                          <td></td>
                          <td>
                            <b-form-select style="width:50px;overflow-y: hidden">
                              <option v-for="(line, date) in getDates(item.logsRecord.logs)" :key="line[0]"> {{date}}: {{line}}  </option>
                            </b-form-select>
                          <td>
                            <div style="display:inline-block">
                            <b-icon-star-fill variant="warning" font-scale="1.5"></b-icon-star-fill> ({{getLength(item.setRecord.starRecord)}})
                            </div>
                            <div style="display:inline-block">
                             <b-form-select style="width:100px;overflow-y: hidden">
                                <option v-for="(x, key) in item.setRecord.starRecord" :key="key"> {{key}} </option>
                              </b-form-select>
                            </div>
                          </td>
                          <td>
                            <div style="display:inline-block">
                            <b-icon-images variant="safe" font-scale="1.5" ></b-icon-images> ({{getLength(item.setRecord.dictRecord)}})
                            </div>
                            <div style="display:inline-block">
                               <b-form-select style="width:100px;overflow-y: hidden; display:inline">
                                <option v-for="(x, key) in item.setRecord.dictRecord" :key="key"> {{key}} </option>
                              </b-form-select>
                            </div>
                          </td>
                          <td>
                            <div style="display:inline-block">
                              <b-icon-arrow-up-circle-fill variant="info" font-scale="1.5"></b-icon-arrow-up-circle-fill> ({{getLength(item.setRecord.addRecord)}})
                            </div>
                            <div style="display:inline-block">
                             <b-form-select style="width:100px;overflow-y: hidden">
                                <option v-for="(x, key) in item.setRecord.addRecord" :key="key"> {{key}} </option>
                              </b-form-select>
                            </div>
                          </td>
                          <td>
                            <b-icon @click="showScores(key)" icon="bar-chart-fill" variant="alert" font-scale="1.5"></b-icon> {{vocabCount(item.userRecord, item.user)}}
                          </td>
                        </tr>
                        <div v-if="key.toString() in scores && scores[key.toString()] === 1">
                          <div v-for="(test, key) in userRecItems(item.userRecord)" :key="key">
                            <div v-if="valueSum(test) > 0">
                             {{key}}
                              <b-progress style="height:20px" show-value>
                                      <b-progress-bar :value="test.problem" :variant="getVariant('problem')"></b-progress-bar>
                                      <b-progress-bar :value="test.weak" :variant="getVariant('weak')"></b-progress-bar>
                                      <b-progress-bar :value="test.okay" :variant="getVariant('okay')"></b-progress-bar>
                                      <b-progress-bar :value="test.good" :variant="getVariant('good')"></b-progress-bar>
                                      <b-progress-bar :value="test.strong" :variant="getVariant('strong')"></b-progress-bar>
                              </b-progress>
                            </div>
                          </div>
                        </div>
                      </div>

                    </tbody>
                  </table>

    </b-container>
  </div>

</template>

<script>
export default {
  data () {
    return {
      master: this.classRecords,
      scores: {}
    }
  },
  methods: {
    getClass: function () {
      this.$store.dispatch('classRecords', { userID: this.$store.state.userProfile.userID, classroom: this.$store.state.userProfile.classroom })
    },
    getVariant: function (arg) {
      let styles = {
        strong: 'spanDiv bg-safe-light text-prime',
        good: 'spanDiv bg-third text-prime',
        okay: 'spanDiv bg-grey text-prime',
        weak: 'spanDiv bg-warn-light text-prime',
        problem: 'spanDiv bg-alert-light text-prime',
        'not tested': 'spanDiv bg-cream text-prime'
      }
      return styles[arg]
    },
    showScores: function (user) {
      if (!this.scores[user] || this.scores[user] === 0) {
        this.scores[user] = 1
      } else {
        this.scores[user] = 0
      }
      this.scores = {...this.scores}
      console.log(user, this.scores)
    },
    valueSum: function (test) {
      let sum = 0
      for (let c in test) {
        sum += test[c]
      }
      return sum
    },
    getLength: function (obj) {
      return Object.keys(obj).length
    },
    getDates: function (logs) {
      let dates = {}
      for (let d in logs) {
        let month = d.substring(4, 7)

        // console.log(month)
        if (!dates[month] && month !== 'ce') {
          dates[month] = 1
        } else if (month !== 'ce') {
          dates[month] += 1
        }
      }
      return dates
    },
    userRecItems: function (userRecord) {
      let counter = {
        transEng: { strong: 0, good: 0, okay: 0, weak: 0, problem: 0 },
        transCh: { strong: 0, good: 0, okay: 0, weak: 0, problem: 0 },
        typeTest: { strong: 0, good: 0, okay: 0, weak: 0, problem: 0 },
        matchTrans: { strong: 0, good: 0, okay: 0, weak: 0, problem: 0 },
        matchType: { strong: 0, good: 0, okay: 0, weak: 0, problem: 0 }
      }
      for (let item in userRecord) {
        for (let word in userRecord[item]) {
          let vocabScore = userRecord[item][word]
          if (vocabScore >= 2) {
            counter[item].strong += 1
          } else if (vocabScore === 1) {
            counter[item].good += 1
          } else if (vocabScore === 0) {
            counter[item].okay += 1
          } else if (vocabScore === -1) {
            counter[item].weak += 1
          } else if (vocabScore <= -2) {
            counter[item].problem += 1
          }
        }
      }
      return counter
    },
    vocabCount: function (userRecord, user) {
      let counter = {}
      let score = 0

      for (let item in userRecord) {
        console.log(userRecord[item])
        for (let word in userRecord[item]) {
          counter[word] = 1
          let vocabScore = userRecord[item][word]
          score += vocabScore
        }
      }
      // console.log(user, counter)
      // console.log(userRecord)

      let vCount = Object.keys(counter).length

      return [vCount, score]
    }
  },
  created () {
  },
  computed: {
    classRecords () {
      console.log('computed')
      return this.$store.getters.classRecords
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
