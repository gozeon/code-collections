import Vue from 'vue'
import Vuex from 'vuex'

import modulea from './modulea'
import moduleab from './moduleab'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    modulea,
    moduleab
  }
})
