
<template>
  <div id="instTable">
    <audio id="audio"></audio>
    <div align="center">
      <b-row no-gutters class="bg-secondary">
        <b-col>
          <button class="buttonDiv bg-secondary px-3" style="width:100%" @click="showClear()"><b-icon-star-fill variant="warn" font-scale="1.5"></b-icon-star-fill > <span class="text-cream">Clear all</span> </button>
        </b-col>
        <b-col>
          <button class="buttonDiv bg-secondary px-3" style="width:100%" @click="showAdd()"><b-icon-star-fill variant="grape-light" font-scale="1.5"></b-icon-star-fill > <span class="text-cream">Add all</span> </button>
        </b-col>
      </b-row>

    </div>

    <div>
          <div class="mb-0">
              <b-table
              sticky-header
              striped hover
              :items="tableItems"
              :fields="fields"
              :filter="selected"
              :filter-function="filterTable"
              show-empty
              fixed
              head-variant="dark"
              >
                <template v-slot:cell(english)="data">
                      <template v-if="mode === 'student'">
                        <div v-if="data.item.Star">
                            <b-icon-star-fill variant="warn" @click="addStar(data.item.English, 0, null)"></b-icon-star-fill> <br class="d-lg-none">
                            <span class="ml-3" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/', data.item.mp3en, true)"> {{data.value}} ({{data.item.Gr}}) </span>
                        </div>
                        <div v-else>
                            <b-icon-star @click="addStar(data.item.English, 1, null)"></b-icon-star> &nbsp; <br class="d-lg-none">
                            <span class="ml-3" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/', data.item.mp3en, true)"> {{data.value}} ({{data.item.Gr}}) </span>
                        </div>
                      </template>
                      <template v-else>
                        <div v-if="list.includes(data.item.English)" @click="addCheck(data.item.English, 0)">
                          <b-icon-check-circle-fill  scale="2" variant="safe"></b-icon-check-circle-fill>
                          <span class="ml-3" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/', data.item.mp3en, true)"> {{data.value}} ({{data.item.Gr}}) </span>
                        </div>
                        <div v-else @click="addCheck(data.item.English, 1)">
                           <b-icon-check-circle scale="2"></b-icon-check-circle>
                           <span class="ml-3" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/', data.item.mp3en, true)"> {{data.value}} ({{data.item.Gr}}) </span>
                        </div>
                      </template>
                </template>

                <template v-slot:cell(chineseext)="data">
                      <span class="ml-3" :id="data.item.English + '_ch/'" @click="playAudio(data.item.English, '_ch/', data.item.mp3ch, true)"> {{data.value}} </span>
                </template>
              </b-table>
          </div>
    </div>

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
// import InstPicts from './InstPicts'

export default {
  name: 'InstTable',
  props: {
    selected: Array,
    list: Array,
    mode: String
  },
  components: {
    // InstPicts
  },
  data () {
    return {
      msg: null,
      fields: [
        {key: 'English', label: 'Vocab', sortable: true},
        {key: 'ChineseExt', label: 'Chinese', sortable: true}
      ],
      audioMarker: [null, null]
    }
  },
  methods: {
    showClear: function () {
      this.$refs['clear'].show()
    },
    showAdd: function () {
      this.$refs['add'].show()
    },
    hideClear: function (mode) {
      this.$refs['clear'].hide()
      if (mode === 'clear') {
        this.clearAllStars()
      }
    },
    hideAdd: function (mode) {
      this.$refs['add'].hide()
      if (mode === 'add') {
        this.addAllStars()
      }
    },
    addAllStars: function () {
      this.addStar(this.list, 4)
    },
    clearAllStars: function () {
      this.addStar(this.list, 5)
    },
    showModal: function (msg) {
      this.msg = msg
      this.$refs['success'].show()
      // router.push('/login')
    },
    showAlert: function (msg) {
      this.msg = msg
      this.$refs['fail'].show()
    },
    hideModal: function (mode) {
      this.$refs[mode].hide()
    },
    addStar: function (word, set) {
      this.$store.dispatch('newStar', {word: word, set: set})
    },
    addCheck: function (vocab) {
      if (this.list.includes(vocab)) {
        let idx = this.list.indexOf(vocab)
        if (idx > -1) {
          this.list.splice(idx, 1)
        }
      } else {
        this.list.push(vocab)
      }
      console.log(this.list)
    },
    filterTable: function (row, filter) {
      if (filter[0] === '') {
        if (this.list.includes(row.English)) {
          return true
        } else {
          return false
        }
      } else if (filter[0].length === 1) {
        if (filter[0] === row.English[0]) {
          return true
        }
      } else if (row.English.includes(filter[0].trim())) {
        return true
      } else {
        return false
      }
    },
    playAudio: function (arg, folder, link, normal) {
      // folder === '_en'
      let markerIcon = document.getElementById(this.audioMarker[0] + this.audioMarker[1])
      console.log(markerIcon, link)

      // sets unreset icon back
      if (markerIcon) {
        markerIcon.setAttribute('class', 'text-prime ml-3')
      }

      let textColor

      if (normal) {
        textColor = 'text-warn ml-3'
      } else {
        textColor = 'ml-3 text-' + this.getSoundwave()
      }

      this.audioMarker = [arg, folder]
      let icon = document.getElementById(arg + folder)
      icon.setAttribute('class', textColor)

      let player = document.getElementById('audio')
      player.src = link

      let _this = this

      player.addEventListener('error', function (e) {
        console.log('Logging playback error: ' + e)
        icon.setAttribute('class', 'text-prime ml-3')
        _this.note = 'Sorry, no audio available'
        _this.showAlert()
      })

      player.play()
      player.onended = function () {
        icon.setAttribute('class', 'text-prime ml-3')
      }
    }
  },
  computed: {
    tableItems () {
      // console.log('tableGet', this.$store.getters.makeList)
      return this.$store.getters.makeList
    },
    starGet () {
      console.log('stars', this.$store.getters.starGet)
      return this.$store.getters.starGet
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
