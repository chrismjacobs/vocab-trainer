<template>
  <div class="dict">
    <audio id="audio" controls autoplay></audio>
    <b-container>
      <b-card class="m-3">
        <b-row>
        <b-col>
          <b-form-select v-model="selected" :options="options" :select-size="4"></b-form-select>
          <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
        </b-col>
        <b-col>
          test
        </b-col>
        </b-row>
      </b-card>
    </b-container>
    <b-container>
      <b-table
      striped hover sticky-header
      :items="tableItems"
      :fields="fields"
      :filter="selected"
      :filter-function="filterTable"
      >
        <template v-slot:cell(mp3en)="data">
            <b-icon-soundwave @click="playAudio(data.value)"></b-icon-soundwave>
         </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'Dictionary',
  data () {
    return {
      fields: [
        {key: 'English', label: 'Vocab', sortable: true},
        {key: 'Gr', label: 'Gr.', sortable: false},
        {key: 'Chinese', sortable: true},
        {key: 'mp3en', label: 'Listen'}
      ],
      tableItems: null,
      selected: 'A',
      options: []
    }
  },
  methods: {
    test: function () {
    },
    filterTable: function (row, filter) {
      if (row.Category === filter) {
        return true
      } else {
        return false
      }
    },
    alphabet: function () {
      let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let letter in alphabet) {
        this.options.push({ value: alphabet[letter], text: alphabet[letter] })
      }
    },
    playAudio: function (arg) {
      console.log(arg)
      document.getElementById('audio').src = arg
    },
    makeList: function () {
      let tableItems = []
      let dict = this.$store.state.masterPVQC
      for (let vocab in dict) {
        let chinese
        if (dict[vocab].defch2) {
          chinese = dict[vocab].defch1 + ';' + dict[vocab].defch2
        } else {
          chinese = dict[vocab].defch1
        }
        let acronym = false
        let propernoun = false
        if (vocab[0] === vocab[0].toUpperCase() && vocab[1] === vocab[1].toUpperCase()) {
          acronym = true
        } else if (vocab[0] === vocab[0].toUpperCase()) {
          propernoun = true
        }
        tableItems.push({
          English: vocab,
          Category: vocab[0].toUpperCase(),
          Chinese: chinese,
          Propernoun: propernoun,
          Acronym: acronym,
          Gr: dict[vocab].gl,
          mp3en: dict[vocab].mp3en
        })
      }
      this.tableItems = tableItems
    }
  },
  computed: {
  },
  created () {
    this.alphabet()
    this.makeList()
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
