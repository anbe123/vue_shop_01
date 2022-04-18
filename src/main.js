import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表,让蓝色撑满全屏
import './assets/css/global.css'

// axios 请求拦截器，对请求做预处理
import axios from 'axios'

// 配置请求的根路径
// axios.defaults.baseURL = 'http://testapi.solomon.com/'
axios.defaults.baseURL = 'http://172.21.170.187:8000'

//设置axios拦截器
// 通过axios 请求拦截器添加token, 保证拥有获取数据的权限
// 这个就是fastapi 中讲到的知识点(需要授权的API,必须在请求头中使用Authorization 字段提供token令牌)
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  // 在最后必须return config
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
