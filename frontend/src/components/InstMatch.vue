
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

      <div class="bg-grape-light p-2">
        <b-row>
          <b-col>
            <div v-for="(std, key) in round1" :key="key" style="height:30px" @click="levelTwo(std, 1)" :class="getBG(key)">
              <b-avatar :src="s3 + std + '/avatar.jpg'" size="1.5rem" class="ml-2"></b-avatar> {{getUser(std)}}
            </div>
          </b-col>
          <b-col>
            <div v-for="(std, key) in round2" :key="key">
              <div style="height:20px" :class="getBG(parseInt(key))">

               </div>
               <div style="height:40px" :class="getBG(key)" @click="levelThree(std, 1)">
                 <b-avatar :src="s3 + std + '/avatar.jpg'" size="2rem" class="ml-2"  ></b-avatar> {{getUser(std)}}
               </div>

            </div>
          </b-col>
          <b-col>
            <div v-for="(std, key) in round3" :key="key" @click="levelFour(std, 1)">
              <div style="height:10px" :class="getBG(parseInt(key))">

               </div>
              <div style="height:10px" :class="getBG(parseInt(key))">

               </div>
              <div style="height:10px" :class="getBG(parseInt(key))">

               </div>
               <div style="height:90px" :class="getBG(key)">
                 <b-avatar :src="s3 + std + '/avatar.jpg'" size="4rem" class="ml-2"  ></b-avatar> {{getUser(std)}}
               </div>
            </div>
          </b-col>
          <b-col v-if="array1.length > 1">
            <div @click="winner(round4['1'])" style="height:240px">
               <b-avatar :src="s3 + round4['1'] + '/avatar.jpg'" size="5rem" class="ml-2"></b-avatar> {{getUser(round4['1'])}}
            </div>
            <div @click="winner(round4['2'])" style="height:240px">
               <b-avatar :src="s3 + round4['2'] + '/avatar.jpg'" size="5rem" class="ml-2"></b-avatar> {{getUser(round4['2'])}}
            </div>
          </b-col>

        </b-row>
      </div>

      <table class="table table-striped">
              <thead>
                    <tr>
                      <th scope="col">Add</th>
                      <th scope="col">ID</th>
                      <th scope="col">Student</th>
                    </tr>
              </thead>
                    <tbody>
                      <template v-for="(item, key) in classRecords">
                        <tr :key="key">
                          <td  style="width:150px" >
                            <div v-if="array1.length > 1">
                            <b-icon-check-circle-fill v-if="r1values.includes(key)" scale="1.5" variant="grape" @click="levelOne(key, 0)"></b-icon-check-circle-fill>
                            <b-icon-check-circle v-else scale="1.5" @click="levelOne(key, 1)"></b-icon-check-circle> {{key}}
                            </div>
                          </td>
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
    s3: String
  },
  components: {
  },
  data () {
    return {
      round1: {},
      array1: [],
      round2: {},
      array2: [],
      round3: {},
      array3: [],
      round4: {},
      array4: []
    }
  },
  methods: {
    winner: function (winner) {
      alert(winner)
    },
    getBG: function (key) {
      console.log('getBG', key)
      let array = [1, 2, 5, 6, 9, 10, 13, 14]
      if (array.includes(parseInt(key))) {
        return 'bg-grape text-cream'
      }
    },
    newMatch: function () {
      this.round1set()
      this.round2set()
      this.round3set()
      this.round4set()
    },
    round4set: function () {
      for (let i = 1; i < 3; i += 1) {
        this.round4[i] = null
        this.array4.push(i)
      }
      console.log(this.round4, this.array4)
    },
    round3set: function () {
      for (let i = 1; i < 5; i += 1) {
        this.round3[i] = null
        this.array3.push(i)
      }
      console.log(this.round3, this.array3)
    },
    round2set: function () {
      for (let i = 1; i < 9; i += 1) {
        this.round2[i] = null
        this.array2.push(i)
      }
      console.log(this.round3, this.array2)
    },
    round1set: function () {
      for (let i = 1; i < 17; i += 1) {
        this.round1[i] = null
        this.array1.push(i)
      }
      console.log(this.round1, this.array1)
    },
    getUser: function (std) {
      console.log(std, this.classRecords)
      if (std) {
        return this.classRecords[std].user
      }
    },
    levelOne: function (student, action) {
      let newArray = this.shuffle(this.array1)
      for (let idx in newArray) {
        let n = newArray[idx]
        if (this.round1[n] === null && action === 1) {
          this.round1[n] = student
          console.log('add', this.round1)
          this.round1 = {...this.round1}
          return true
        } else if (action === 0 && this.round1[n] === student) {
          this.round1[n] = null
          console.log('remove', this.round1)
          this.round1 = {...this.round1}
          return true
        }
      }
    },
    levelTwo: function (student) {
      let newArray = this.shuffle(this.array2)
      let action
      if (Object.values(this.round2).includes(student)) {
        action = 0
      } else {
        action = 1
      }
      for (let idx in newArray) {
        let n = newArray[idx]
        if (this.round2[n] === null && action === 1) {
          this.round2[n] = student
          console.log('add', this.round2)
          this.round2 = {...this.round2}
          return true
        } else if (action === 0 && this.round2[n] === student) {
          this.round2[n] = null
          console.log('remove', this.round2)
          this.round2 = {...this.round2}
          return true
        }
      }
    },
    levelThree: function (student) {
      let action

      if (Object.values(this.round3).includes(student)) {
        action = 0
      } else {
        action = 1
      }
      let newArray = this.shuffle(this.array3)
      for (let idx in newArray) {
        let n = newArray[idx]
        if (this.round3[n] === null && action === 1) {
          this.round3[n] = student
          console.log('add', this.round3)
          this.round3 = {...this.round3}
          return true
        } else if (action === 0 && this.round3[n] === student) {
          this.round3[n] = null
          console.log('remove', this.round3)
          this.round3 = {...this.round3}
          return true
        }
      }
    },
    levelFour: function (student) {
      if (this.round4[1] === student) {
        this.round4[1] = null
      } else if (this.round4[2] === student) {
        this.round4[2] = null
      } else if (this.round4[1] === null) {
        this.round4[1] = student
      } else {
        this.round4[2] = student
      }
      this.round4 = {...this.round4}
    },
    shuffle: function (array) {
      // Fisher-Yates shuffle
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
  },
  computed: {
    classRecords () {
      return this.$store.getters.classRecords
    },
    r1values () {
      return Object.values(this.round1)
    },
    r2values () {
      return Object.values(this.round2)
    },
    r3values () {
      return Object.values(this.round3)
    },
    r4values () {
      return Object.values(this.round4)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
