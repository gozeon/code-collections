<template>
  <div id="app">
    
    <div>count 1: {{count}}</div>
    <div>count 2: {{count2}}</div>

    <div>toStringState1: {{toStringState1}}</div>
    <div>toStringState2: {{toStringState2}}</div>
    <hello-world></hello-world>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  computed: {
    ...mapState('modulea', ['count']),
    ...mapState('moduleab', {
       count2: 'count',
    }),
    ...mapGetters({
      toStringState1: 'modulea/toStringState',
      toStringState2: 'moduleab/toStringState'
    })
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
