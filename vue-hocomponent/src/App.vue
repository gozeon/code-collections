<template>
  <div id="app">
    <CompaniesComponent v-on:click="onEventHappen"/>
    <StaffComponent v-on:click="onEventHappen"/>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->

    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Staff from './components/Staff.vue'
import Companies from './components/Companies.vue'
import HoComponent from './components/HoComponent.js'
import sourceData from "./components/mockData.js";

const CompaniesComponent = HoComponent(Companies, mockData => mockData.getCompanies())
const StaffComponent = HoComponent(Staff, mockData => mockData.getStaff())

export default {
  name: 'app',
  components: {
    HelloWorld,
    CompaniesComponent,
    StaffComponent
  },
  methods: {
    onEventHappen(value){
      let setFunction = sourceData[value.name];
      setFunction(value.id);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
