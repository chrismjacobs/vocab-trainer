
<template>
  <div id="dash">
    <div v-if="type !== 'account'">
    <h6 :class="label()"> This Session:</h6>
      <span v-if="currentRecItems.length === 0" class="text-cream"> No new words </span>

      <div v-for="(item, index) in currentRecItems" :key="index">
            <div>
              <b-progress style="height:20px" class="mt-1" max="1" show-value>
              <b-progress-bar :value="(item.plus + item.minus + item.even)*0.2" variant="second text-cream"><span> {{item.mode}} </span></b-progress-bar>
              <b-progress-bar :value="item.plus" :variant="bar()"></b-progress-bar>
              <b-progress-bar :value="item.even" variant="smoke text-prime"></b-progress-bar>
              <b-progress-bar :value="item.minus" variant="warn-light text-prime"></b-progress-bar>
              </b-progress>
            </div>
      </div>
    <hr>
    </div>
    <div v-else class="text-prime">
      <h5> Vocab Set:</h5>
      <h6> {{vocabSet[$store.state.userProfile.vocab]}}</h6>
      <h6> {{tableItems.length}} Words</h6>
    <hr>
    </div>

    <h6 :class="label()"> Word Levels:</h6>

    <div v-for="(item, key) in userRecItems" :key="key">
          <div v-if="key[0] !== 't'">
            <b-progress style="height:20px; background:none" class="mt-1" :max="maxRec * 1.3" show-value>
              <b-progress-bar :value="maxRec * 0.30" variant="second text-cream"><span> {{key}} </span></b-progress-bar>
              <b-progress-bar :value="item" :variant="getClass(key)"></b-progress-bar>
            </b-progress>
          </div>
          <div v-else>
            <b-progress style="height:20px; background:none" class="mt-1" show-value>
              <b-progress-bar value="200" variant="second text-cream"><span> {{key}}  </span></b-progress-bar>
              <b-progress-bar :value="item" :variant="getClass(key)"></b-progress-bar>
            </b-progress>
          </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'dash',
  props: {
    tableItems: Array,
    type: String
  },
  data () {
    return {
      typeHeaders: {
        'transEng': 'E/C',
        'transCh': 'C/E',
        'typeTest': 'Type',
        'matchTrans': 'Match',
        'matchType': 'Match'
      },
      vocabSet: {
        generalT: 'General Set 4000+ words',
        generalV: 'Vocational Highschool Set',
        generalW: 'Senior High Set A',
        generalD: 'Senior High Set B',
        generalY: 'Senior High Set C',
        tourism1: 'ESP: Tourism Level 1',
        tourism: 'ESP: Tourism Level 2',
        digital1: 'ESP: Digital Media Level 1',
        culinary1: 'ESP: Culinary English Level 1',
        culinary2: 'ESP: Culinary English Level 2'
      }
    }
  },
  methods: {
    getClass: function (arg) {
      let styles = {
        strong: 'spanDiv bg-safe-light text-prime',
        good: 'spanDiv bg-third text-prime',
        okay: 'spanDiv bg-grey text-prime',
        weak: 'spanDiv bg-warn-light text-prime',
        problem: 'spanDiv bg-alert-light text-prime',
        'total+': 'spanDiv bg-cream text-prime',
        'total-': 'spanDiv bg-grey text-prime'
      }
      return styles[arg]
    },
    label: function () {
      if (this.type === 'nav') {
        return 'text-cream'
      } else {
        return 'text-prime'
      }
    },
    bar: function () {
      if (this.type === 'nav') {
        return 'third text-prime'
      } else {
        return 'prime text-cream'
      }
    }
  },
  computed: {
    currentRecItems () {
      let currentRecItems = []
      for (let type in this.$store.state.currentRecord) {
        let plus = 0
        let minus = 0
        let even = 0
        let obj = this.$store.state.currentRecord[type]
        for (let index in obj) {
          if (index) {
            // count each word and score
            if (obj[index] < 0) {
              minus += 1
            } else if (obj[index] === 0) {
              even += 1
            } else {
              plus += 1
            }
          }
        }
        currentRecItems.push({mode: this.typeHeaders[type], plus: plus, minus: minus, even: even})
      }
      return currentRecItems
    },
    userRecItems () {
      let counter = {
        strong: 0,
        good: 0,
        okay: 0,
        weak: 0,
        problem: 0,
        'total+': 0,
        'total-': 0
      }

      for (let item in this.tableItems) {
        let row = this.tableItems[item]
        if (row.totalScore >= 2) {
          counter.strong += 1
          counter['total+'] += 1
        } else if (row.totalScore === 1) {
          counter.good += 1
          counter['total+'] += 1
        } else if (row.totalScore === 0 && row.tested) {
          counter.okay += 1
          counter['total+'] += 1
        } else if (row.totalScore === -1) {
          counter.weak += 1
          counter['total+'] += 1
        } else if (row.totalScore <= -2) {
          counter.problem += 1
          counter['total+'] += 1
        } else {
          counter['total-'] += 1
        }
      }
      return counter
    },
    maxRec () {
      let max = 1
      for (let rec in this.userRecItems) {
        if (this.userRecItems[rec] > max && rec !== 'total-' && rec !== 'total+') {
          max = this.userRecItems[rec]
        }
      }
      return max + 1
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
