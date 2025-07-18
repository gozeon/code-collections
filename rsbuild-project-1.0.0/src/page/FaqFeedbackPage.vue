<template>
  <div
    class="flex h-[var(--my-height,100dvh)] flex-col"
    :style="focused ? { '--my-height': height + 'px' } : {}"
  >
    <div
      v-if="banner.status == 1"
      class="shrink-0 bg-(--van-primary-color) px-(--van-padding-sm) py-(--van-padding-xs) text-(length:--van-font-size-md) text-(--van-white)"
      v-html="banner.text"
    ></div>

    <div class="flex-1 overflow-y-auto px-(--van-padding-sm)">
      <van-pull-refresh
        v-model="dataLoading"
        @refresh="onRefresh"
        :disabled="finished"
      >
        <div ref="listRef" style="min-height: 70vh">
          <Message
            v-for="item in messageList"
            :message="item"
            @previewImage="onPreviewImage(item)"
          ></Message>
          <div ref="bottomRef" class="p-(--van-padding-md)" />
        </div>
      </van-pull-refresh>
    </div>
    <div
      class="van-hairline--top van-safe-area-bottom flex items-center justify-between bg-(--van-background-3)"
    >
      <div class="flex flex-1 items-center justify-end py-[10px] pl-[20px]">
        <input
          ref="inputRef"
          class="w-full rounded-[18px] bg-(--van-background) px-[18px] py-[8px] !text-(length:--van-font-size-md) outline-0"
          type="text"
          name="q"
          v-model="text"
          placeholder="您要反馈些什么内容呢"
          enterkeyhint="send"
          @keydown.enter.prevent="onSend"
        />
      </div>
      <div
        class="flex h-full w-[65px] shrink-0 items-center justify-center"
        @click="onClick"
      >
        <img class="h-[25px] w-[25px]" src="../assets/add.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  cloneDeep,
  slice,
  reverse,
  delay,
  filter,
  map,
  indexOf,
  size,
  uniqueId,
  throttle,
} from 'lodash';
import dayjs from 'dayjs';
import {
  showToast,
  showLoadingToast,
  closeToast,
  showImagePreview,
} from 'vant';
import {
  onMounted,
  ref,
  nextTick,
  computed,
  onBeforeUnmount,
  shallowRef,
  watch,
  watchEffect,
  useTemplateRef,
} from 'vue';
import { storeToRefs } from 'pinia';
import imagesLoadRaw from 'imagesloaded';
const ImagesLoaded = imagesLoadRaw.default || imagesLoadRaw;
import { useWindowSize, useFocus, useIntersectionObserver } from '@vueuse/core';

import { isImage, previewImageUrl, sleep } from '../helper';
import { useFaqStore } from '../store/faq';
import Message from '../compoent/Message.vue';
const faqStore = useFaqStore();
const { banner, chatMessageList, chatMessage } = storeToRefs(faqStore);
const { fetchBanner, fetchChatMessage, postMessage, fetchImage } = faqStore;

const { height } = useWindowSize({ type: 'visual' });

const messageList = ref([]);
const page = ref(1);
const loading = ref(true);
const dataLoading = ref(false);
const bottomRef = useTemplateRef('bottomRef');
const listRef = shallowRef();
const inputRef = shallowRef();
const text = ref('');
const finished = ref(true);

const { focused } = useFocus(inputRef);
watchEffect(() => {
  if (focused.value) {
    delay(async () => {
      window.scroll(0, 0);
      await sleep(150);
      scrollBottom();
    }, 101);
  }
});

const imageList = computed(() =>
  map(
    filter(messageList.value, (o) => o.isImage),
    'message',
  ),
);

const paginate = (arr, page = 1, pageSize = 6) => {
  const reversed = reverse(cloneDeep(arr));
  const result = reverse(
    slice(reversed, (page - 1) * pageSize, page * pageSize),
  );
  finished.value = size(arr) == 0 || size(result) < pageSize;
  return result;
};

const getData = () => {
  messageList.value = [
    ...paginate(chatMessageList.value, page.value),
    ...messageList.value,
  ];
  page.value += 1;
  dataLoading.value = false;
};

const onRefresh = () => {
  delay(() => getData(), 300);
};

const scrollBottom = (smooth = true) => {
  nextTick(() => {
    bottomRef.value?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  });
  // const {stop} = useIntersectionObserver(bottomRef, ([entry], observerElement) => {
  //   showToast(entry?.isIntersecting ? '可见' : '不可见')
  //   console.log(entry?.isIntersecting)
  //   if(entry?.isIntersecting) {
  //     stop()
  //   }
  //   bottomRef.value?.scrollIntoView({ behavior: "smooth"});
  // },)
};

const onPreviewImage = (message) => {
  if (message.isImage) {
    showImagePreview({
      images: imageList.value,
      startPosition: indexOf(imageList.value, message.message),
    });
  }
};

const doSend = async () => {
  if (size(text.value) < 1) {
    showToast('请输入聊天内容');
    return;
  }
  if (size(text.value) > 500) {
    showToast('超过字数限制');

    return;
  }
  if (!navigator.onLine) {
    showToast('网络异常，请稍后再试');
    return;
  }

  const message = text.value;
  text.value = '';

  if (
    document.activeElement.tagName === 'INPUT' ||
    document.activeElement.tagName === 'TEXTAREA'
  ) {
    document.activeElement.blur(); // 收起键盘
  }

  await doSendMessage(message);
};
const onSend = throttle(() => doSend(), 800, {
  leading: true,
  trailing: false,
});

const fakeMessage = ({ isAdmin, message, time, sn }) => {
  return {
    message,
    isAdmin,
    isImage: isImage(message),
    previewImageUrl: previewImageUrl(message),
    timeText: dayjs(time ?? dayjs()).format('YYYY年MM月DD日 HH:mm:ss'),
    sn: sn ?? uniqueId('fake_'),
  };
};

const appendMessage = (message) => {
  messageList.value = [
    ...filter(messageList.value, (o) => o.sn !== 'auto'),
    message,
  ];
};

const onClick = async () => {
  const message = fetchImage();
  if (size(message) > 0) {
    await doSendMessage(message);
  }
};

const doSendMessage = async (message) => {
  // showLoadingToast({
  //   duration: 0,
  //   forbidClick: true,
  // });

  const r = await postMessage({ message });

  // closeToast();

  if (r) {
    appendMessage(fakeMessage({ isAdmin: false, message }));
    appendMessage(
      fakeMessage({
        isAdmin: true,
        message: '反馈已收到，我们会及时给您回复，请您耐心等待',
        sn: 'auto',
      }),
    );
  }
  scrollBottom();

  return r;
};

onMounted(async () => {
  await fetchBanner();
  await fetchChatMessage();

  await getData();
  const { isReply } = chatMessage.value;

  if (size(messageList.value) > 0 && isReply == 1) {
    appendMessage(
      fakeMessage({
        isAdmin: true,
        message: '反馈已收到，我们会及时给您回复，请您耐心等待',
        sn: 'auto',
      }),
    );
  }

  await scrollBottom(false);

  ImagesLoaded(listRef.value, () => {
    scrollBottom(false);
  });

  loading.value = false;
});

onBeforeUnmount(() => {
  closeToast();
});
</script>
