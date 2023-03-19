import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './common/css/common.scss'

const app = createApp(App)
app.use(router)
app.use(Antd)
app.mount('#app')
