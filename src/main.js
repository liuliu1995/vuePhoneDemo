import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'

/**公共样式 */
import "../src/assets/css/scss/common.min.css"

/**vant组件 */
import { Icon } from 'vant';
Vue.use(Icon);

/**瀑布流 */
import waterfall from 'vue-waterfall2'
Vue.use(waterfall)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
