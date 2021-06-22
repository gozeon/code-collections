<template>
  <div>
		dy 2
		<Com2 />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Com2 from './Component2.vue';

@Component({
	components: {
		Com2
	}
})
export default class DY extends Vue {
}
</script>

<style scoped>
div{
  background: rgb(34, 255, 0);
}
</style>
