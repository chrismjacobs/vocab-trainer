
<template>
  <div id="instTable">
    <audio id="audio"></audio>

    <div>
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
              >
                <template v-slot:cell(english)="data">
                    <template v-if="list.includes(data.item.English)">
                      <div v-if="mode === 'student'">
                        <template v-if="data.item.Star">
                            <b-icon-star-fill variant="warn" @click="addStar(data.item.English, 0)"></b-icon-star-fill> <span class="d-lg-none"> &nbsp; <br> </span>
                        </template>
                        <template v-else>
                            <b-icon-star @click="addStar(data.item.English, 1)"></b-icon-star> &nbsp; <br class="d-lg-none">
                        </template>
                      </div>
                      <div v-else>
                        <template v-if="list.includes(data.item.English)">
                          <b-icon-check-circle-fill  scale="1.5" variant="safe" @click="addCheck(data.item.English, 0)"></b-icon-check-circle-fill>
                        </template>
                        <template v-else>
                          ok
                           <b-icon-check-circle scale="1.5" @click="addCheck(data.item.English, 1)"></b-icon-check-circle>
                        </template>
                      </div>
                    </template>
                    <span class="ml-3" :id="data.value + '_en/'" @click="playAudio(data.value, '_en/', data.item.mp3en, true)"> {{data.value}} ({{data.item.Gr}}) </span>
                </template>
                <template v-slot:cell(chineseext)="data">
                      <span :id="data.item.English + '_ch/'" @click="playAudio(data.item.English, '_ch/', data.item.mp3ch, true)"> {{data.value}} </span>
                </template>
              </b-table>
          </div>
    </div>

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
