<template>
  <div class="dict">
    <audio id="audio"></audio>

    <!-- headers and toggle buttons -->
    <div class="mt-2 bg-second p-2 head">
      <div v-if="!newWord.word" align="center">
        <b-row align-h="end">
          <b-col cols="6">
            <h3 class="text-cream" > Word List </h3>
          </b-col>
          <b-col cols="3">
            <button class="buttonDiv bg-warn px-3" style="width:60px;float:right" @click="newWord.word = 'a'"> <b-icon-images variant="cream" font-scale="1.5"></b-icon-images></button>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-row >
          <b-col cols="3" align="left">
            <h2 class="text-cream ml-3" > My Words </h2>
          </b-col>
          <b-col  align="right">
            <button class="buttonDiv bg-third text-prime  mr-2" style="height:40px;width:70px" @click="edit=!edit">Edit</button>
            <button class="buttonDiv bg-alert text-cream  mr-2" style="height:40px;width:70px" @click="del=!del">Delete</button>
            <button class="buttonDiv bg-warn px-3" style="height:40px;width:60px" @click="newWord.word = null"> <b-icon-card-list variant="cream" font-scale="1.5"></b-icon-card-list></button>
          </b-col>
        </b-row>
      </div>
    </div>

    <!-- dictionary list -->


      <div class="bg-grey p-2" v-if="!newWord.word">
        <b-row align="center" class='mb-2'>
          <b-col>
            <b-form-input
            align="center"
            style="font-size:30px;width:70%;text-align:center"
            autocapitalize="none"
            autocomplete="off"
            id="type"
            @focus="nullClick()"
            @change="selected[2]=null, sMarker=selected[0]"
            v-model="selected[0]"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row align="center">
          <b-col>
            <b-form-select class="bg-third" style="width:70%;overflow-y: hidden" @change="selected[2] = null" v-model="selected[1]" :options="optionsG" :select-size="1"></b-form-select>
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
      show-empty
      head-variant="dark"
      sticky-header="600px"
      v-model="visibleRows"
      >
        <template v-slot:cell(english)="data">
          <b-row no-gutters>
            <b-col cols="3">
             <template v-if="stars.includes(data.value)">
               <b-icon-star-fill variant="warn" @click="addStar(data.value, 0)"></b-icon-star-fill> &nbsp; <br class="d-lg-none">
             </template>
             <template v-else>
                <b-icon-star @click="addStar(data.value, 1)"></b-icon-star> &nbsp; <br class="d-lg-none">
             </template>
             <b-icon-card-image :variant="getVariant(data.value)" @click="editWord(data.value)"></b-icon-card-image>  <br class="d-lg-none">

            </b-col>
            <b-col>
              {{data.value}} <br class="d-lg-none">
               <b-icon-soundwave class="text-prime" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/')"></b-icon-soundwave>
            </b-col>
          </b-row>
         </template>
      </b-table>
      </div>

    <!-- word list edits -->

      <div class="bg-grey p-2" v-if="newWord.word && newWord.word !== 'a'">

          <div v-if="waiting">

            <b-form @submit="onSubmit">
                <b-input-group class="my-2 p-6">
                    <b-input-group-prepend inline is-text>
                      <b-icon icon="hash"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input v-model="newWord.word" disabled>
                    </b-form-input>
                </b-input-group>

                <b-row>
                  <b-col cols="4" style="max-width:200px">
                     <b-img thumbnail fluid :src="imageLink(newWord.word, dictGet[newWord.word])" :alt="newWord.word"></b-img>
                  </b-col>
                  <b-col>
                    <div class="mt-9" align="left">
                      <b-form-file accept="image/*" placeholder="Change Image" type="file" id="file" ref="file" v-on:change="handleFileUpload()" ></b-form-file>
                    </div>
                  </b-col>
                </b-row>

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
                    <button class="buttonDiv bg-warn px-3" style="width:120px" type="submit"> <b-icon-plus variant="cream" font-scale="1.5"></b-icon-plus></button>
                    </div>
                </div>

            </b-form>

          </div>
          <div v-else align="center">
            <h4 class="text-prime"> Adding Picture </h4>
            <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
          </div>
      </div>

      <!-- list of words and pictures -->

      <div v-if="newWord.word">
        <table class="table table-striped table-hover table-sm table-borderless">
          <tbody>

            <tr v-for="(item, key) in dictGet" :key="key">
              <td style="width:30%">
                <span> <b-img  thumbnail fluid :src="imageLink(key, item)" :alt="key"></b-img> </span>
              </td>
              <td style="width:70%">
                <h5>{{key}}</h5> <span class="pr-5">{{item.text}}</span>
              </td>
            <td>
                <button v-if="edit" class="buttonDiv bg-third text-second px-3" @click="editWord(key)"><b-icon icon="pencil"></b-icon></button>
                <button v-if="del" class="buttonDiv bg-alert text-cream px-3" @click="deleteWord(key)"><b-icon icon="trash-fill"></b-icon></button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="success" hide-footer title="Picture Added">
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-warn text-cream" style="width:60%"  @click="hideModal('success')">Close</button>
    </b-modal>

    <b-modal hide-header-close no-close-on-esc no-close-on-backdrop align="center" ref="fail" hide-footer title="Problem Found">
      <div class="d-block">
        <h3> {{msg}} </h3>
      </div>
      <button class="buttonDiv mt-3 bg-alert text-cream" style="width:60%"  @click="hideModal('fail')">Close</button>
    </b-modal>

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
      tableItems: null,
      visibleRows: [],
      selected: [null, null, null],
      sMarker: null,
      optionsA: [
        { value: null, text: '---' }
      ],
      gValue: '---',
      optionsG: [
        { value: null, text: '---' },
        { value: '*', text: 'stars' },
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
      entry: true,
      imageData: null,
      newWord: {
        word: null,
        text: null,
        link: null,
        code: null,
        vocab: null
      },
      mainProps: {
        center: true,
        fluidGrow: true,
        'max-width': '50px',
        class: 'my-5'
      },
      secondProps: {
        center: true,
        fluidGrow: true,
        width: '30px',
        height: '30px',
        class: 'my-5'
      },
      vocabList: null,
      waiting: true,
      msg: 'Action Complete',
      edit: false,
      del: false,
      stars: []
    }
  },
  computed: {
    dictGet () {
      console.log('dictGet', this.$store.state.setRecord.dictRecord)
      return this.$store.getters.dictGet
    },
    starGet () {
      console.log('starGet', this.$store.state.setRecord.starRecord)
      return this.$store.getters.starGet
    },
    codeGen () {
      let date = new Date()
      let code = date.getMinutes()
      return code
    }
  },
  methods: {
    imageLink: function (key, item) {
      console.log('IMAGE_LINK', item, this.dictGet[key])
      let userProfile = this.$store.state.userProfile
      if (item) {
        return this.s3 + userProfile.userID + '/' + item['vocab'] + '/' + key + item['link'] + '.jpg'
      } else {
        return this.s3 + 'blank.jpg'
      }
    },
    nullClick: function (key, item) {
      console.log('NULL')
      this.selected = [null, null, null]
    },
    randomLet: function () {
      let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let alArr = alphabet.split('')

      this.shuffle(alArr)
      console.log(alArr)
      this.selected = [alArr[0], null, null]
    },
    filterTable: function (row, filter) {
      if (filter[1] === '*') {
        if (row.English in this.starGet) {
          return true
        }
      }
      if (filter[1] === 'abbr.' || filter[1] === 'prop.') {
        if (row.Gr === filter[1]) {
          return true
        }
      }
      if (filter[2] != null) {
        if (row.totalScore === filter[2] && row.tested) {
          return true
        }
      } else if (filter[0] === null || filter[0] === '') {
        return false
      } else if (filter[0] != null && filter[0].length === 1) {
        if (row.English[0].toLowerCase() === filter[0].toLowerCase()) {
          if (filter[1] && row.Gr === filter[1]) {
            return true
          } else if (!filter[1]) {
            return true
          }
        }
      } else if (filter[0] != null) {
        if ((row.English.toLowerCase()).includes(filter[0].toLowerCase())) {
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
      for (let word in this.dictGet) {
        if (word === arg) {
          v = 'safe'
        }
      }
      return v
    },
    playAudio: function (arg, folder) {
      let icon = document.getElementById(arg + folder)
      icon.setAttribute('class', 'text-warn')

      let vc = this.$store.state.userProfile.vocab[0]
      let s3root = 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/'
      let s3 = s3root + this.$store.state.audioLinks[vc]

      let audioLink = s3 + folder + arg + '.mp3'
      // console.log(audioLink)
      let player = document.getElementById('audio')
      player.src = audioLink
      player.play()
      player.onended = function () {
        icon.setAttribute('class', 'text-prime')
      }
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
      this.waiting = false
      console.log(localStorage.imageData)
      let _this = this
      return addImage({
        imageData: localStorage.imageData,
        wordData: _this.newWord,
        userID: _this.$store.state.userProfile.userID
      })
        .then(function (response) {
          console.log('response', response.data)
          if (localStorage.imageData) {
            _this.$store.dispatch('newWord', {newWord: JSON.stringify(_this.newWord)})
          }
          _this.newWord.word = 'a'
          _this.newWord.text = null
          _this.newWord.link = null
          _this.newWord.code = null
          _this.newWord.vocab = null
          localStorage.imageData = null
          _this.waiting = true
          _this.msg = 'New word added'
          _this.showModal()
        })
        .catch(error => {
          _this.msg = 'New word could not be added'
          _this.showAlert()
          console.log('Error Registering: ', error)
        })
    },
    addStar: function (word, set) {
      this.$store.dispatch('newStar', {word: word, set: set})
      let arr = this.stars
      if (set === 0) {
        console.log('delete')
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === word) {
            arr.splice(i, 1)
          }
        }
      } else {
        console.log('push')
        this.stars.push(word)
      }
      console.table(this.stars)
    },
    showModal: function () {
      this.$refs['success'].show()
    },
    showAlert: function () {
      this.$refs['fail'].show()
    },
    hideModal: function (mode) {
      if (mode === 'success') {
        this.$refs['success'].hide()
      } else {
        this.$refs['fail'].hide()
        this.msg = null
        this.waiting = true
      }
    },
    editWord: function (arg) {
      this.newWord.word = arg
      console.log(this.codeGen)
      if (this.dictGet[arg]) {
        this.newWord.text = this.dictGet[arg]['text']
        this.newWord.link = this.dictGet[arg]['link']
        this.newWord.code = this.codeGen
        this.newWord.vocab = this.dictGet[arg]['vocab']
      } else {
        this.newWord.code = this.codeGen
        this.newWord.vocab = this.$store.state.userProfile.vocab
      }
    },
    deleteWord: function (word) {
      this.$store.dispatch('deleteWord', {word: word})
      console.log(this.dictGet)
      this.msg = word + ' Deleted'
      this.showModal()
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
  watch: {
    selected: function () {
      if (this.selected[0] !== this.sMarker) {
        this.selected[2] = null
        this.sMarker = this.selected[0]
      }
    }
  },
  created () {
    // this.alphabet()
    this.randomLet()
    for (let word in this.$store.getters.starGet) {
      this.stars.push(word)
    }

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
