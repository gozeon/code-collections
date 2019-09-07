<template>
  <main>
    <h3>Paper Companies</h3>

    <div v-for="(companies, i) in returnedData" v-bind:key="i">
      {{ companies.name }} - {{ companies.net }}
      <!-- <button v-on:click="setWorth(id);">Set Company Value</button> -->
      <button v-on:click="$emit('click', { name: 'setNetWorth', id: companies.id })">Set Company Value</button>
    </div>
  </main>
</template>

<script>
import mockData from "./mockData.js";
export default {
    props: ["returnedData"]
}
// export default {
//   data() {
//     return {
//       companies: mockData.getCompanies()
//     };
//   },
//   methods: {
//     setWorth(id) {
//       mockData.setNetWorth(id);
//       this.companies = mockData.getCompanies();
//     }
//   }
// };
</script>