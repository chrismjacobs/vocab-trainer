<template>
  <div class="Intpict">
    <b-table
      striped hover
      :items="getPictArray(itemLocal.setRecord.dictRecord)"
      :fields="pields"
      head-variant="dark"
      >
        <template v-slot:cell(link)="data">
          <h5> {{data.item.word}} </h5>
          <h5> {{data.item.chinese}} </h5>
        <b-img style="max-width:100px" thumbnail fluid :src="getImage(data.item.word, data.item.link, student, data.item.vocab)"></b-img>
        </template>
        <template v-slot:cell(def)="data">
          <span style="color:green"> {{data.value}} </span>

          <hr>
          <span :style="getUpdateStyle(data.item.word, data.item.status)"> {{data.item.text}} </span>

        <div v-if="data.item.status !== null && data.item.status !== 0">
          <hr>
          <b-form-input
          v-model="data.item.note"
          placeholder="Add Note"
          >
          </b-form-input>
        </div>

        </template>
        <template v-slot:cell(status)="data">
            <b-form-radio-group
              id="btn-radios-2"
              v-model="data.item.status"
              :options="optionsR"
              buttons
              @change="radioAction(data.item)"
              :button-variant="getColor(data.item)"
              size="sm"
              name="radio-btn-outline"
            ></b-form-radio-group>
            <br>

            {{noteCodes[data.item.status]}}
            <br>
            <button class="buttonDiv mt-3 bg-smoke text-prime" style="width:40%"  @click="loadSentence(data.item.word)">Load</button>

        </template>
      </b-table>

  <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="success" hide-footer title="Image Adder">
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-warn text-cream" style="width:60%"  @click="hideModal('success')">Close</button>
    </b-modal>

  <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="delete" hide-footer title="Delete Picture">
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-grey text-cream" style="width:60%"  @click="hideModal('cancel')">Cancel</button>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('delete')">Delete</button>
    </b-modal>

  </div>
</template>

<script>

export default {
  name: 'IntPict',
  props: {
    itemMaster: Object,
    student: String
  },
  data () {
    return {
      msg: null,
      item: {},
      save: true,
      classRecords: {},
      notes: {},
      pields: [
        {key: 'link', label: 'Picture', sortable: true},
        {key: 'def', label: 'Info', sortable: true},
        {key: 'status', label: 'Record', sortable: true}
      ],
      optionsR: [
        // { value: null, text: 'none' },
        { value: null, text: '-' },
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
        { value: 4, text: '4' },
        { value: 5, text: '5' },
        { value: 6, text: '6' }
      ],
      color: {
        null: 'smoke',
        1: 'safe',
        2: 'alert',
        3: 'warn',
        4: 'p1',
        5: 'p2',
        6: 'grape-light'
      },
      noteCodes: {
        null: null,
        1: 'Good',
        2: 'Grammar',
        3: 'Punctuation',
        4: 'Detail',
        5: 'Spelling',
        6: 'Picture'
      },
      commonFeedback: {
        1: 'please add period (.)',
        2: 'please choose a better picture to match your sentence',
        3: 'please do not choose a picture that shows the word you are using'
      }
    }
  },
  methods: {
    showModal: function () {
      this.$refs['success'].show()
    },
    showDelete: function () {
      this.$refs['delete'].show()
    },
    hideModal: function (mode) {
    },
    getUpdateStyle: function (word, status) {
      let studentUpdates = this.$store.state.instructor.studentUpdates[this.student]
      // console.log(this.student, word, status, studentUpdates)
      if (status === 1) {
        return { }
      }
      if (studentUpdates && studentUpdates[word] && studentUpdates[word] === 1) {
        return { background: 'lime' }
      }
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
    saveData: function () {
      console.log('this.save', this.notes)
      if (this.save) {
        console.log('saveNoteData')
        this.$store.dispatch('updateNotes', { notes: this.notes })
      }
    },
    getPictArray: function (obj) {
      let pictList = []
      for (let entry in obj) {
        pictList.push(obj[entry])
      }
      console.log('pictList', pictList)
      return pictList
    },
    getColor: function (dItem) {
      // console.log(dItem)
      let stat = 0
      if (dItem['word']) {
        let word = dItem['word']
        stat = this.itemLocal.setRecord.dictRecord[word].status
      }
      return this.color[stat]
    },
    loadSentence: function (word) {
      let note = this.itemLocal.setRecord.dictRecord[word].note
      let text = this.itemLocal.setRecord.dictRecord[word].text
      let count = 0
      console.log()
      for (let fb in this.commonFeedback) {
        if (note === this.commonFeedback[fb]) {
          count = fb
        }
      }

      if (count === 0) {
        this.itemLocal.setRecord.dictRecord[word].note = this.commonFeedback[1]
      } else if (count === Object.keys(this.commonFeedback).length) {
        this.itemLocal.setRecord.dictRecord[word].note = text
      } else {
        let key = parseInt(count) + 1
        this.itemLocal.setRecord.dictRecord[word].note = this.commonFeedback[key]
      }

      let _this = this
      setTimeout(function () {
        console.log(_this.itemLocal)
        _this.itemLocal = {..._this.itemLocal}
      }, 100)
    },
    updateNotes: function () {
      if (!this.notes[this.student]) {
        this.notes[this.student] = {}
      }
    },
    radioAction: function (dItem) {
      this.updateNotes()
      console.log('dItem', dItem)
      console.log('notes', this.notes)
      let word = dItem['word']
      let _this = this
      setTimeout(function () {
        _this.itemLocal = {..._this.itemLocal}
        _this.notes[_this.student][word] = dItem
        _this.notes = {..._this.notes}
      }, 100)
    }
  },
  created () {
    this.classRecords = {...this.$store.getters.classRecords}
    this.notes = {...this.$store.state.instructor.studentNotes}
    this.itemLocal = {...this.itemMaster}
    console.log('NOTES', this.notes)
    console.log('ITEM', this.itemLocal)
    for (let word in this.notes[this.student]) {
      if (this.itemLocal['setRecord']['dictRecord'][word]) {
        this.itemLocal['setRecord']['dictRecord'][word]['status'] = this.notes[this.student][word]['status']
        this.itemLocal['setRecord']['dictRecord'][word]['note'] = this.notes[this.student][word]['note']
      }
    }
  },
  beforeDestroy () {
    this.saveData()
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
