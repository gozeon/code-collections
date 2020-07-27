<template>
	<div>
		<img src="../assets/logo.png" />
		<Com/>
		<Com2/>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Com from './Com.vue';
import Com2 from './Com2.vue';

@Component({
	components: {
		Com,
		Com2
	}
})
export default class DY extends Vue {
}
</script>

<style scoped>
div{
  background: aqua;
}
</style>
