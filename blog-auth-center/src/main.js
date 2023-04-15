import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js';
import store from './store/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$message = ElementUI.Message;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
