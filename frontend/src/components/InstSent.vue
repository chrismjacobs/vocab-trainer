
<template>
  <div id="instSent">

    <div class="bg-white mt-0 p-0">

      <div class="bg-grey p-2">
        <b-row>
          <b-col align="right">
            <button class="buttonDiv bg-safe-light text-prime px-3" style="width:auto; height:auto" @click="saveRecords()">
                    Save Picture Notes
            </button>
          </b-col>
        </b-row>
      </div>

      <table class="table table-striped">
              <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Student</th>
                      <th scope="col">Pics</th>
                    </tr>
              </thead>
                    <tbody>
                      <template v-for="(item, key) in classRecords">
                        <tr :key="key">
                          <td  style="width:150px" >{{item.studentID}}</td>
                          <td  style="width:150px" >{{item.user}}</td>
                          <td>
                            <div style="width:70px; display:inline-block">
                            <b-icon-images variant="safe" font-scale="1.5" ></b-icon-images> {{getLength(item.setRecord.dictRecord)}}
                            </div>
                            <div style="display:inline-block">
                               <b-form-select style="width:100px;overflow-y: hidden; display:inline">
                                <option v-for="(x, key) in item.setRecord.dictRecord" :key="key"> {{key}} </option>
                              </b-form-select>
                            </div>
                          </td>
                          <td align="left">
                            <button class="buttonDiv bg-safe text-cream px-3" style="width:auto; height:auto" @click="showPictsOne(key)">
                                  OPEN
                            </button>
                          </td>

                        </tr>

                        <transition name="tableboard" :key="key">
                          <!--<tr v-if="key.toString() in pictShow && pictShow[key.toString()] === 1">-->
                          <tr v-if="key.toString() === pictShowOne">
                            <td colspan="6">
                              <InstPicts :student="key" :itemMaster="item"></InstPicts>
                            </td>
                          </tr>
                        </transition>
                      </template>

                    </tbody>
      </table>

    </div>
  </div>

</template>

<script>
import InstPicts from './InstPicts'

export default {
  name: 'InstSent',
  props: {
    s3: String,
    group: String
  },
  components: {
    InstPicts
  },
  data () {
    return {
      counterKeys: {
        transEng: 'English Test',
        transCh: 'Chinese Test',
        typeTest: 'Type Test',
        matchTrans: 'Match',
        matchType: 'Type Match'
      },
      scoreShow: {},
      pictShow: {},
      pictShowOne: null
    }
  },
  methods: {
    showPicts: function (user) {
      if (!this.pictShow[user] || this.pictShow[user] === 0) {
        this.pictShow[user] = 1
      } else {
        this.pictShow[user] = 0
      }
      this.pictShow = {...this.pictShow}
      console.log(user, this.pictShow)
    },
    showPictsOne: function (user) {
      if (this.pictShowOne) {
        this.pictShowOne = null
      } else {
        this.pictShowOne = user
      }
    },
    getLength: function (obj) {
      delete obj['add']
      return Object.keys(obj).length
    },
    saveRecords: function () {
      if (this.$store.state.studentNotes !== {}) {
        this.$store.dispatch('instructorLogs', { group: this.$store.state.classLoad, action: 'setNotes', notes: this.$store.state.studentNotes })
      }
    }
  },
  computed: {
    classRecords () {
      return this.$store.getters.classRecords
    },
    classGroups () {
      return this.$store.getters.classGroups
    }
  },
  created () {
    this.$store.dispatch('instructorLogs', { group: this.group, action: 'getNotesInstructor' })
  },
  beforeDestroy () {
    this.saveRecords()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
