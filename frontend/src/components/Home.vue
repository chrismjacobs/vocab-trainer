
<template>
  <div>
    <b-container>
    <b-table :items="tableItems">
      <template v-slot:cell(mp3en)="data">
        test
        <b-icon-arrow-up @click="alert(data.value)"></b-icon-arrow-up>
      </template>
    </b-table>
    </b-container>
  </div>

</template>

<script>
export default {
  data () {
    return {
      tableItems: null
    }
  },
  methods: {
    alert: function (arg) {
      alert(arg)
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
          mp3en: '-'
        })
      }
      this.tableItems = tableItems
    }
  },
  created () {
    this.makeList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
