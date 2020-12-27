import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ApiService from "@/common/api.service";
import GameHub from "@/hubs/gameHub";
import VueCookies from "vue-cookies";

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(GameHub)
Vue.use(VueCookies);

ApiService.init()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
