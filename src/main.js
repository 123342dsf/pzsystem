import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './api'
// import 'amfe-flexible'

//对api进行全局注册

const app= createApp(App)
//vite提供挂载实例,在实例上绑定属性
app.config.globalProperties.$api = api
//路由挂载
app.use(router)
app.mount('#app')
