<template>
  <div>
    <div
      class="my-[16px] text-center text-(length:--van-font-size-sm) text-(--van-gray-5)"
    >
      {{ message.timeText }}
    </div>

    <div class="flex gap-[5px]">
      <div class="w-[24px] shrink-0">
        <img
          v-if="message.isAdmin"
          class="h-[24px] w-[24px]"
          src="../assets/admin.png"
          alt=""
        />
      </div>
      <div class="flex flex-1 flex-col gap-[2px]">
        <div
          class="text-(length:--van-font-size-xs) text-(--van-gray-5)"
          :class="{ 'text-right': !message.isAdmin }"
        >
          {{ message.isAdmin ? '万视达客服' : '我' }}
        </div>

        <div class="flex w-full" :class="{ 'justify-end': !message.isAdmin }">
          <van-image
            v-if="message.isImage"
            width="50vw"
            :src="message.previewImageUrl"
            lazy-load
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <div
            v-else
            class="inline-block rounded-[10px] p-[9px] text-(length:--van-font-size-lg) break-all"
            :class="[
              message.isAdmin
                ? 'rounded-tl-[3px] bg-(--van-active-color)'
                : 'rounded-tr-[3px] bg-(--van-primary-color) text-(--van-white)',
            ]"
            v-html="message.message"
          ></div>
        </div>
      </div>
      <div class="w-[24px] shrink-0">
        <img
          v-if="!message.isAdmin"
          class="h-[24px] w-[24px]"
          src="../assets/user.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    isAdmin: Boolean,
    isImage: Boolean,
    html: String,
    identity: String,
    message: String,
    time: String,
    sn: Number,
  },
});

const emit = defineEmits(['previewImage']);
console.log(import.meta.url);
const onImageClick = (url) => emit('previewImage', url);
</script>
