<template>
  <div>
    <p>Home page</p>
    <a href="" class="button is-primary">Link</a>
    <h1 class="is-small">Yes</h1>
    <p>Random number from backend: {{ randomNumber }}</p>
    <button @click="getRandomFromBackend">New random number</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      randomNumber: 0
    }
  },
  methods: {
    getRandomInt (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    getRandom () {
      this.randomNumber = this.getRandomInt(1, 100)
    },
    getRandomFromBackend () {
      console.log(window.location.href, window.location.pathname)
      let path
      let site = window.location.href.split(window.location.pathname)[0]
      if (site.includes('localhost') || site.includes('127')) {
        // console.log(site, 'yes')
        path = 'http://localhost:5000/api/random'
      } else {
        // console.log(site, 'server')
        path = site + '/api/random'
      }

      axios.get(path)
        .then(response => {
          this.randomNumber = response.data.randomNumber
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    this.getRandom()
  }
}
</script>
