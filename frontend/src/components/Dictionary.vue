<template>
  <div class="dict">
    <audio id="audio" autoplay></audio>
    <div class="mt-2 bg-second p-2">
            <h2 class="text-cream" align="center">
              Word List
            </h2>
    </div>

      <div class="bg-grey">
        <b-row>
        <b-col>
          Search by Letter:
          <b-form-select class="bg-warn"  v-model="selected[0]" :options="optionsA" :select-size="7"></b-form-select>
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

            <b-form-group label="Button style radios with outline-primary variant and size lg">
      <b-form-radio-group
        id="btn-radios-2"
        v-model="selected"
        :options="options"
        buttons
        button-variant="outline-primary"
        size="lg"
        name="radio-btn-outline"
      ></b-form-radio-group>
    </b-form-group>

            <button class="buttonDiv bg-alert px-1" @click="levels('-2')" style="width:15%" > <h5>--</h5> </button>
            <button class="buttonDiv bg-warn px-1" @click="levels('-1')" style="width:15%" > <h5>-</h5> </button>
            <button class="buttonDiv bg-smoke px-1" @click="levels(0)" style="width:15%" > <h5>o</h5> </button>
            <button class="buttonDiv bg-second px-1" @click="levels(1)" style="width:15%" > <h5>+</h5> </button>
            <button class="buttonDiv bg-safe px-1" @click="levels(2)" style="width:15%" > <h5>++</h5> </button>
            <button class="buttonDiv bg-grey px-1" @click="levels(null)" style="width:15%" > <h5>None</h5> </button>
          </b-col>
        </b-row>
      </div>

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
      head-variant="dark"
      sticky-header="400px"
      >
        <template v-slot:cell(mp3en)="data">
            <b-icon-soundwave @click="playAudio(data.value)"></b-icon-soundwave>
         </template>
      </b-table>
      </div>

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
      selected: ['A', null, -1],
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
        { value: 2, text: 'good' },
        { value: 1, text: 'fine' },
        { value: 0, text: 'middle' },
        { value: -1, text: 'low' },
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
    levels: function (arg) {
      this.filter[2] = arg
      console.log(this.selected)
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

.selectColor{
    background-color: #e7e7e7;
}

</style>
