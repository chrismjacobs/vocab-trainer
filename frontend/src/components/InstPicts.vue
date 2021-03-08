<template>
  <div class="Intpict">
    <b-table
      striped hover
      :items="getPictArray(item.setRecord.dictRecord)"
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
          {{data.item.text}}

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
    s3: String,
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
        { value: 5, text: '5' }
      ],
      color: {
        null: 'smoke',
        1: 'safe',
        2: 'alert',
        3: 'warn',
        4: 'p1',
        5: 'p2'
      },
      noteCodes: {
        null: null,
        1: 'Good',
        2: 'Grammar',
        3: 'Punctuation',
        4: 'Detail',
        5: 'Spelling'
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
      if (this.save) {
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
        stat = this.item.setRecord.dictRecord[word].status
      }
      return this.color[stat]
    },
    radioAction: function (dItem) {
      let word = dItem['word']
      let _this = this
      console.log('dItem', dItem)
      setTimeout(function () {
        _this.item = {..._this.item}
        _this.notes[_this.student][word] = dItem
      }, 100)
    }
  },
  created () {
    this.classRecords = {...this.$store.getters.classRecords}
    this.notes = {...this.$store.state.studentNotes}
    this.item = {...this.itemMaster}
    console.log('NOTES', this.notes)
    console.log(this.item)
    for (let word in this.notes[this.student]) {
      this.item['setRecord']['dictRecord'][word]['status'] = this.notes[this.student][word]['status']
      this.item['setRecord']['dictRecord'][word]['note'] = this.notes[this.student][word]['note']
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
