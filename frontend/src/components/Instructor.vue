
<template>
  <div>
    <b-container>
      <div class="bg-grey p-3">
          <b-row>
            <b-col align="center">
              <button class="buttonDiv bg-alert px-3" style="width:45%; height:50px" @click="getClass()"> <b-icon-arrow-clockwise variant="cream" font-scale="1.5"></b-icon-arrow-clockwise></button>
            </b-col>
          </b-row>
      </div>

      <table class="table">
                    <tbody>
                      <div v-for="(item, key) in classRecords" :key="key">
                        <tr>
                          <td>{{key}}</td>
                          <td>{{item.user}}</td>
                          <td>{{(item.dictRecord).length}}</td>
                          <td>
                            <div v-for="(log, index) in item.logsRecord['logs']" :key="index">
                              {{log}} <br>
                            </div>
                          </td>
                          <td>
                            <div v-for="(voc, index) in item.userRecord" :key="index">
                              <h4>{{index}}</h4>
                              <span v-for="(v, vindex) in voc" :key="vindex">
                                {{vindex}}/
                              </span>

                            </div>
                          </td>
                        </tr>
                        <tr v-for="(picture, word) in item.dictRecord" :key="word">
                            <td style="">
                              <span> <b-img  thumbnail fluid src="" :alt="word"></b-img> </span>
                            </td>
                            <td style="">
                              <h5>{{word}}</h5> <span class="pr-5">{{picture.text}}</span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                      </div>

                    </tbody>
                  </table>

    </b-container>
  </div>

</template>

<script>
export default {
  data () {
    return {
      master: this.classRecords
    }
  },
  methods: {
    getClass: function () {
      this.$store.dispatch('classRecords', { userID: this.$store.state.userProfile.userID })
    }
  },
  created () {
  },
  computed: {
    classRecords () {
      console.log('computed')
      return this.$store.getters.classRecords
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
