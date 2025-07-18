import { defineStore } from 'pinia';
import { getUserInfo } from '../actions';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {},
  }),
  getters: {},
  actions: {
    getUserinfo() {
      getUserInfo().then((r) => this.$patch({ userInfo: { ...r } }));
    },
  },
});
