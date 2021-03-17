import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  {path: '/', component: 'Home'},
  {path: '/home', component: 'Landing'},
  {path: '/about', component: 'About'},
  {path: '/login', component: 'Login'},
  {path: '/register', component: 'Register'},
  {path: '/reset', component: 'Reset'},
  {path: '/resetpass', component: 'ResetPass'},
  {path: '/account', component: 'Account'},
  {path: '/help', component: 'Help'},
  {path: '/dictionary', component: 'Dictionary'},
  {path: '/inststud', component: 'InstStud'},
  {path: '/instructor', component: 'Instructor'},
  {path: '/jGrabber', component: 'JGrabber'},
  {path: '/transeng', component: 'TransEng'},
  {path: '/transengtest', component: 'TransEngTest'},
  {path: '/transchtest', component: 'TransChTest'},
  {path: '/transengmatch', component: 'TransEngMatch'},
  {path: '/transchmatch', component: 'TransChMatch'},
  {path: '/memorymatch', component: 'MemoryMatch'},
  {path: '/typetest', component: 'TypeTest'},
  {path: '/flash', component: 'Flash'},
  {path: '/match', component: 'MatchBase'},
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
