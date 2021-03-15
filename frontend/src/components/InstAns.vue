
<template>
  <div id="InstAns">
    <audio id="audio"></audio>

    <div>
      <div class="bg-smoke">
        <b-table
        striped hover
        fixed
        :items="answerData"
        :fields="fields"
        >
        <template #head(english)="data">
          <div align="right">
            English
          </div>
        </template>

        <template v-slot:cell(english)="data">
          <div style="float:left">
           <template v-if="data.item.English in starGet">
              <b-icon-star-fill variant="warn" @click="addStar(data.item.English, 0)"></b-icon-star-fill>
            </template>
            <template v-else>
              <b-icon-star variant="grey" @click="addStar(data.item.English, 1)"></b-icon-star>
            </template>
          </div>
          <div align="right">
            <span :id="data.item.English" @click="playAnswer(data.item.English)"> {{data.item.English}}</span>
          </div>
        </template>

        <template v-slot:cell(chinese)="data" style="width:50%" >
          <div v-if="data.item._rowVariant === 'warn'">
            <b-icon icon="x" variant="alert" font-scale="1" ></b-icon> {{data.item.Choice}}<br>
            <b-icon icon="check2" variant="safe" font-scale="1"></b-icon> {{data.item.Chinese}}
          </div>
          <div v-else>
            {{data.item.Chinese}}
          </div>
        </template>

        </b-table>
      </div>

    </div>

  </div>

</template>

<script>
// import InstPicts from './InstPicts'

export default {
  name: 'InstAns',
  props: {
    mode: String,
    answerData: Array
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
