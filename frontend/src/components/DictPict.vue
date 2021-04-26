<template>
  <div class="dictpict">

      <div class="bg-safe-light p-2">

          <div v-if="!waiting">

            <b-form @submit="onSubmit">
                <b-row>
                  <b-col align="center">
                    <div @click="browse()">
                     <b-img style="max-height:200px" thumbnail fluid :src="getPict" :alt="pictWord"></b-img>
                    </div>
                    <div style="max-width:250px" align="left">
                      <b-form-file accept="image/*" placeholder="" type="file" id="file" ref="file" v-on:change="handleFileUpload()" ></b-form-file>
                    </div>
                  </b-col>

                <b-col md="7">
                <b-input-group class="my-2 p-6" label-for="exampleInput2">
                    <b-input-group-prepend inline is-text>
                      <b-icon icon="filter-left"></b-icon>
                    </b-input-group-prepend>
                    <b-form-textarea
                    v-model="newWord.def"
                    placeholder="Add Definition / Synonyms"
                    rows="2"
                    :class="getBG('def')"
                    >
                    </b-form-textarea>
                </b-input-group>

                <b-input-group class="my-2 p-6" label-for="exampleInput3">
                    <b-input-group-prepend inline is-text>
                      <b-icon icon="filter-left"></b-icon>
                    </b-input-group-prepend>
                    <b-form-textarea
                    v-model="newWord.text"
                    placeholder="Add Sentence"
                    rows="4"
                    :class="getBG('text')"
                    >
                    </b-form-textarea>
                </b-input-group>
                <div v-if="note">
                  <hr>
                  <div :class="colors" >
                    {{note}}
                  </div>
                  <br>
                </div>
                <div class=" mt-2">
                  <button class="buttonDiv bg-success px-3" style="width:120px" @click="saveWord()"> <b-icon variant="cream" font-scale="1.5" icon="arrow-up"></b-icon><b-icon-card-image variant="cream" font-scale="1.5"></b-icon-card-image></button>
                  <button v-if="newWord.link" class="buttonDiv bg-danger px-3" style="width:60px;float:right" @click="deleteAlert()"> <b-icon variant="cream" font-scale="1.5" icon="trash-fill"></b-icon></button>
                </div>
                </b-col>
                </b-row>

            </b-form>

          </div>
          <div v-else align="center">
            <h4 class="text-prime"> Adding Picture </h4>
            <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
          </div>
      </div>

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
import { imageValidation } from '@/utils'
import { addImage } from '@/api'

export default {
  name: 'DictPict',
  props: {
    s3: String,
    pictWord: String,
    pictCh: String,
    vocabList: String,
    note: String,
    colors: String
  },
  data () {
    return {
      imageData: null,
      msg: 'Action Complete',
      waiting: false,
      ready: false,
      newWord: {
        word: this.pictWord,
        text: null,
        def: null,
        chinese: this.pictCh,
        link: null,
        code: this.codeGen(),
        vocab: this.vocabList,
        note: null,
        status: null
      }
    }
  },
  computed: {
    pictGet () {
      console.log('pictGet', this.$store.state.setRecord.dictRecord)
      return this.$store.getters.pictGet
    },
    getPict () {
      if (this.newWord.link === 'add') {
        return 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/add.jpg'
      } else if (this.ready) {
        return 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/ready.png'
      } else if (this.newWord.link) {
        let link = this.s3 + this.$store.state.userProfile.userID + '/' + this.newWord.vocab + '/' + this.pictWord + this.newWord.link + '.jpg'
        console.log(link)
        return link
      } else {
        return 'https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/standin.png'
      }
    }
  },
  methods: {
    getBG: function (part) {
      if (!this.newWord[part]) {
        return 'bg-warn-light'
      }
    },
    browse: function () {
      document.getElementById('file').click()
    },
    showModal: function () {
      this.$refs['success'].show()
    },
    showDelete: function () {
      this.$refs['delete'].show()
    },
    hideModal: function (mode) {
      if (mode === 'success') {
        this.$refs['success'].hide()
      } else if (mode === 'cancel') {
        this.$refs['delete'].hide()
        this.msg = null
      } else {
        this.$refs['delete'].hide()
        this.msg = null
        this.deletePict()
        this.$emit('pictureFalse')
      }
    },
    deleteAlert: function () {
      this.msg = 'Are you you sure you want to delete picture?'
      this.showDelete()
    },
    deletePict: function () {
      this.$store.dispatch('deletePict', {word: this.pictWord})
      console.log(this.pictGet)
      this.showModal()
    },
    onSubmit: function (evt) {
      evt.preventDefault()
    },
    codeGen: function () {
      let date = new Date()
      let code = date.getMinutes().toString() + date.getSeconds().toString()
      console.log(code)
      return code
    },
    getText: function (word) {
      if (this.pictGet[word]) {
        return this.pictGet[word].text
      } else {
        return ''
      }
    },
    handleFileUpload: function () {
      imageValidation(document.getElementById('file'))
      this.ready = true
    },
    saveWord: function () {
      let _this = this
      // console.log(localStorage.imageData)
      // why doesn't this work?
      if (localStorage.imageData === 'null' && this.newWord.link === null) {
        alert('please add image')
        return false
      } else if (!this.newWord.text) {
        alert('please add sentence')
        return false
      } else if (!this.newWord.def) {
        alert('please add definition')
        return false
      } else if (localStorage.imageData.length < 1) {
        // ?????????????
        _this.$store.dispatch('newPicture', {newWord: JSON.stringify(_this.newWord)})
      } else {
        this.waiting = true
        return addImage({
          imageData: localStorage.imageData,
          wordData: _this.newWord,
          userID: _this.$store.state.userProfile.userID
        })
          .then(function (response) {
            localStorage.imageData = null
            console.log('response', response.data)
            _this.newWord = {...response.data.obj}
            _this.$store.dispatch('newPicture', {newWord: JSON.stringify(_this.newWord)})
            _this.ready = false
            _this.waiting = false
            _this.msg = 'New image/sentence added'
            _this.showModal()
          })
          .catch(error => {
            _this.waiting = false
            _this.msg = 'sorry, new image/sentence could not be added'
            _this.showModal()
            console.log('Error Registering: ', error)
          })
      }
    }
  },
  created () {
    localStorage.imageData = null
    if (this.pictGet[this.pictWord]) {
      this.newWord = this.pictGet[this.pictWord]
      this.newWord['code'] = this.codeGen()
    }
    console.log('newWord', this.newWord)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
