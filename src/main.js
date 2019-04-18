// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'swiper/dist/css/swiper.min.css'
import 'animate.css'
import '@/css/main.stylus'
import VueAxios from 'vue-axios'
import Axios from 'Axios'
import VBts from 'v-bts'

Vue.use(VueAxios, Axios)
Vue.use(BootstrapVue)
Vue.use(VBts)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
