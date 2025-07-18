import { defineStore } from 'pinia';
import { getAppInfo } from '../actions';

let originalFontSize;

export const useAppStore = defineStore('app', {
  state: () => ({
    isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    isSeniorMode: false,
    appInfo: {},
  }),
  getters: {},
  actions: {
    toggleDark() {
      this.isDark = !this.isDark;
    },
    changeSeniorMode() {
      const html = document.documentElement;

      // 首次记录默认字体大小
      if (!originalFontSize) {
        originalFontSize = getComputedStyle(html).fontSize;
      }

      if (this.isSeniorMode) {
        const baseSize = parseFloat(originalFontSize);
        html.style.fontSize = baseSize * 1.5 + 'px';
      } else {
        if (originalFontSize) {
          html.style.fontSize = originalFontSize;
        }
      }
    },
    resetSeniorMode() {
      originalFontSize = null;
      this.$patch({ isSeniorMode: this.isSeniorMode });
    },

    getAppInfo() {
      getAppInfo().then((r) => this.$patch({ appInfo: { ...r } }));
    },
  },
});
