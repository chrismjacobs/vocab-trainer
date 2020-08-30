<template>
  <div class="dict">
    <audio id="audio" autoplay></audio>
    <b-container>
      <b-card class="m-3">
        <b-row>
        <b-col>
          <b-form-select v-model="selected[0]" :options="optionsA" :select-size="4"></b-form-select>
          <div class="mt-3">Selected: <strong>{{ selected[0] }}</strong></div>
        </b-col>
        <b-col>
          <b-form-select v-model="selected[1]" :options="optionsG" :select-size="4"></b-form-select>
          <div class="mt-3">Selected: <strong>{{ selected[1] }}</strong></div>
        </b-col>
        <b-col>
          <b-form-select v-model="selected[2]" :options="optionsR" :select-size="4"></b-form-select>
          <div class="mt-3">Selected: <strong>{{ selected[2] }}</strong></div>
        </b-col>
        </b-row>
      </b-card>
    </b-container>
    <b-container>
      <div class="d-md-none">
      <b-table
      striped hover
      :items="tableItems"
      :fields="fields"
      :filter="selected"
      :filter-function="filterTable"
      stacked
      >
        <template v-slot:cell(mp3en)="data">
            <b-icon-soundwave @click="playAudio(data.value)"></b-icon-soundwave>
         </template>
      </b-table>
      </div>
      <div class="d-none d-md-block">
      <b-table
      striped hover
      :items="tableItems"
      :fields="fields"
      :filter="selected"
      :filter-function="filterTable"
      sticky-header="400px"
      >
        <template v-slot:cell(mp3en)="data">
            <b-icon-soundwave @click="playAudio(data.value)"></b-icon-soundwave>
         </template>
      </b-table>
      </div>
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
        {key: 'ChineseExt', label: 'Chinese', sortable: true},
        {key: 'mp3en', label: 'Listen'}
      ],
      tableItems: null,
      selected: ['A', null, null],
      optionsA: [],
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
        { value: null, text: '---' },
        { value: 1, text: 'okay' },
        { value: 2, text: 'well' },
        { value: -1, text: 'trouble' },
        { value: -2, text: 'bad' }
      ]
    }
  },
  methods: {
    filterTable: function (row, filter) {
      if (filter[2] != null) {
        if (row.totalScore === filter[2]) {
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
    playAudio: function (arg) {
      console.log(arg)
      document.getElementById('audio').src = arg
    }
  },
  created () {
    this.alphabet()
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

</style>
