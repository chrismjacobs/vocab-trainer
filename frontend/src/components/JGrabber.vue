
<template>
  <div>
    <b-container>

      <table class="table">
                    <tbody>
                        <tr v-for="(item, key) in master" :key="key">
                          <td>{{key}}</td>
                          <td>{{item.eng}}</td>
                          <td>{{item.label}}</td>
                          <td>{{item.defch1}}</td>
                          <td>{{item.defch2}}</td>
                          <td v-if="item.backref[1] !== 'Y'">{{item.backref}}</td>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
