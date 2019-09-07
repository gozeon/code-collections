<template>
  <main>
    <h3>Staff List</h3>

    <div v-for="(staff, i) in returnedData" v-bind:key="i">
      {{staff.name}} : {{staff.awards}} Salesman of the year Award 🎉
      <!-- <button
        v-on:click="increaseAwards(staff.id);"
      >+</button>
      <button v-on:click="decreaseAwards(staff.id);">-</button> -->
      <button v-on:click="$emit('click', { name: 'increaseAward', id: staff.id  })">+</button>
      <button v-on:click="$emit('click', { name: 'decreaseAward', id: staff.id  })">-</button>
    </div>
  </main>
</template>
<script>
import mockData from "./mockData.js";
export default {
  props: ["returnedData"]
};
// export default {
//   data() {
//     return {
//       staffList: mockData.getStaff()
//     };
//   },
//   methods: {
//     increaseAwards(id) {
//       mockData.increaseAward(id);
//       this.staffList = mockData.getStaff();
//     },
//     decreaseAwards(id) {
//       mockData.decreaseAward(id);
//       this.staffList = mockData.getStaff();
//     }
//   }
// };
</script>
<style lang="stylus" scoped></style>