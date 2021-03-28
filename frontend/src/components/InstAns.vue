
<template>
  <div id="InstAns">
    <audio id="audio"></audio>

    <div>
      <div class="bg-smoke">
        <b-table
        sticky-header
        striped hover
        fixed
        :items="answerData"
        :fields="fields"
        head-variant="dark"
        >
        <template #head(english)="data">
          <div align="right">
            English
          </div>
        </template>

        <template v-slot:cell(question)="data">
          <div style="float:left">
           <template v-if="data.item.English in starGet">
              <b-icon-star-fill variant="warn" @click="addStar(data.item.English, 0)"></b-icon-star-fill>
            </template>
            <template v-else>
              <b-icon-star variant="grey" @click="addStar(data.item.English, 1)"></b-icon-star>
            </template>
          </div>
          <div align="right">
            <span :id="data.item.Question" @click="playAnswer(data.item.Question)"> {{data.item.Question}}</span>
          </div>
        </template>

        <template v-slot:cell(answer)="data" style="width:50%" >
          <div v-if="data.item._rowVariant === 'warn'">
            <b-icon icon="x" variant="alert" font-scale="1" ></b-icon> {{data.item.Choice}}<br>
            <b-icon icon="check2" variant="safe" font-scale="1"></b-icon> {{data.item.Answer}}
          </div>
          <div v-else>
            {{data.item.Answer}}
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
        {key: 'Question', label: 'Question', sortable: true},
        {key: 'Answer', label: 'Answer', sortable: true}
      ],
      audioMarker: null
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
    playAnswer: function (arg) {
      console.log(this.dictGet)
      var result = this.dictGet.filter(obj => {
        return obj.English === arg
      })
      console.log('PLAY', result)

      if (this.audioMarker) {
        let icon = document.getElementById(this.audioMarker)
        icon.setAttribute('class', '')
      }

      this.audioMarker = arg
      let icon = document.getElementById(arg)

      icon.setAttribute('class', 'text-warn')

      let audioLink = result[0].mp3en
      let player = document.getElementById('audio')
      player.src = audioLink
      player.play()
      player.onended = function () {
        icon.setAttribute('class', '')
      }
    }
  },
  computed: {
    starGet () {
      console.log('stars', this.$store.getters.starGet)
      return this.$store.getters.starGet
    },
    dictGet () {
      return this.$store.getters.makeList
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
