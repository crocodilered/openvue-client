import Vue from 'vue'
import Vuex from 'vuex'
import NavigationProvider from '@/libs/navigation-provider'
import TokenStorage from '@/libs/auth/token-storage'

Vue.use(Vuex)

const defaultState = {
  token: null,
  user: null,
  appMenu: null
}

const mutations = {
  setToken: (state, token) => {
    state.token = token
  },
  setUser: (state, payload) => {
    state.user = payload
  },
  setAppMenu: (state, payload) => {
    state.appMenu = payload.filter(item => item.title)
  }
}

const getters = {
  isAuthenticated: state => (state.user !== null && state.user !== undefined)
}

const actions = {
  userSignIn: ({ commit }, payload) => {
    commit('setToken', payload.token)
    commit('setUser', payload.user)
    TokenStorage.set(payload.token)
    // Install app menu
    const navigationProvider = new NavigationProvider()
    const appMenu = navigationProvider.menu(payload.user.role)
    commit('setAppMenu', appMenu)
  },
  userSignOut: ({ commit }) => {
    commit('setToken', null)
    commit('setUser', null)
    commit('setAppMenu', [])
    TokenStorage.del()
  }
}

const store = new Vuex.Store({
  state: defaultState,
  mutations,
  getters,
  actions
})

export default store
