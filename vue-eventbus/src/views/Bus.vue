<template>
  <div class="hello">
    <rightside />
    <leftside />
  </div>
</template>

<script>
import Rightside from '@/components/RightSide.vue'
import Leftside from '@/components/LeftSide.vue'


export default {
  name: 'bus',
  components: {
    Rightside,
    Leftside
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>