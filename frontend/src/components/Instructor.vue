
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
          <b-col align="right">
            <button class="buttonDiv bg-alert text-cream px-3" style="width:auto; height:auto" @click="saveRecords()">
                        SAVE
            </button>
          </b-col>
        </b-row>
      </div>
    </div>

    <div v-if="classRecords" class="bg-white mt-0 p-0">

      <table class="table table-striped">
              <thead>
                    <tr>
                      <th scope="col">Student</th>
                      <th scope="col">Logs</th>
                      <th scope="col">Favs</th>
                      <th scope="col">Pics</th>
                      <th scope="col">Adds</th>
                      <th scope="col">Stats</th>
                    </tr>
              </thead>
                    <tbody>
                      <template v-for="(item, key) in classRecords">
                        <tr :key="key">
                          <td  style="width:150px" >{{key}}# {{item.user}}</td>
                          <td>
                            <b-form-select style="width:50px;overflow-y: hidden">
                              <option v-for="(line, date) in getDates(item.logsRecord.logs)" :key="line[0]"> {{date}}: {{line}}  </option>
                            </b-form-select>
                          <td>
                            <div style="width:70px; display:inline-block">
                            <b-icon-star-fill variant="warning" font-scale="1.5"></b-icon-star-fill> {{getLength(item.setRecord.starRecord)}}
                            </div>
                            <div style="display:inline-block">
                             <b-form-select style="width:100px;overflow-y: hidden">
                                <option v-for="(x, key) in item.setRecord.starRecord" :key="key"> {{key}} </option>
                              </b-form-select>
                            </div>
                          </td>
                          <td>
                            <div style="width:70px; display:inline-block">
                            <b-icon-images @click="showPicts(key)" variant="safe" font-scale="1.5" ></b-icon-images> {{getLength(item.setRecord.dictRecord)}}
                            </div>
                            <div style="display:inline-block">
                               <b-form-select style="width:100px;overflow-y: hidden; display:inline">
                                <option v-for="(x, key) in item.setRecord.dictRecord" :key="key"> {{key}} </option>
                              </b-form-select>
                            </div>
                          </td>
                          <td>
                            <div style="width:70px; display:inline-block">
                              <b-icon-arrow-up-circle-fill variant="info" font-scale="1.5"></b-icon-arrow-up-circle-fill> {{getLength(item.setRecord.addRecord)}}
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
                        <transition name="tableboard" :key="key">
                            <tr v-if="key.toString() in scoreShow && scoreShow[key.toString()] === 1">
                              <td colspan="6">
                                <b-row v-for="(test, keyy) in userRecItems(item.userRecord)" :key="keyy">
                                  <b-col cols="2" align="right">
                                    {{counterKeys[keyy]}}
                                  </b-col>
                                  <b-col>
                                      <div v-if="valueSum(test) > 0">
                                        <b-progress style="height:20px" show-value>
                                                <b-progress-bar :value="test.problem" :variant="getVariant('problem')"></b-progress-bar>
                                                <b-progress-bar :value="test.weak" :variant="getVariant('weak')"></b-progress-bar>
                                                <b-progress-bar :value="test.okay" :variant="getVariant('okay')"></b-progress-bar>
                                                <b-progress-bar :value="test.good" :variant="getVariant('good')"></b-progress-bar>
                                                <b-progress-bar :value="test.strong" :variant="getVariant('strong')"></b-progress-bar>
                                        </b-progress>
                                      </div>
                                  </b-col>
                                </b-row>
                              </td>
                            </tr>
                        </transition>

                        <transition name="tableboard" :key="key">
                          <tr v-if="key.toString() in pictShow && pictShow[key.toString()] === 1">
                            <td colspan="6">
                            <b-table
                              striped hover
                              :items="getPictArray(item.setRecord.dictRecord)"
                              :fields="pields"
                              head-variant="dark"
                              >
                                <template v-slot:cell(link)="data">
                                  <h5> {{data.item.word}} </h5>
                                  <h5> {{data.item.chinese}} </h5>
                                <b-img style="max-width:100px" thumbnail fluid :src="getImage(data.item.word, data.item.link, key, data.item.vocab)"></b-img>
                                </template>
                                <template v-slot:cell(def)="data">
                                  <span style="color:green"> {{data.value}} </span>
                                  <hr>
                                {{data.item.text}}

                                <hr>
                                <b-form-input
                                v-model="data.item.note"
                                placeholder="Add Note"
                                >
                                </b-form-input>

                                </template>
                                <template v-slot:cell(status)="data">
                                   <b-form-select
                                   style="width:100px;overflow-y: hidden"
                                   v-model="data.item.status"
                                   >
                                      <option v-for="(x, key) in [0,1,2,3]" :key="key"> {{x}} </option>
                                    </b-form-select>
                                </template>
                              </b-table>
                            </td>
                          </tr>
                        </transition>
                      </template>

                    </tbody>
      </table>

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
export default {
  data () {
    return {
      master: this.classRecords,
      counterKeys: {
        transEng: 'English Test',
        transCh: 'Chinese Test',
        typeTest: 'Type Test',
        matchTrans: 'Match',
        matchType: 'Type Match'
      },
      scoreShow: {},
      pictShow: {},
      waiting: false,
      instrucorLogs: {},
      pields: [
        {key: 'link', label: 'Picture', sortable: true},
        {key: 'def', label: 'Info', sortable: true},
        {key: 'status', label: 'Record', sortable: true}
      ]
    }
  },
  methods: {
    saveRecords: function () {
      alert('saving data')

      let notes = {}
      for (let student in this.classRecords) {
        notes[student] = this.classRecords[student]['setRecord']['dictRecord']
      }
      this.$store.dispatch('instructorLogs', { notes: notes, group: this.$store.state.classLoad, action: 'setNotes' })
    },
    getClass: function (group) {
      this.waiting = true
      this.$store.dispatch('instructorLogs', { group: group, action: 'getNotesInstructor' })
      this.$store.dispatch('classRecords', { userID: this.$store.state.userProfile.userID, classroom: group })
    },
    getPictArray: function (obj) {
      let pictList = []
      for (let entry in obj) {
        pictList.push(obj[entry])
      }
      console.log('pictList', pictList)
      return pictList
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
      if (!this.scoreShow[user] || this.scoreShow[user] === 0) {
        this.scoreShow[user] = 1
      } else {
        this.scoreShow[user] = 0
      }
      this.scoreShow = {...this.scoreShow}
      console.log(user, this.scoreShow)
    },
    showPicts: function (user) {
      if (!this.pictShow[user] || this.pictShow[user] === 0) {
        this.pictShow[user] = 1
      } else {
        this.pictShow[user] = 0
      }
      this.pictShow = {...this.pictShow}
      console.log(user, this.pictShow)
    },
    valueSum: function (test) {
      let sum = 0
      for (let c in test) {
        sum += test[c]
      }
      return sum
    },
    getLength: function (obj) {
      delete obj['add']
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
    getImage: function (word, code, userID, vocab) {
      if (code === 'add') {
        return 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/add.jpg'
      } else {
        let link = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/' + userID + '/' + vocab + '/' + word + code + '.jpg'
        console.log(link)
        return link
      }
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
      // let score = 0

      for (let item in userRecord) {
        for (let word in userRecord[item]) {
          counter[word] = 1
          // let vocabScore = userRecord[item][word]
          // score += vocabScore
        }
      }

      let vCount = Object.keys(counter).length

      return vCount
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
    }
  },
  watch: {
    classRecords: function () {
      if (this.classRecords !== null) {
        for (let student in this.classRecords) {
          for (let vocab in this.classRecords[student]['setRecord']['dictRecord']) {
            this.classRecords[student]['setRecord']['dictRecord'][vocab]['note'] = null
            this.classRecords[student]['setRecord']['dictRecord'][vocab]['status'] = null
          }
        }
      }
      console.log('classRecords Redux', this.classRecords)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.tableboard-enter-active, .tableboard-leave-active  {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease;
}

.tableboard-enter-active {
  transition-delay: 0.2s;
}

.tableboard-enter {
  opacity: 0;
}

.tableboard-enter-to {
  opacity: 1;
}

.tableboard-leave {
  opacity: 1;
  transform: translateY(0px);
}

.tableboard-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

</style>
