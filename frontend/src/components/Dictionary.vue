<template>
  <div class="dict">
    <audio id="audio"></audio>

    <!-- headers and toggle buttons -->
    <div class="mt-2 bg-second p-2 head">
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
        <b-row >
          <b-col align="center">
            <button class="buttonDiv bg-second px-3" style="width:60px;" @click="changeSelected('p')"> <b-icon-images :variant="getIcon('p')" font-scale="1.5"></b-icon-images></button>
            <button class="buttonDiv bg-second px-3" style="width:60px;" @click="changeSelected('*')"> <b-icon-star-fill :variant="getIcon('*')" font-scale="1.5"></b-icon-star-fill></button>
            <button v-if="vocabList[0] === 'g'" class="buttonDiv bg-second px-3" style="width:60px;t" @click="changeSelected('+')"> <b-icon-arrow-up-circle-fill :variant="getIcon('+')" font-scale="1.5"></b-icon-arrow-up-circle-fill></button>
            <b-form-select class="bg-second text-cream" style="width:30%;overflow-y: hidden" @change="selected[2] = null" v-model="selected[1]" :options="optionsCheck" :select-size="1"></b-form-select>
          </b-col>

        </b-row>
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
      </div>

      <div align="center" v-if="selected[1] === 'p'">
        <button class="buttonDiv bg-success px-3" style="width:100%"><b-icon-images variant="cream" font-scale="1.5"></b-icon-images> <span class="text-cream">See all Images</span> </button>
      </div>

      <div class="mb-0">
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
             <b-icon-card-image :variant="getVariant(data.item.Picture)" @click="picture = !picture, filterPicture(data.value, data.item.Chinese)"></b-icon-card-image>  &nbsp; <br class="d-lg-none">
            </b-col>
            <b-col>
              {{data.value}} <br> ({{data.item.Gr}})
               <b-icon-soundwave class="text-prime" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/', data.item.mp3en)"></b-icon-soundwave>
            </b-col>
          </b-row>
         </template>
        <template v-slot:cell(chineseext)="data">
          <b-row>
            <b-col>
              {{data.value}}
            </b-col>
            <b-col align="right">
             <b-icon-trash-fill v-if="data.item.Origin === 'new'" variant="alert" @click="addWord(data.item.English, 0)"></b-icon-trash-fill> <br class="d-lg-none">
            </b-col>
          </b-row>
         </template>
      </b-table>
      </div>

      <div class="bg-alert-light p-2" v-if="visibleRows.length === 0 && selected[0] !== null && selected[0].length > 1 && selected[1] === null && vocabList[0] === 'g'">
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
                  <b-col>
                    <b-form-select class="bg-grey" style="width:100%;overflow-y: hidden" v-model="wordDetails.gl" :options="optionsG" :select-size="1"></b-form-select>
                    <button class="buttonDiv bg-alert px-3 mt-2" type="submit"> <b-icon-arrow-up-circle-fill variant="cream" font-scale="1.5"></b-icon-arrow-up-circle-fill> <span class="text-cream" style="font-weight:bold">Add to Dictionary </span> </button>
                  </b-col>
                </b-row>
       </b-form>
      </div>

      <DictPict v-on:pictureFalse="picture = false" v-if="picture" :s3="s3" :vocabList="vocabList" :pictWord="pictWord" :pictCh="pictCh"></DictPict>

      <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="alert" hide-footer title="Alert">
        <div class="d-block">
          <h3> {{note}} </h3>
        </div>
        <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideAlert('alert')">Close</button>
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
      // tableItems: null,
      visibleRows: [],
      selected: [null, null, null],
      optionsA: [
        { value: null, text: '---' }
      ],
      gValue: '---',
      optionsG: [
        { value: null, text: '---' },
        { value: 'v.', text: 'verbs' },
        { value: 'adj.', text: 'adjectives' },
        { value: 'n.', text: 'nouns' },
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
      audioMarker: [null, null]
    }
  },
  computed: {
    generalGet () {
      return this.$store.getters.generalGet
    },
    tableItems () {
      // console.log('tableGet', this.$store.getters.makeList)
      return this.$store.getters.makeList
    },
    optionsCheck () {
      if (this.vocabList[0] === 'g') {
        return this.optionsG
      } else {
        return this.optionsP
      }
    }
  },
  methods: {
    showAlert: function () {
      this.$refs['alert'].show()
    },
    hideAlert: function (mode) {
      this.$refs['alert'].hide()
      this.note = null
    },
    getIcon: function (icon) {
      let colors = {
        '*': 'warn',
        '+': 'alert',
        'p': 'safe'
      }
      if (this.selected[1] === icon) {
        return colors[icon]
      } else {
        return 'cream'
      }
    },
    filterPicture: function (word, chinese) {
      this.pictWord = word
      this.pictCh = chinese
      this.selected[2] = null
      this.selected[1] = word
      this.selected[0] = word

      this.selected = [...this.selected]
    },
    changeSelected: function (arg) {
      this.picture = false
      if (arg === 'grade') {
        this.selected[0] = ''
        this.selected[1] = null
        this.selected = [...this.selected]
      } else {
        this.selected[1] = arg
        this.selected = [...this.selected]
      }
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
      console.log(alArr)
      this.selected = [alArr[0], null, null]
    },
    filterTable: function (row, filter) {
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
      } else {
        return false
      }
    },
    alphabet: function () {
      let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let letter in alphabet) {
        this.optionsA.push({ value: alphabet[letter], text: alphabet[letter] })
      }
    },
    getVariant: function (arg) {
      let v = 'prime'
      if (arg) {
        v = 'success'
      }
      return v
    },
    playAudio: function (arg, folder, mp3en) {
      // folder === '_en'
      let markerIcon = document.getElementById(this.audioMarker[0] + this.audioMarker[1])
      console.log(markerIcon)

      // sets unreset icon back
      if (markerIcon) {
        markerIcon.setAttribute('class', 'text-prime')
      }

      this.audioMarker = [arg, folder]
      let icon = document.getElementById(arg + folder)
      icon.setAttribute('class', 'text-warn')

      let audioLink = mp3en
      let player = document.getElementById('audio')
      player.src = audioLink
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
      var newWord = this.selected[0].trim()
      if (set === 0) {
        this.note = 'Your entry -' + English + '- has been removed from the dictionary'
        this.showAlert()
        this.$store.dispatch('newAdd', {word: English, details: this.wordDetails, set: set})
      } else {
        // set added status and call api for audio
        if (!this.generalGet[newWord]) {
          this.wordDetails.added = true
          this.$store.dispatch('newAudio', {word: newWord, set: set})
        } else {
          this.wordDetails.added = false
        }
        this.$store.dispatch('newAdd', {word: newWord, details: {...this.wordDetails}, set: set})
        this.wordDetails.gl = null
        this.wordDetails.defch1 = null
      }
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
    this.randomLet()
    this.vocabList = this.$store.state.userProfile.vocab
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
