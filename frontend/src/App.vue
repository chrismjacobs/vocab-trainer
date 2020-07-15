<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" class="nav-background">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand href="#">Vocab BC</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item href="/login">Link</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em><b-icon-person-fill></b-icon-person-fill></em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Signout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-row>
        <b-col cols="2">
          <b-container class="border-right border-warning d-sm-none d-md-block h-100">
            <b-nav vertical class="w-25 h-100">
              <b-nav-item active>Active</b-nav-item>
              <b-nav-item>Link</b-nav-item>
              <b-nav-item>Another Link</b-nav-item>
            </b-nav>
          </b-container>
      </b-col>
      <b-col><router-view/></b-col>
      <b-col cols="2">

      </b-col>
    </b-row>
  </div>
</template>

<script>
// Andre Madarang https://www.youtube.com/watch?v=Vu5QKn24uYs
import master from './assets/json/PVQCmaster.json'
console.log(master)
export default {
  name: 'app',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
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
