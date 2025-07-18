<template>
  <div class="p-(--van-padding-md)">
    <van-button @click="$router.go(-1)" type="primary" block>返回</van-button>

    <van-cell-group>
      <van-field name="switch" label="开启暗黑主题">
        <template #input>
          <van-switch v-model="isDark" />
        </template>
      </van-field>
      <van-field name="switch" label="开启老年模式">
        <template #input>
          <van-switch v-model="isSeniorMode" />
        </template>
      </van-field>
    </van-cell-group>

    <pre>{{ appInfo }}</pre>
    <pre>{{ userInfo }}</pre>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import { useAppStore } from '../store/app';
const appStore = useAppStore();
const { isDark, isSeniorMode, appInfo } = storeToRefs(appStore);

import { useUserStore } from '../store/user';
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
</script>
