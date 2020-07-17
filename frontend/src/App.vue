<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" class="nav-background">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand @click="goTo('home')">Vocab BC</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item @click="goTo('login')">Link</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em><b-icon-person-fill></b-icon-person-fill></em>
            </template>
            <b-dropdown-item v-if="isAuthenticated" href="#">Profile</b-dropdown-item>
            <b-dropdown-item v-if="isAuthenticated" href="#">Signout</b-dropdown-item>
            <b-dropdown-item v-if="!isAuthenticated" @click="goTo('login')">Login</b-dropdown-item>
            <b-dropdown-item v-if="!isAuthenticated" @click="goTo('register')">Create Account</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-row>
        <b-col cols="2">
        <b-card
        v-if="isAuthenticated"
          no-body
          class="m-3"
        >
          <template v-slot:header>
            <h4 class="mb-2">Work Station</h4>
          </template>

            <b-list-group flush>
              <b-list-group-item><b-icon-arrow-up></b-icon-arrow-up> &nbsp; English-Chinese</b-list-group-item>
              <b-list-group-item><b-icon-box-arrow-up-left></b-icon-box-arrow-up-left> &nbsp; Chinese-English</b-list-group-item>
              <b-list-group-item><b-icon-caret-right-square-fill></b-icon-caret-right-square-fill>&nbsp; English Listening</b-list-group-item>
              <b-list-group-item><b-icon-caret-right-square></b-icon-caret-right-square>&nbsp; Chinese Listening</b-list-group-item>
              <b-list-group-item>Games</b-list-group-item>
            </b-list-group>
                <b-card-footer>This is a footer</b-card-footer>
            </b-card>
          </b-col>

      <b-col>
        <router-view/>
      </b-col>

      <b-col cols="2" align-self="stretch">
        <b-card
          no-body
          class="m-3"
          v-if="isAuthenticated"
        >
          <template v-slot:header>
            <div class="m-2" align="center">
              <b-avatar src="https://placekitten.com/300/300" size="4rem"></b-avatar>
            </div>
            <h4 class="mb-2">Profile Dash</h4>
          </template>

            <b-list-group flush>
              <b-list-group-item @click="goTo('dictionary')">My Dictionary</b-list-group-item>
              <b-list-group-item @click="goTo('home')">Dapibus ac facilisis in</b-list-group-item>
              <b-list-group-item @click="goTo('dictionary')">Vestibulum at eros</b-list-group-item>
            </b-list-group>
                <b-card-footer>This is a footer</b-card-footer>
            </b-card>
          </b-col>
        </b-row>
      </div>
</template>

<script>
// Andre Madarang https://www.youtube.com/watch?v=Vu5QKn24uYs
import Login from './components/Login'
import Register from './components/Register'
import Landing from './components/Landing'

export default {
  name: 'app',
  components: {
    Login,
    Register,
    Landing
  },
  data () {
    return {
      auth: false
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    goTo: function (arg) {
      this.$router.push(arg)
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
  body {
    background: #EEF1F4 !important;
    font-family: 'Lato', sans-serif !important;
  }
  .nav-background {
    background: #353535;
  }
</style>
