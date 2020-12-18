<template>
  <div class="matchBase">
    <Match v-if="marker" v-on:resetMatch="reset($event)" :s3="s3" :friends="friends"></Match>
    <div v-else align="center">
        <h4 class="text-prime"> Reloading </h4>
        <b-icon icon="three-dots" animation="cylon" variant="prime" font-scale="6"></b-icon>
    </div>
  </div>
</template>

<script>
import Match from './Match'

export default {
  name: 'MatchBase',
  props: {
    s3: String
  },
  components: {
    Match
  },
  data () {
    return {
      marker: true,
      startTimer: null,
      friends: []
    }
  },
  methods: {
    reset: function (data) {
      console.log('RESET ACTIVE', data)
      this.friends = data.friends
      this.marker = false
      let _this = this
      _this.startTimer = setTimeout(function () {
        _this.marker = true
      }, 2000)
    }
  },
  beforeDestroy () {
    if (this.startTimer) {
      clearTimeout(this.startTimer)
      this.startTimer = null
    }
  },
  beforeMount () {
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push('login')
      return false
    }

    if (this.$store.state.userProfile.classroom === '') {
      alert('No class found')
      // this.msg = 'You must join a classroom to play Match Mode'
      // this.showAlert()
      this.$router.push('account')
      return false
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
