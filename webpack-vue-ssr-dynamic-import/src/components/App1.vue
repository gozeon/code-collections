<template>
  <div>
    <div class="bg">123</div>
    <div class="image"></div>
    <button @click="dya()">dy click</button>
    <dy></dy>
    <dy2></dy2>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {
    dy: () => import("./DY.vue")
  }
})
export default class App extends Vue {
  @Prop({ type: Object }) globalData!: any;

  async dya() {
    const { a } = await import("./a.js")
    
    a()
  }
  beforeMount() {
    // 只会在浏览器执行
    //  () => import("./DY.vue").then(m => console.log(m));
  }
  mounted() {
    console.log(this.globalData);
  }
}
</script>

<style scoped>
.bg {
  background: red;
}
.image {
  width: 100px;
  height: 100px;
  background-image: url("../assets/logo.png");
}
@media (min-resolution: 2dppx) {
  .image {
    background-image: url("../assets/logo.png");
  }
}
</style>
