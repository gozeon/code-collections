<template>
  <div class="hello">
    <h1>count 1</h1>
    <button @click="increment1(1)"> +1</button>
    <button @click="incrementAction1(5)"> +5</button>


    <h1>count 2</h1>
    <button @click="increment2(1)">+1</button>
    <button @click="incrementAction2(5)">+5</button>
  </div>
</template>

<script>
import { mapMutations, mapActions} from 'vuex'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    ...mapMutations({
      increment1: 'modulea/increment',
      increment2: 'moduleab/increment',
    }),
    ...mapActions({
      incrementAction1: 'modulea/incrementAction',
      incrementAction2: 'moduleab/incrementAction',
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
