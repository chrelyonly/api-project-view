import './assets/main.css'

import { createApp,nextTick } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
const app = createApp(App)
//需要先安装ElementPlus的依赖
// import ElementPlus from 'element-plus'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import 'element-plus/dist/index.css'
import 'element-plus/dist/index.css'
import Avue,{findObject} from '@smallwei/avue';
import zhLocale from '@smallwei/avue/lib/locale/lang/zh'
import '@smallwei/avue/lib/index.css';
import request from '@/axios/axiosConfig.js';
import {http} from '@/api/https';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
window.$https = http;
window.$findObject = findObject;
app.use(createPinia())
app.use(router)
// app.use(ElementPlus, {
//     locale: zhCn,
// })
// 注册高亮插件 使用 v-highlight 在标签上就行
import {HighlightPlugin} from '@/util/highlightPlugin.js';
app.use(HighlightPlugin);

app.use(Avue, { locale:zhLocale,axios:request })
app.mount('#app')
