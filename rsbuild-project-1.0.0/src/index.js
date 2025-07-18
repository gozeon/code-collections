import 'amfe-flexible';

import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import 'vant/es/image-preview/style';
import 'vant/es/toast/style';
import { router } from './router';
import { createPinia } from 'pinia';
import { Lazyload } from 'vant';

createApp(App).use(createPinia()).use(router).use(Lazyload).mount('#root');
