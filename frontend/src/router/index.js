import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  {path: '/', component: 'Home'},
  {path: '/home', component: 'Landing'},
  {path: '/about', component: 'About'},
  {path: '/login', component: 'Login'},
  {path: '/register', component: 'Register'},
  {path: '/account', component: 'Account'},
  {path: '/dictionary', component: 'Dictionary'},
  {path: '/transeng', component: 'TransEng'},
  {path: '/transengtest', component: 'TransEngTest'},
  {path: '/transchtest', component: 'TransChTest'},
  {path: '/typetest', component: 'TypeTest'},
  {path: '/matchtest', component: 'MatchTest'},
  {path: '*', component: 'NotFound'}
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)

export default new Router({
  routes,
  mode: 'history'
})
