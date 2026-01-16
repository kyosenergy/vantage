import axios from 'axios';
import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { createRouter, createWebHistory } from 'vue-router';

import App from '@/App.vue';
import routes from '@/routes';

const token = document.head.querySelector("meta[name='csrf-token']");

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

const app = createApp(App);

app.config.globalProperties.$http = axios.create();

const router = createRouter({
    history: createWebHistory(window.Vantage.base_path + '/'),
    routes: routes,
});

app.use(router);

app.mount('#vantage');
