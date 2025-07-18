<template>
  <div class="p-(--van-padding-md)">
    <van-skeleton title :row="9" :loading="loading">
      <div class="mb-[15px] text-(length:--van-font-size-lg)">
        {{ activeDetailFaq.title }}
      </div>
      <div v-for="item in activeDetailFaq.detail_json">
        <van-image
          v-if="item.type === 'img'"
          :src="item.content"
          width="100%"
          lazy-load
        >
          <template v-slot:loading>
            <van-loading type="spinner" size="40" />
          </template>
        </van-image>
        <div
          class="text-(length:--van-font-size-md) whitespace-pre-line"
          v-if="item.type === 'text'"
        >
          {{ item.content }}
        </div>
      </div>
    </van-skeleton>

    <div v-if="!loading" :class="$style.vote">
      <p
        class="my-[26px] text-(length:--van-font-size-sm) text-(--van-text-color-2)"
      >
        是否对您有帮助
      </p>
      <div class="mb-[15px] flex justify-around">
        <van-button
          icon="good-job-o"
          :type="vote === 1 ? 'primary' : 'default'"
          size="small"
          @click="onVote(1)"
          :disabled="disabled"
          >有用</van-button
        >
        <van-button
          class="unlike"
          icon="good-job-o"
          :type="vote === 0 ? 'primary' : 'default'"
          size="small"
          @click="onVote(0)"
          :disabled="disabled"
          >无用</van-button
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { showSuccessToast, showFailToast } from 'vant';

import { useFaqStore } from '../store/faq';
const faqStore = useFaqStore();
const { activeDetailFaq } = storeToRefs(faqStore);
const { fechFaqDetail, postVote } = faqStore;

const loading = ref(true);
const disabled = ref(false);
const vote = ref(null);

const route = useRoute();
watch(
  () => route.query.id,
  () => fechFaqDetail(route.query.id).then(() => (loading.value = false)),
  { immediate: true },
);

const onVote = async (useful) => {
  vote.value = useful;
  disabled.value = true;
  const r = await postVote({ id: route.query.id, useful });
  disabled.value = r;
  if (r) {
    showSuccessToast('反馈成功');
  } else {
    showFailToast('反馈失败，稍候重试');
  }
};
</script>
<style module>
.vote {
  :global {
    .van-button {
      border-radius: 16px;

      padding-left: var(--van-padding-md);
      padding-right: var(--van-padding-md);

      &.unlike {
        .van-icon {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
