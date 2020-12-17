// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import 'vue2-animate/dist/vue2-animate.min.css'

Vue.config.productionTip = false

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
/* eslint-disable no-new */

Vue.mixin({
  methods: {
    getClass: function (bgc, txc, str) {
      let scheme = store.state.scheme
      let bg = ' '
      let text = ' '
      if (bgc !== null) {
        bg = 'bg-' + scheme[bgc] + ' '
      }
      if (txc !== null) {
        text = 'text-' + scheme[txc] + ' '
      }
      let classString = bg + text + str
      return classString
    }
  }
})

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
