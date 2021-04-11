
<template>
  <div class="classCodes">

    <div class="bg-white mt-0 p-0">

      <div class="bg-grey p-2">
        <b-row>
          <b-col align="right">
            <button class="buttonDiv bg-darkgrey text-cream px-3 ml-3" style="width:auto; height:auto" @click="setCodes()">
                  Update
            </button>
            <button class="buttonDiv bg-warn text-cream px-3" style="width:auto; height:auto" @click="newTest()">
                  New Test
            </button>
          </b-col>
        </b-row>
      </div>

      <table class="table">
                    <tbody>
                        <tr v-for="(item, key) in $store.state.classCodes" :key="key">
                          <td>{{key}}</td>
                          <td>{{item.vocab}}</td>
                          <td>{{item.instructor}}</td>
                          <td>{{item.instID}}</td>
                          <td>{{item.limit}}</td>
                          <td>{{item.expiry}}</td>
                        </tr>
                    </tbody>
                  </table>

    </div>
  </div>

</template>

<script>
export default {
  name: 'reset',
  data () {
    return {
    }
  },
  methods: {
    setCodes: function () {
      this.$store.dispatch('classCodesRedis', {action: 'set', codeData: this.$store.state.classCodes})
    }
  },
  created () {
    this.$store.dispatch('classCodesRedis', {action: 'get', codeData: null})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
