import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import NavigationProvider from '@/libs/navigation-provider'

Vue.use(Router)

class AppRouter extends Router {
  constructor (args) {
    super(args)
    this.authFallback = null
    this.anonFallback = null
  }
  gotoDefault () {
    const currentUser = store.state.user
    if (currentUser && currentUser.role === 1) this.push('/folder1')
    if (currentUser && currentUser.role === 2) this.push('/folder2')
  }
}

const navigationProvider = new NavigationProvider()

let routerOptions = [
  { path: '/', component: 'landing' },
  { path: '/signin', component: 'signin' },
  { path: '/profile', component: 'profile' },
  { path: '/error403', component: 'error-403' },
  { path: '*', component: 'error-404' }
]

routerOptions = routerOptions.concat(navigationProvider.routes())

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/views/${route.component}.vue`)
  }
})

const router = new AppRouter({ mode: 'history', routes })

router.beforeEach((to, from, next) => {
  const requiredRoles = to.meta.roles
  const currentUser = store.state.user
  if (requiredRoles) {
    if (currentUser && requiredRoles.indexOf(currentUser.role) !== -1) {
      next()
    } else {
      next('/error403')
    }
  } else {
    next()
  }
})

export default router
