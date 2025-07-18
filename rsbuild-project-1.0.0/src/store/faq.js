import { defineStore } from 'pinia';
import { get, map, assign, pick } from 'lodash';
import dayjs from 'dayjs';

import { useUserStore } from './user';
import { requestPost, selectImage } from '../actions';
import { isImage, previewImageUrl } from '../helper';

export const useFaqStore = defineStore('faq', {
  state: () => ({
    faqList: [],
    activeFaq: {},
    banner: {},
    chatMessage: {},
  }),
  getters: {
    activeDetailFaq: (state) => {
      let detail_json = null;

      try {
        if (state.activeFaq?.detail) {
          detail_json = JSON.parse(state.activeFaq.detail);
        }
      } catch (e) {
        console.warn('解析失败', e);
      }
      return {
        ...state.activeFaq,
        detail_json: detail_json,
      };
    },
    chatMessageList: (state) => {
      return map(get(state, 'chatMessage.messages', []), (o) =>
        assign({}, o, {
          isAdmin: get(o, 'identity') === 'admin',
          isImage: isImage(get(o, 'message')),
          previewImageUrl: previewImageUrl(get(o, 'message')),
          timeText: dayjs(get(o, 'time')).format('YYYY年MM月DD日 HH:mm:ss'),
        }),
      );
    },
  },
  actions: {
    async fetchFaqList() {
      const r = await requestPost({ url: ''});
      console.log('🚀 ~ fetchFaqList ~ r:', r);

      this.faqList = get(r, 'value.faqList', []);
    },
    async fechFaqDetail(id) {
      const r = await requestPost({
        url: '',
        paramsJson: { id },
      });
      console.log('🚀 ~ fechFaqDetail ~ r:', r);

      this.activeFaq = get(r, 'value.detail', {});
    },
    async fetchBanner() {
      const r = await requestPost({ url: ''});
      console.log('🚀 ~ fetchBanner ~ r:', r);

      this.banner = get(r, 'value.data', {});
    },

    async fetchChatMessage() {
      const userStore = useUserStore();
      const { userInfo } = userStore;
      const r = await requestPost({
        url: '',
        paramsJson: { ...userInfo },
      });
      console.log('🚀 ~ fetchChatMessage ~ r:', r);

      this.chatMessage = get(r, 'value.data', {});
    },

    async postVote({ id, useful }) {
      const userStore = useUserStore();
      const { userInfo } = userStore;
      const r = await requestPost({
        url: '',
        paramsJson: {
          ...pick(userInfo, ['userId', 'deviceId']),
          versionInfo: JSON.stringify(
            pick(userInfo, ['platform', 'major', 'buildVersion']),
          ),
          id,
          useful,
        },
      });
      console.log('🚀 ~ postVote ~ r:', r);

      return get(r, 'value.code') == 200;
    },

    async postMessage({ message }) {
      const r = await requestPost({
        url: '',
        paramsJson: { message },
      });
      console.log('🚀 ~ postMessage ~ r:', r);

      return get(r, 'value.code') == 200;
    },

    async fetchImage() {
      return await selectImage();
    },
  },
});
