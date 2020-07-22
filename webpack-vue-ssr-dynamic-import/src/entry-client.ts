import Vue from 'vue'

import App from './components/App1.vue'

Vue.component('dy2', () => import('./components/DY2.vue'))

function createApp(context: any): any {
  return new Vue({
    render: h => h(App, { props: { globalData: context } }),
  })
}

const a = () => new Promise(() =>{})
a()

createApp({ pageData: (<any>window).__PAGE_DATA__ }).$mount('#app')
