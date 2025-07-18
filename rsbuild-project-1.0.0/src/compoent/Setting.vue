<template>
  <van-floating-bubble icon="setting-o" @click="onClick" />
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const onClick = () => {
  router.push({ name: 'Debug' });
};
</script>
