<template>
  <div
    class="bg-(--van-background) px-(--van-padding-md) py-(--van-cell-vertical-padding) text-(length:--van-font-size-lg) text-(--van-text-color)"
  >
    常见问题
  </div>

  <van-skeleton class="my-(--van-padding-sm)" :row="9" :loading="loading">
    <van-cell-group v-for="item in faqList">
      <van-cell
        title-class="van-ellipsis"
        :title="item.title"
        :to="{ name: 'FaqDetailPage', query: { id: item.id } }"
        is-link
      />
    </van-cell-group>
  </van-skeleton>

  <div
    class="bg-(--van-background) px-(--van-padding-md) py-(--van-cell-vertical-padding) text-(length:--van-font-size-lg) text-(--van-text-color)"
  >
    联系客服
  </div>
  <van-cell-group>
    <van-cell
      title-class="van-ellipsis"
      title="反馈留言"
      :to="{ name: 'FaqFeedbackPage' }"
      is-link
    />
    <van-cell
      title-class="van-ellipsis"
      title="Debug"
      :to="{ name: 'Debug' }"
      is-link
    />
  </van-cell-group>

  <div
    class="bg-(--van-background) px-(--van-padding-md) py-(--van-cell-vertical-padding) text-right text-(length:--van-font-size-lg) text-(--van-text-color-2)"
  >
    举报电话: 1235478123
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useFaqStore } from '../store/faq';
const faqStore = useFaqStore();
const { faqList } = storeToRefs(faqStore);
const { fetchFaqList } = faqStore;

const loading = ref(true);

onMounted(async () => {
  await fetchFaqList();
  loading.value = false;
});
</script>

<style lang="scss" scoped>
:deep(.van-cell) {
  &:after {
    right: 0;
    left: 0;
  }
}
</style>
