<template>
  <div class="dict">
    <audio id="audio"></audio>

    <!-- headers and toggle buttons -->
    <div class="mt-2 bg-prime p-2 head">
      <div align="center">
        <b-row >
          <b-col >
            <h3 class="text-cream" > Word List </h3>
          </b-col>
        </b-row>
      </div>
    </div>

    <!-- dictionary list -->

      <div class="bg-grey p-2">
        <b-row align="center" class='mb-2'>
          <b-col>
            <b-form-input
            align="center"
            style="font-size:30px;width:70%;text-align:center"
            autocapitalize="none"
            autocomplete="off"
            id="type"
            @focus="nullClick()"
            @change="selected[2]=null"
            v-model="selected[0]"
            ></b-form-input>
          </b-col>

        </b-row>
          <div class="helpTab1" v-if="$store.getters.getHelp"> {{$store.getters.getHelp['Dictionary']['input']}}  </div>

        <b-row >
          <b-col align="center">
            <button v-if="Object.keys(activeQuiz).length > 0" class="buttonDiv bg-second p-1" style="width:60px" @click="changeSelected('q')"> <b-icon-card-checklist :variant="getIcon('q')" font-scale="1.5"></b-icon-card-checklist><br><span class="text-cream" style="font-size:10pt">QUIZ</span></button>
            <button class="buttonDiv bg-second p-1" style="width:60px" @click="changeSelected('p'), getNotes()"> <b-icon-images :variant="getIcon('p')" font-scale="1.5"></b-icon-images><br><span class="text-cream" style="font-size:10pt">PICT</span></button>
            <button class="buttonDiv bg-second p-1" style="width:60px" @click="changeSelected('*')"> <b-icon-star-fill :variant="getIcon('*')" font-scale="1.5"></b-icon-star-fill><br><span class="text-cream" style="font-size:10pt">STAR</span></button>
                <div  v-if="$store.state.instructor.activeQuiz" class="d-lg-none">
                  <br>
                </div>
            <button v-if="$store.getters.checkQuiz" class="buttonDiv bg-second p-1" style="width:60px;t" @click="changeSelected('+')"> <b-icon-arrow-up-circle-fill :variant="getIcon('+')" font-scale="1.5"></b-icon-arrow-up-circle-fill><br><span class="text-cream" style="font-size:10pt">ADD</span></button>
            <button  :class="getSoundButton()" style="width:60px;t" @click="tapSound()"> <b-icon-soundwave :variant="getSoundwave()" font-scale="1.5"></b-icon-soundwave><br><span class="text-cream" style="font-size:10pt">TEST</span></button>
            <b-form-select class="bg-second text-cream" style="width:10%;overflow-y: hidden" @change="selected[2] = null" v-model="selected[1]" :options="optionsCheck" :select-size="1"></b-form-select>
          </b-col>
        </b-row>
          <div class="helpTab1" v-if="$store.getters.getHelp"> <span v-for="(t, key) in breaker($store.getters.getHelp['Dictionary']['dictTabs'])" :key="key"> {{t}} <br> </span> </div>
        <b-row class="mt-3" align="center">
          <b-col>
              <b-form-group>
                <b-form-radio-group
                  id="btn-radios-2"
                  v-model="selected[2]"
                  :options="optionsR"
                  style="width:100%;color:red"
                  buttons
                  @change="changeSelected('grade')"
                  :button-variant="color[selected[2]]"
                  size="lg"
                  name="radio-btn-outline"
                ></b-form-radio-group>
              </b-form-group>
          </b-col>
        </b-row>
          <div class="helpTab1" v-if="$store.getters.getHelp"> {{$store.getters.getHelp['Dictionary']['sortTabs']}}  </div>

      </div>

      <div align="center" v-if="selected[1] === 'p' && !showPictures">
        <button class="buttonDiv bg-success px-3" style="width:100%" @click="showPictures = !showPictures"><b-icon-images variant="cream" font-scale="1.5"></b-icon-images> <span class="text-cream">See all Images</span> </button>
      </div>
      <div align="center" v-if="showPictures">
        <button class="buttonDiv bg-warn px-3" style="width:100%" @click="showPictures = !showPictures"><b-icon-images variant="cream" font-scale="1.5"></b-icon-images> <span class="text-cream">Hide Images</span> </button>
      </div>

      <div align="center" v-if="selected[1] === '*'">
        <button class="buttonDiv bg-secondary px-3" style="width:100%" @click="showClear()"><b-icon-star-fill variant="warn" font-scale="1.5"></b-icon-star-fill > <span class="text-cream"> Clear all stars </span> </button>
      </div>

      <div align="center" v-if="selected[1] === 'q'">
        <button class="buttonDiv bg-secondary px-3" style="width:100%" @click="showAdd()"><b-icon-star-fill variant="grape-light" font-scale="1.5"></b-icon-star-fill > <span class="text-cream"> Add all quiz words </span> </button>
      </div>

      <transition name="board">
      <DictPict
      v-on:pictureFalse="picture = false"
      v-if="picture"
      :s3="s3"
      :vocabList="vocabList"
      :pictWord="pictWord"
      :pictCh="pictCh"
      :colors="getColors(pictWord)"
      :note="getNote(pictWord)"

      ></DictPict>
      </transition>

      <div class="mb-0" v-if="!showPictures">
      <b-table
      striped hover
      :items="tableItems"
      :fields="fields"
      :filter="selected"
      :filter-function="filterTable"
      show-empty
      fixed
      head-variant="dark"
      v-model="visibleRows"
      >
        <template v-slot:cell(english)="data">
          <b-row no-gutters>
            <b-col cols="3">
             <template v-if="data.item.Star">
                <b-icon-star-fill variant="warn" @click="addStar(data.value, 0)"></b-icon-star-fill> <span class="d-lg-none"> &nbsp; <br> </span>
             </template>
             <template v-else>
                <b-icon-star @click="addStar(data.value, 1)"></b-icon-star> &nbsp; <br class="d-lg-none">
             </template>
             <b-icon-card-image :class="getVariant(data.item.Picture, data.value, 'icon')" @click="filterPicture(data.value, data.item.Chinese, 'icon')"></b-icon-card-image>  &nbsp; <br class="d-lg-none">
            </b-col>
            <b-col :class="getVariant(data.item.Picture, data.value, 'col')" @click="filterPicture(data.value, data.item.Chinese, 'col')">
              <span v-if="soundCount !== 1" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/', data.item.mp3en, true)"> {{data.value}} <br> ({{data.item.Gr}}) </span>
              <span v-else align="center"> <b-icon-soundwave  font-scale="1.5" class="text-prime" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/', data.item.mp3en, false)"></b-icon-soundwave> </span>
            </b-col>
          </b-row>
         </template>
        <template v-slot:cell(chineseext)="data">
          <b-row>
            <b-col>
              <span v-if="soundCount !== 2" :id="data.item.English + '_ch/'" @click="playAudio(data.item.English, '_ch/', data.item.mp3ch, true)"> {{data.value}} </span>
              <span v-else align="center"> <b-icon-soundwave  font-scale="1.5" class="text-prime" :id="data.item.English + '_ch/'" @click="playAudio(data.item.English, '_ch/', data.item.mp3ch, false)"></b-icon-soundwave> </span>
              <b-icon-trash-fill v-if="data.item.Origin === 'new'" style="float:right" variant="info" @click="addWord(data.item.English, 0)"></b-icon-trash-fill> <br class="d-lg-none">
            </b-col>
          </b-row>
         </template>
      </b-table>
      </div>
      <div v-else>
      <b-table
      striped hover
      :items="pictList"
      :fields="pields"
      :filter="selected"
      :filter-function="filterPics"
      head-variant="dark"
      >
        <template v-slot:cell(link)="data">
          <h5> {{data.item.word}} </h5>
          <h5> {{data.item.chinese}} </h5>
        <b-img style="max-width:100px" thumbnail fluid :src="getImage(data.item.word, data.item.link)" :alt="pictWord"></b-img>
         </template>
        <template v-slot:cell(def)="data">
          <span style="color:green"> {{data.value}} </span>
          <hr>
         {{data.item.text}}

         <div v-if="getNote(data.item.word)" @click="picture = !picture, filterPicture(data.item.word, data.item.chinese), showPictures = !showPictures">
           <hr>
             <span :class="getColors(data.item.word)"> &nbsp;  <b-icon-card-image></b-icon-card-image>  &nbsp; {{getNote(data.item.word)}} </span>
         </div>
         </template>
      </b-table>
      </div>

      <transition name="board">
        <div class="bg-third p-2" v-if="addWait === false
                                        && visibleRows.length < 5
                                        && selected[0] !== null
                                        && selected[0].length > 1
                                        && !visibleRows.find(element => element.English === selected[0])
                                        && selected[1] === null
                                        && $store.getters.checkQuiz">
        <b-form @submit="onAdd">
                  <b-input-group class="my-2 p-6">
                      <b-input-group-prepend inline is-text>
                        <b-icon icon="hash"></b-icon>
                      </b-input-group-prepend>
                      <b-form-input v-model="selected[0]" disabled>
                      </b-form-input>
                  </b-input-group>

                  <b-input-group class="my-2 p-6" label="Chinese" label-for="exampleInput2">
                      <b-input-group-prepend inline is-text>
                        <b-icon icon="filter-left"></b-icon>
                      </b-input-group-prepend>
                      <b-form-textarea
                      v-model="wordDetails.defch1"
                      placeholder="Add Chinese"
                      rows="2"
                      >
                      </b-form-textarea>
                  </b-input-group>

                  <b-row>
                    <b-col align="center">
                      <b-form-select class="bg-grey" style="width:100%;overflow-y: hidden" v-model="wordDetails.gl" :options="optionsG" :select-size="1"></b-form-select>
                      <button class="buttonDiv bg-info px-3 mt-2" type="submit"> <b-icon-arrow-up-circle-fill variant="cream" font-scale="1.5"></b-icon-arrow-up-circle-fill> <span class="text-cream" style="font-weight:bold">Add to Dictionary </span> </button>
                    </b-col>
                  </b-row>
        </b-form>
        </div>
          <div v-else-if="addWait" align="center" class="p-3 bg-third">
            <h4 class="text-prime"> Adding New Word </h4>
            <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
          </div>
      </transition>

      <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="alert" hide-footer title="Alert">
        <div class="d-block">
          <h3> {{note}} </h3>
        </div>
        <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideAlert('alert')">Close</button>
      </b-modal>

      <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="clear" hide-footer title="Alert">
        <div class="d-block">
          <h3> Are you sure you want to clear your star list? </h3>
        </div>
        <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideClear('clear')">Clear</button>
        <button class="buttonDiv mt-3 bg-secondary text-cream" style="width:60%"  @click="hideClear('cancel')">Cancel</button>
      </b-modal>

      <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="add" hide-footer title="Alert">
        <div class="d-block">
          <h3> Would you like to add all quiz words to your star list? </h3>
        </div>
        <button class="buttonDiv mt-3 bg-grape text-cream" style="width:60%"  @click="hideAdd('add')">Add</button>
        <button class="buttonDiv mt-3 bg-secondary text-cream" style="width:60%"  @click="hideAdd('cancel')">Cancel</button>
      </b-modal>

  </div>
</template>

<script>
import DictPict from './DictPict'

export default {
  name: 'Dictionary',
  props: {
    s3: String
  },
  components: {
    DictPict
  },
  data () {
    return {
      fields: [
        {key: 'English', label: 'Vocab', sortable: true},
        {key: 'ChineseExt', label: 'Chinese', sortable: true}
      ],
      pields: [
        {key: 'link', label: 'Picture', sortable: true},
        {key: 'def', label: 'Info', sortable: true}
      ],
      // tableItems: null,
      visibleRows: [],
      selected: [null, null, null],
      optionsA: [
        { value: null, text: '---' }
      ],
      gValue: '---',
      optionsG: [
        { value: null, text: '---' },
        { value: 'n.', text: 'nouns' },
        { value: 'v.', text: 'verbs' },
        { value: 'adj.', text: 'adjectives' },
        { value: 'adv.', text: 'adverbs' },
        { value: 'conj.', text: 'conjunctions' },
        { value: 'prep.', text: 'prepositions' },
        { value: 'phr.', text: 'phrases' }
      ],
      optionsP: [
        { value: null, text: '---' },
        { value: 'v.', text: 'verbs' },
        { value: 'adj.', text: 'adjectives' },
        { value: 'n.', text: 'nouns' },
        { value: 'phr.', text: 'phrases' },
        { value: 'abbr.', text: 'abbreviations' },
        { value: 'prop.', text: 'proper nouns' }
      ],
      optionsR: [
        // { value: null, text: 'none' },
        { value: -2, text: '--' },
        { value: -1, text: '-' },
        { value: 0, text: 'o' },
        { value: 1, text: '+' },
        { value: 2, text: '++' }
      ],
      color: {
        2: 'safe',
        1: 'third',
        0: 'smoke',
        '-1': 'warn',
        '-2': 'alert'
      },
      colors: {
        null: 'smoke',
        1: 'safe',
        2: 'alert',
        3: 'warn',
        4: 'second',
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
      wordDetails: {
        gl: null,
        defch1: null,
        defch2: '',
        added: false // check if audio is already available
      },
      vocabList: null,
      picture: false,
      pictWord: null,
      pictCh: null,
      note: null,
      audioMarker: [null, null],
      soundCount: 0,
      addWait: false,
      showPictures: false
    }
  },
  computed: {
    activeQuiz () {
      return this.$store.state.instructor.activeQuiz
    },
    generalGet () {
      return this.$store.getters.generalGet
    },
    starGet () {
      console.log('stars', this.$store.getters.starGet)
      return this.$store.getters.starGet
    },
    tableItems () {
      // console.log('tableGet', this.$store.getters.makeList)
      return this.$store.getters.makeList
    },
    getList () {
      let tr = this.$store.state.instructor.testRecords
      let aq = this.$store.state.instructor.activeQuiz

      let totList = []

      for (let q in aq) {
        if (tr[q]) {
          for (let n in tr[q].list) {
            totList.push(tr[q].list[n])
          }
        }
      }
      return totList
    },
    optionsCheck () {
      if (this.$store.getters.checkQuiz) {
        return this.optionsG
      } else {
        return this.optionsP
      }
    },
    pictList () {
      let getPics = this.$store.getters.pictGet
      console.log(getPics)
      let pictList = []
      if (getPics.length > 1) {
        delete getPics.add
      }
      for (let obj in getPics) {
        pictList.push(this.$store.getters.pictGet[obj])
      }
      console.log('pictList', pictList)
      return pictList
    }
  },
  methods: {
    breaker: function (text) {
      var tList = text.split(';')
      return tList
    },
    showAlert: function () {
      this.$refs['alert'].show()
    },
    hideAlert: function (mode) {
      this.$refs['alert'].hide()
      this.note = null
    },
    showClear: function () {
      this.$refs['clear'].show()
    },
    showAdd: function () {
      this.$refs['add'].show()
    },
    hideClear: function (mode) {
      this.$refs['clear'].hide()
      if (mode === 'clear') {
        this.$store.dispatch('newStar', {word: null, set: 3})
      }
    },
    hideAdd: function (mode) {
      this.$refs['add'].hide()
      if (mode === 'add') {
        this.addAllStars()
      }
    },
    addAllStars: function () {
      for (let word in this.getList) {
        this.addStar(this.getList[word], 1)
      }
    },
    getIcon: function (icon) {
      let colors = {
        '*': 'warn',
        '+': 'info',
        'p': 'safe',
        'q': 'grape-light'
      }
      if (this.selected[1] === icon) {
        return colors[icon]
      } else {
        return 'cream'
      }
    },
    getSoundwave: function () {
      if (this.soundCount === 0) {
        return 'cream'
      } else if (this.soundCount === 1) {
        return 'info'
      } else {
        return 'alert'
      }
    },
    getSoundButton: function () {
      if (this.soundCount === 0) {
        return 'buttonDiv bg-second p-1'
      } else {
        return 'buttonDiv bg-cream p-1'
      }
    },
    getImage: function (word, code) {
      if (code === 'add') {
        return 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/add.jpg'
      } else {
        let profile = this.$store.state.userProfile
        let link = this.s3 + profile.userID + '/' + profile.vocab + '/' + word + code + '.jpg'
        console.log(link)
        return link
      }
    },
    getColors: function (word) {
      let color = this.colors[this.getStatus(word)]
      return 'bg-' + color + ' text-cream p-2'
    },
    getStatus: function (word) {
      let status = 0
      if (this.$store.state.instructor.studentNotes[word]) {
        status = this.$store.state.instructor.studentNotes[word]['status']
      }
      return status
    },
    getNote: function (word) {
      if (this.$store.state.instructor.studentNotes[word]) {
        let noteTag = this.noteCodes[this.$store.state.instructor.studentNotes[word]['status']]
        if (this.$store.state.instructor.studentNotes[word]['note']) {
          return noteTag + ': ' + this.$store.state.instructor.studentNotes[word]['note']
        } else {
          return noteTag
        }
      } else {
        return null
      }
    },
    getNotes: function () {
      this.$store.dispatch('instructorLogs', { student: this.$store.state.userProfile.userID, group: this.$store.state.userProfile.classroom, action: 'getNotesStudent' })
    },
    getVariant: function (arg, word, mode) {
      let v = null
      let form = 'bg-'
      if (mode === 'icon') {
        v = 'prime'
        form = 'text-'
      }
      if (this.getStatus(word)) {
        v = this.colors[this.getStatus(word)]
      }
      return form + v
    },
    tapSound: function () {
      if (this.soundCount === 2) {
        this.soundCount = 0
      } else {
        this.soundCount += 1
      }
    },
    filterPicture: function (word, chinese, mode) {
      console.log('filter', word, mode, this.getStatus(word))
      if (!this.getStatus(word) && mode === 'col') {
        return false
      } else if (this.getStatus(word) === 0 && mode === 'col') {
        return false
      }
      this.picture = !this.picture
      this.pictWord = word
      this.pictCh = chinese
      this.selected[2] = null
      this.selected[1] = word
      this.selected[0] = word

      this.selected = [...this.selected]
    },
    changeSelected: function (arg) {
      let extra = ['+', 'p']
      if (!this.$store.state.userProfile.classroom && extra.includes(arg)) {
        this.note = 'Please join a classroom to access extra features'
        this.showAlert()
        return false
      }
      this.selected[0] = ''
      this.picture = false
      this.showPictures = false

      if (arg === 'grade') {
        this.selected[1] = null
      } else {
        this.selected[1] = arg
      }

      this.selected = [...this.selected]
      console.log(this.selected)
    },
    nullClick: function (key, item) {
      console.log('NULL')
      this.selected = [null, null, null]
      this.selected = [...this.selected]
      this.picture = false
    },
    randomLet: function () {
      let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let alArr = alphabet.split('')

      this.shuffle(alArr)

      if (!this.checkEnglish()) {
        this.selected = [null, null, null]
      } else {
        this.selected = [alArr[0], null, null]
      }
    },
    checkEnglish: function () {
      // check if dictionary is english or not
      // in this case Japanese
      if ((this.vocabList).includes('apan')) {
        return false
      } else {
        console.log('vocabList True', this.vocabList)
        return true
      }
    },
    filterTwo: function (row, filter) {
      if (filter[0] === null && filter[1] === null && filter[2] == null) {
        return true
      } else if (filter[0] === '' && filter[1] === null && filter[2] == null) {
        return true
      } else if (filter[1] === '*') {
        if (row.Star) {
          return true
        }
      } else if (filter[1] === row.English) {
        return true
      } else if (filter[1] === 'p') {
        if (row.Picture) {
          return true
        }
      } else if (filter[1] != null) {
        if (row.Gr === filter[1]) {
          return true
        }
      } else if (filter[2] != null) {
        if (row.totalScore === filter[2] && row.tested) {
          return true
        }
      } else if (filter[0].trim() != null && filter[0].trim().length >= 1) {
        if ((row.English).includes(filter[0])) {
          return true
        }
      }
    },
    filterTable: function (row, filter) {
      if (!this.checkEnglish()) {
        return this.filterTwo(row, filter)
      }
      if (filter[0] === null) {
        return false
      }
      if (filter[1] === '*') {
        if (row.Star) {
          return true
        }
      } else if (filter[1] === '+') {
        if (row.Origin === 'new') {
          return true
        }
      } else if (filter[1] === row.English) {
        return true
      } else if (filter[1] === 'p') {
        if (row.Picture) {
          return true
        }
      } else if (filter[1] === 'q') {
        if (this.getList.includes(row.English)) {
          return true
        }
      } else if (filter[1] === 'abbr.' || filter[1] === 'prop.') {
        if (row.Gr === filter[1]) {
          return true
        }
      } else if (filter[2] != null) {
        if (row.totalScore === filter[2] && row.tested) {
          return true
        }
      } else if (filter[0].trim() === null || filter[0].trim() === '') {
        return false
      } else if (filter[0].trim() != null && filter[0].trim().length === 1) {
        if (row.English[0].trim().toLowerCase() === filter[0].trim().toLowerCase()) {
          if (filter[1] && row.Gr === filter[1]) {
            return true
          } else if (!filter[1]) {
            return true
          }
        }
      } else if (filter[0].trim() != null) {
        if ((row.English.toLowerCase()).includes(filter[0].trim().toLowerCase())) {
          if (filter[1] && row.Gr === filter[1]) {
            return true
          } else if (!filter[1]) {
            return true
          }
        }
      } else if (!this.checkEnglish) {
        return true
      } else {
        return false
      }
    },
    filterPics: function (row, filter) {
      if (filter[0] === null) {
        return true
      } else if (filter[0].trim() != null && filter[0].trim().length === 1) {
        if (row.word[0].trim().toLowerCase() === filter[0].trim().toLowerCase()) {
          return true
        }
      } else if (filter[0].trim() != null) {
        if ((row.word.toLowerCase()).includes(filter[0].trim().toLowerCase())) {
          return true
        }
      }
    },
    alphabet: function () {
      let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let letter in alphabet) {
        this.optionsA.push({ value: alphabet[letter], text: alphabet[letter] })
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
    },
    onAdd: function (evt) {
      evt.preventDefault()
      if (this.wordDetails.gl === null || this.wordDetails.defch1 === null) {
        this.note = 'Please make sure Grammar Label and Chinese are complete'
        this.showAlert()
      } else {
        this.addWord(null, 1)
      }
    },
    addStar: function (word, set) {
      this.$store.dispatch('newStar', {word: word, set: set})
    },
    addWord: function (English, set) {
      console.log(English, set, this.wordDetails, this.generalGet[English])
      var newWord = this.selected[0].trim()
      if (set === 0) {
        this.note = 'Your entry -' + English + '- has been removed from the dictionary'
        this.showAlert()
        this.$store.dispatch('newAdd', {word: English, details: this.wordDetails, set: set})
      } else {
        // set added status and call api for audio
        // '!this.generalGet[newWord]' - change back after gtts token issue fixed
        if (!this.generalGet[newWord]) {
          this.wordDetails.added = true
          this.addWait = true
          let _this = this
          this.$store.dispatch('newAudio', {word: newWord, chinese: this.wordDetails.defch1, set: set})
            .then(function (response) {
              console.log('AUDIO RESPONSE', response)
              if (response.defch2) {
                if (response.defch2 !== _this.wordDetails.defch1) {
                  _this.wordDetails.defch2 = response.defch2
                }
              } else {
                console.log('No chinese audio added')
              }
              _this.sendAdd(set, newWord)
              _this.addWait = false
            })
        } else {
          this.wordDetails.added = false
          this.sendAdd(set, newWord)
        }
      }
    },
    sendAdd: function (set, newWord) {
      this.$store.dispatch('newAdd', {word: newWord, details: {...this.wordDetails}, set: set})
      this.wordDetails.gl = null
      this.wordDetails.defch1 = null
      this.wordDetails.defch２ = ''
    },
    shuffle: function (array) {
      // Fisher-Yates shuffle
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
  },
  created () {
    // this.alphabet()
    this.vocabList = this.$store.state.userProfile.vocab
    this.randomLet()
    // this.tableItems = this.$store.getters.makeList
    // console.log(this.tableItems)
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push('login')
    }
  },
  beforeMount () {
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push('login')
    }
  },
  beforeDestroy () {
    // save work
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
