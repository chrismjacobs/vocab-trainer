<template>
  <div class="dict">
    <audio id="audio" autoplay></audio>
    <div class="mt-2 bg-second p-2" align="center">
      <div v-if="!newWord.word" >
        <b-row align-h="end">
          <b-col cols="6">
            <h2 class="text-cream" > Word List </h2>
          </b-col>
          <b-col cols="3">
            <button class="buttonDiv bg-warn px-3" style="width:60px;float:right" @click="newWord.word = 'a'"> <b-icon-images variant="cream" font-scale="1.5"></b-icon-images></button>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-row align-h="end">
          <b-col cols="6">
            <h3 class="text-cream" > My Words </h3>
          </b-col>
          <b-col cols="3">
            <button class="buttonDiv bg-prime px-3" style="width:60px;float:right" @click="newWord.word = null"> <b-icon-card-list variant="cream" font-scale="1.5"></b-icon-card-list></button>
          </b-col>
        </b-row>
      </div>
    </div>

      <div class="bg-grey p-2" v-if="!newWord.word">
        <b-row>
        <b-col>
          Search by Letter:
          <b-form-select class="bg-warn-light"  v-model="selected[0]" :options="optionsA" :select-size="7"></b-form-select>
        </b-col>
        <b-col>
          Search by Grammar:
          <b-form-select class="bg-third" style="overflow-y: hidden" v-model="selected[1]" :options="optionsG" :select-size="7"></b-form-select>
        </b-col>
        </b-row>
        <b-row class="mt-3 pb-3" align="center">
          <b-col>
            Search by Score:
            <br>
            <br>

              <b-form-group>
                <b-form-radio-group
                  id="btn-radios-2"
                  v-model="selected[2]"
                  :options="optionsR"
                  style="width:100%;color:red"
                  buttons
                  :button-variant="color[this.selected[2]]"
                  size="lg"
                  name="radio-btn-outline"
                ></b-form-radio-group>
              </b-form-group>

          </b-col>
        </b-row>

      </div>

      <div v-if="!newWord.word">
      <b-table
      striped hover
      :items="tableItems"
      :fields="fields"
      :filter="selected"
      :filter-function="filterTable"
      head-variant="dark"
      sticky-header="400px"
      >
        <template v-slot:cell(english)="data">
             <b-icon-card-image :variant="getVariant(data.value)" @click="editWord(data.value)"></b-icon-card-image> &nbsp;
             {{data.value}}  &nbsp;
             <b-icon-soundwave @click="playAudio(data.value, '_en/')"></b-icon-soundwave> &nbsp;
             <b-icon-soundwave @click="playAudio(data.value, '_ch/')"></b-icon-soundwave> &nbsp;
         </template>
      </b-table>
      </div>

    <!-- word list edits -->

      <div class="bg-grey p-2" v-if="newWord.word && newWord.word !== 'a'">

      <b-form @submit="onSubmit">

          <b-input-group class="my-2 p-6">
              <b-input-group-prepend inline is-text>
                <b-icon icon="hash"></b-icon>
              </b-input-group-prepend>
              <b-form-input v-model="newWord.word" disabled>
              </b-form-input>
          </b-input-group>

          <b-form-file accept="image/*" placeholder="Change Image" type="file" id="file" ref="file" v-on:change="handleFileUpload()" ></b-form-file>

          <b-input-group class="my-2 p-6" label="Student ID:" label-for="exampleInput2">
              <b-input-group-prepend inline is-text>
                <b-icon icon="filter-left"></b-icon>
              </b-input-group-prepend>
              <b-form-textarea
              v-model="newWord.text"
              placeholder="Add Sentence"
              rows="2"
              >
              </b-form-textarea>
          </b-input-group>

          <div class="d-flex justify-content-between">
              <div>
              <button class="buttonDiv bg-safe px-3" style="width:120px" type="submit"> <b-icon-plus variant="cream" font-scale="1.5"></b-icon-plus></button>
              </div>
          </div>

        </b-form>

    </div>

    <div v-if="newWord.word">
      <table class="table table-striped table-hover table-sm table-borderless">
        <tbody>

          <tr v-for="(item, key) in wordList" :key="key">
            <td style="max-width:300px">
              <span> <b-img v-bins="mainProps" thumbnail fluid :src="imageLink +  key + '.jpg'" :alt="key"></b-img> </span>
            </td>
            <td><h6>{{key}}</h6></td>
            <td><span class="pr-5">{{item}}</span></td>
           <td>
              <button class="buttonDiv" @click="newWord.word = key, newWord.text = $store.state.dictRecord[key]">Edit</button>
              <button class="buttonDiv" @click="deleteWord(key)"> Delete</button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import { imageValidation } from '@/utils'
import { addImage } from '@/api'

export default {
  name: 'Dictionary',
  props: {
    s3: String
  },
  data () {
    return {
      fields: [
        {key: 'English', label: 'Vocab', sortable: true},
        {key: 'Gr', label: 'Gr.', sortable: false},
        {key: 'ChineseExt', label: 'Chinese', sortable: true}
      ],
      fields2: [
        {key: 'English', label: 'Vocab', sortable: true},
        {key: 'ChineseExt', label: 'Chinese', sortable: true}
      ],
      tableItems: null,
      selected: [null, null, null],
      optionsA: [
        { value: null, text: '---' }
      ],
      optionsG: [
        { value: null, text: '---' },
        { value: 'v.', text: 'verbs' },
        { value: 'adj.', text: 'adjectives' },
        { value: 'n.', text: 'nouns' },
        { value: 'phr.', text: 'phrases' },
        { value: 'abbr.', text: 'abbreviations' },
        { value: 'prop.', text: 'proper nouns' }
      ],
      optionsR: [
        { value: null, text: 'none' },
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
      entry: true,
      imageData: null,
      newWord: {
        word: null,
        text: null
      },
      mainProps: {
        center: true,
        fluidGrow: true,
        'max-width': '50px',
        class: 'my-5'
      },
      vocabList: null
    }
  },
  computed: {
    wordList () {
      return this.$store.state.dictRecord
    },
    imageLink () {
      let userProfile = this.$store.state.userProfile
      return this.s3 + userProfile.userID + '/' + userProfile.vocab + '/'
    }
  },
  methods: {
    filterTable: function (row, filter) {
      if (filter[2] != null) {
        if (row.totalScore === filter[2] && row.tested) {
          return true
        }
      } else if (filter[1] === null) {
        if (row.Category === filter[0]) {
          return true
        }
      } else if (row.Category === filter[0] && row.Gr === filter[1]) {
        return true
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
    editWord: function (arg) {
      this.newWord.word = arg
    },
    getVariant: function (arg) {
      let v = 'prime'
      for (let word in this.$store.state.dictRecord) {
        if (word === arg) {
          v = 'safe'
        }
      }
      return v
    },
    playAudio: function (arg, folder) {
      let s3audio = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/'
      let links = {
        tourism: 'audio',
        food: 'foodio'
      }
      let audioLink = s3audio + links[this.vocabList] + folder + arg + '.mp3'
      console.log(audioLink)
      document.getElementById('audio').src = audioLink
    },
    onSubmit: function (evt) {
      evt.preventDefault()
      // check all is okay
      this.saveWord()
    },
    handleFileUpload: function () {
      imageValidation(document.getElementById('file'))
    },
    saveWord: function () {
      console.log(localStorage.imageData)
      let _this = this
      return addImage({
        imageData: localStorage.imageData,
        word: _this.newWord,
        vocab: _this.$store.state.userProfile.vocab,
        userID: _this.$store.state.userProfile.userID
      })
        .then(function (response) {
          console.log('response', response.data)
          _this.$store.dispatch('newWord', {newWord: _this.newWord})
          _this.newWord.word = 'a'
          _this.newWord.text = null
          localStorage.imageData = null
        })
        .catch(error => {
          alert('New word could not be added')
          console.log('Error Registering: ', error)
        })
    },
    deleteWord: function (word) {
      this.$store.dispatch('deleteWord', {word: word})
    }
  },
  created () {
    this.alphabet()
    this.vocabList = this.$store.state.userProfile.vocab
    this.tableItems = this.$store.getters.makeList
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

.selectColor{
    background-color: #e7e7e7;
}

</style>
