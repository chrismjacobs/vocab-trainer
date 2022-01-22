
<template>
  <div>
    <b-container>

      <table class="table">
                    <tbody>
                        <tr v-for="(item, key) in master" :key="key">
                          <td>{{key}}</td>
                          <td>{{item.gl}}</td>
                          <td>{{item.defch1}}</td>
                          <td>{{item.defch2}}</td>
                          <td>{{item.kanji}}</td>
                          <td>{{item.chinese}}</td>
                          <td>{{item.category}}</td>
                          <td v-if="item.backref && item.backref[1] !== 'Y'">{{item.backref}}</td>
                          <td v-else></td>
                        </tr>
                    </tbody>
                  </table>

    </b-container>
  </div>

</template>

<script>
export default {
  data () {
    return {
      master: this.$store.state.testJ
    }
  },
  methods: {
  },
  created () {
    console.log(this.$store.state.testJ)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
