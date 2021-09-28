
<template>
  <div id="instSent">

    <div class="bg-white mt-0 p-0">

      <div class="bg-grey p-2">
        <b-row>
          <b-col align="right">

            <button class="buttonDiv bg-safe-light text-prime px-3" style="width:auto; height:auto" @click="showPictsOne('all')">
                    Show All
            </button>

            <button class="buttonDiv bg-safe-light text-prime px-3" style="width:auto; height:auto" @click="show = 'students'">
                    Show Students
            </button>

            <button class="buttonDiv bg-safe-light text-prime px-3" style="width:auto; height:auto" @click="show = 'quiz'">
                    Show Quiz List
            </button>

            <button class="buttonDiv bg-safe text-cream px-3" style="width:auto; height:auto" @click="saveRecords()">
                    Save
            </button>
          </b-col>
        </b-row>
      </div>

      <table class="table table-striped" v-if="show === 'students'">
              <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Student</th>
                      <th scope="col">Pics</th>
                    </tr>
              </thead>
                    <tbody>
                      <template v-for="(item, key) in classRecords">
                        <tr :key="key">
                          <td  style="width:150px" >{{item.studentID}}</td>
                          <td  style="width:150px" >{{item.user}}</td>
                          <td>
                            <div style="width:70px; display:inline-block">
                            <b-icon-images variant="safe" font-scale="1.5" ></b-icon-images> {{getLength(item.setRecord.dictRecord)}}
                            </div>
                            <div style="display:inline-block">
                               <b-form-select style="width:100px;overflow-y: hidden; display:inline">
                                <option v-for="(x, key) in item.setRecord.dictRecord" :key="key"> {{key}} </option>
                              </b-form-select>
                            </div>
                          </td>
                          <td align="left">
                            <button class="buttonDiv bg-safe text-cream px-3" style="width:auto; height:auto" @click="showPictsOne(key)">
                                  OPEN
                            </button>
                          </td>

                        </tr>

                        <transition name="tableboard" :key="key">
                          <!--<tr v-if="key.toString() in pictShow && pictShow[key.toString()] === 1">-->
                          <tr v-if="key.toString() === pictShowOne || pictShowOne === 'all' ">
                            <td colspan="6">
                              <InstPicts :student="key" :itemMaster="item" ></InstPicts>
                            </td>
                          </tr>
                        </transition>
                      </template>

                    </tbody>
      </table>

      <b-table
      v-if="show === 'quiz'"
      striped hover
      :items="quizList"
      :fields="listFields"
      head-variant="dark"
      sticky-header
      >
        <template v-slot:cell(word)="data">
          <h5> {{data.item.word}} </h5>
        </template>
        <template v-slot:cell(link)="data">
        <b-img @click="setPicture(data.item.word, data.item.link, data.item.userID, data.item.vocab)" style="max-width:30px" fluid :src="getImage(data.item.word, data.item.link, data.item.userID, data.item.vocab)"></b-img>
        </template>
        <template v-slot:cell(def)="data">
          {{data.item.def}}
        </template>
        <template v-slot:cell(text)="data">
          {{data.item.text}}
        </template>
        <template v-slot:cell(userID)="data">
          <b-button @click="removeFromList(data.item.word, data.item.userID)">
            <b-icon icon="cross" aria-hidden="true"></b-icon>
          </b-button>
        </template>
      </b-table>

      <b-table
      v-if="show === 'quiz'"
      striped hover
      :items="getQuizArray"
      :fields="quizFields"
      head-variant="dark"
      >
        <template v-slot:cell(word)="data">
          <h5> {{data.item.word}} </h5>
          <h6> {{data.item.chinese}} </h6>
        </template>
        <template v-slot:cell(link)="data">
        <b-img style="max-width:100px" thumbnail fluid :src="getImage(data.item.word, data.item.link, data.item.userID, data.item.vocab)"></b-img>
        </template>
        <template v-slot:cell(def)="data">
          {{data.item.def}}
        </template>
        <template v-slot:cell(text)="data">
          {{data.item.text}}
        </template>
        <template v-slot:cell(code)="data">
          <b-button :variant="getVariant(data.item.word, data.item.userID)[0]" class="mb-2" @click="editQuizList(data.item.word, data.item.def, data.item.text, data.item.link, data.item.userID, data.item.vocab)">
            <b-icon icon="power" aria-hidden="true"></b-icon>
          </b-button>
          {{getVariant(data.item.word, data.item.userID)[1]}}
        </template>

      </b-table>

    </div>

    <b-modal hide-header-close align="center" ref="pic" hide-footer title="Image">
      <div class="d-block">
         <b-img style="max-width:200px" thumbnail fluid :src="getImage(picture.word, picture.link, picture.userID, picture.vocab)"></b-img>
      </div>
      <button class="buttonDiv mt-3 bg-warn text-cream" style="width:60%"  @click="hideModal()">Close</button>
    </b-modal>

  </div>

</template>

<script>
import InstPicts from './InstPicts'

export default {
  name: 'InstSent',
  props: {
    s3: String,
    group: String
  },
  components: {
    InstPicts
  },
  data () {
    return {
      show: 'quiz',
      notes: {},
      scoreShow: {},
      pictShow: {},
      pictShowOne: null,
      quizList: [],
      quizFields: [
        {key: 'user', label: 'User', sortable: true},
        {key: 'studentID', label: 'ID', sortable: true},
        {key: 'word', label: 'Word', sortable: true},
        {key: 'link', label: 'Picture'},
        {key: 'def', label: 'Def'},
        {key: 'text', label: 'Sentence'},
        {key: 'status', label: 'Status', sortable: true},
        {key: 'code', label: 'code', sortable: true}
      ],
      listFields: [
        {key: 'word', label: 'Word', sortable: true},
        {key: 'link', label: 'Picture'},
        {key: 'def', label: 'Def'},
        {key: 'text', label: 'Sentence'},
        {key: 'userID', label: 'Action'}
      ],
      picture: {}
    }
  },
  methods: {
    showPicts: function (user) {
      if (!this.pictShow[user] || this.pictShow[user] === 0) {
        this.pictShow[user] = 1
      } else {
        this.pictShow[user] = 0
      }
      this.pictShow = {...this.pictShow}
      console.log(user, this.pictShow)
    },
    showPictsOne: function (user) {
      if (this.pictShowOne === user) {
        this.pictShowOne = null
      } else {
        this.pictShowOne = user
      }
    },
    getLength: function (obj) {
      delete obj['add']
      return Object.keys(obj).length
    },
    saveRecords: function () {
      if (this.$store.state.instructor.studentNotes !== {} && this.show === 'students') {
        console.log('saveRecords')
        this.$store.dispatch('instructorLogs', { group: this.$store.state.instructor.classLoad, action: 'setNotes', notes: this.$store.state.instructor.studentNotes })
      } else if (this.show === 'quiz') {
        this.$store.dispatch('instructorLogs', { group: this.$store.state.instructor.classLoad, action: 'setPictQuiz', notes: this.quizList })
      }
    },
    setPicture: function (word, link, userID, vocab) {
      this.picture = {
        word: word,
        link: link,
        userID: userID,
        vocab: vocab
      }
      this.showModal()
    },
    showModal: function () {
      this.$refs['pic'].show()
    },
    hideModal: function () {
      this.$refs['pic'].hide()
    },
    getImage: function (word, code, student, vocab) {
      if (code === 'add') {
        return 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/add.jpg'
      } else {
        let link = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/profiles/' + student + '/' + vocab + '/' + word + code + '.jpg'
        // console.log(link)
        return link
      }
    },
    getVariant: function (word, userID) {
      let quizCheck = this.quizList.find(element => element.word === word && element.userID === userID)

      if (quizCheck) {
        if (quizCheck.def && quizCheck.text) {
          return ['safe', null]
        } else if (quizCheck.def) {
          return ['warn', 'Def Only']
        } else if (quizCheck.text) {
          return ['warn', 'Text Only']
        } else {
          return ['info', 'Picture Only']
        }
      } else {
        return ['outline-alert', null]
      }
    },
    editQuizList: function (word, def, text, link, userID, vocab) {
      let quizEntry = {word: word, def: def, text: text, link: link, userID: userID, vocab: vocab}
      let quizCheck = this.quizList.find(element => element.word === word && element.userID === userID)
      if (quizCheck) {
        if (quizCheck.def) {
          quizCheck.def = null
        } else if (quizCheck.text) {
          quizCheck.def = def
          quizCheck.text = null
        } else {
          let index = this.quizList.indexOf(quizCheck)
          if (index > -1) {
            this.quizList.splice(index, 1)
          }
        }
      } else {
        this.quizList.push(quizEntry)
      }
      console.log(JSON.stringify(this.quizList))
    },
    removeFromList: function (word, userID) {
      let quizCheck = this.quizList.find(element => element.word === word && element.userID === userID)
      if (quizCheck) {
        let index = this.quizList.indexOf(quizCheck)
        if (index > -1) {
          this.quizList.splice(index, 1)
        }
      }
      console.log(JSON.stringify(this.quizList))
    }
  },
  computed: {
    classRecords () {
      return this.$store.getters.classRecords
    },
    classGroups () {
      return this.$store.getters.classGroups
    },
    getQuizArray () {
      let quizArray = []
      for (let s in this.classRecords) {
        for (let v in this.classRecords[s].setRecord.dictRecord) {
          let newVocab = {...this.classRecords[s].setRecord.dictRecord[v]}
          newVocab['user'] = this.classRecords[s]['user']
          newVocab['userID'] = s
          newVocab['studentID'] = this.classRecords[s]['studentID']
          if (this.notes[s] && this.notes[s][v]) {
            newVocab['status'] = this.notes[s][v]['status']
          }
          quizArray.push(newVocab)
        }
      }
      console.log('quizArray', quizArray)
      return quizArray
    }
  },
  created () {
    this.$store.dispatch('instructorLogs', { group: this.group, action: 'getNotesInstructor' })
    this.$store.dispatch('instructorLogs', { group: this.group, action: 'getUpdatesInstructor' })
    this.notes = {...this.$store.state.instructor.studentNotes}
  },
  beforeDestroy () {
    // this.saveRecords()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
