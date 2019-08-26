import Vue from 'vue'
import App from './App.vue'

export default function createApp(): any {
  return new Vue({
    render: h => h(App)
  })
}

// new Vue({
//   render: h => h(App)
// }).$mount('#app')
