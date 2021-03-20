
<template>
  <div id="instMatch">

    <div class="bg-white mt-0 p-0">
      <div class="bg-grey p-2">
        <b-row>
          <b-col align="right">
            <button class="buttonDiv bg-grape text-cream px-3" style="width:auto; height:auto" @click="newMatch()">
                  New Match
            </button>
          </b-col>
        </b-row>
      </div>

      <table class="table table-striped">
              <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Student</th>
                    </tr>
              </thead>
                    <tbody>
                      <template v-for="(item, key) in classRecords">
                        <tr :key="key">
                          <td  style="width:150px" >{{item.studentID}}</td>
                          <td  style="width:150px" >{{item.user}}</td>
                        </tr>
                      </template>
                    </tbody>
      </table>

    </div>
  </div>

</template>

<script>

export default {
  name: 'InstMatch',
  props: {
  },
  components: {
  },
  data () {
    return {

    }
  },
  methods: {
    newMatch: function () {
      alert('feature not available yet')
    }
  },
  computed: {
    classRecords () {
      return this.$store.getters.classRecords
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
