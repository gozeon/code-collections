import Vue, { VueConstructor } from 'vue'
import <%=nameBigCamelCase%> from './components/index.vue'
import Settings from './settings'
import Actions from './actions'

const install = (Vue: VueConstructor<Vue>, options: any) => {
  Vue.component(<%=nameBigCamelCase%>.name, <%=nameBigCamelCase%>)
}

export default {
  install,
  name: <%=nameBigCamelCase%>.name,
  component: <%=nameBigCamelCase%>,
  settings: Settings,
  actions: Actions
}
