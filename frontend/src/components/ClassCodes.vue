
<template>
  <div class="classCodes">

    <div class="bg-white mt-0 p-0">

      <div class="bg-grey p-2">
        <b-row>
          <b-col align="right">

          </b-col>
        </b-row>
      </div>

      <table class="table">
                    <tbody>
                        <tr>
                          <td>
                            <b-form-input v-model="code.code"></b-form-input>
                          </td>
                          <td>
                            <b-form-input v-model="code.vocab"></b-form-input>
                          </td>
                          <td>
                            <b-form-input v-model="code.instructor"></b-form-input>
                          </td>
                          <td>
                            <b-form-input v-model="code.instID"></b-form-input>
                          </td>
                          <td>
                            <button class="buttonDiv bg-warn text-cream px-3" style="width:auto; height:auto" @click="setCode()">
                                  Update
                            </button>
                            <button class="buttonDiv bg-alert text-cream px-3" style="width:auto; height:auto" @click="deleteCode()">
                                  Delete
                            </button>
                          </td>
                        </tr>
                        <tr v-for="(item, key) in $store.state.classCodes" :key="key">
                          <td>{{item.code}}</td>
                          <td>{{item.vocab}}</td>
                          <td>{{item.instructor}}</td>
                          <td>{{item.instID}}</td>
                          <td>{{item.limit}}</td>
                          <td>{{item.expiry}}</td>
                          <td><button class="buttonDiv bg-safe text-cream px-3 btn-sm" style="width:auto; height:auto" @click="edit(item)">
                                  Edit
                            </button></td>
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
      code: {
        code: '',
        vocab: '',
        instructor: '',
        instID: '',
        limit: '',
        expiry: ''
      }
    }
  },
  methods: {
    setCode: function () {
      this.$store.dispatch('classCodesRedis', {action: 'set', codeData: this.code})
    },
    deleteCode: function () {
      this.$store.dispatch('classCodesRedis', {action: 'delete', codeData: this.code})
    },
    edit: function (item) {
      this.code = item
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
