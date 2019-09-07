<template>
  <div>
    <button v-on:click="say">say</button>
  </div>
</template>

<script>
export default {
  methods: {
    say: () =>
      import('./a')
        .then(a => console.log(1))
        .catch(e => console.log(e)),
  },
};
</script>
<style lang="less" scoped>

</style>
