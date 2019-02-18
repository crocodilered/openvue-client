// import '@babel/polyfill' WHY?
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from '@/app.vue'
import router from '@/router'
import store from '@/store'

import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(Vuetify)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#openlist-decoder-app')
