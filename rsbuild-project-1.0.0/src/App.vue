<template>
  <van-config-provider :theme="isDark ? 'dark' : 'light'">
    <RouterView />
  </van-config-provider>
</template>
<script setup>
import { watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from './store/user';

const userStore = useUserStore();
const { getUserinfo } = userStore;
getUserinfo();

import { useAppStore } from './store/app';

const appStore = useAppStore();
const { isDark } = storeToRefs(appStore);
const { changeSeniorMode, getAppInfo, resetSeniorMode } = appStore;

getAppInfo();

appStore.$subscribe(() => {
  changeSeniorMode();
});

console.log(import.meta.env.MODE);
console.log(import.meta.env.DEV);

import { useWindowSize } from '@vueuse/core';
const { width, height } = useWindowSize();

watch([height, width], () => {
  resetSeniorMode();
});
</script>
