import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import AutoImport from 'unplugin-auto-import/rspack';
import Components from 'unplugin-vue-components/rspack';
import { VantResolver } from '@vant/auto-import-resolver';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  dev: {
    hmr: true,
    liveReload: true,
    client: {
      host: '0.0.0.0',
    },

    watchFiles: {
      type: 'reload-server',
      paths: 'src/**/*',
      options: {
        usePolling: true,
      },
    },
  },
  html: {
    template: './public/index.html',
  },
  plugins: [pluginVue(), pluginSass()],
  tools: {
    rspack: {
      plugins: [
        AutoImport({
          resolvers: [VantResolver()],
        }),
        Components({
          resolvers: [VantResolver()],
        }),
      ],
    },
  },
  source: {
    transformImport: [
      {
        libraryName: 'lodash',
        customName: 'lodash/{{ member }}',
      },
    ],
  },
  output: {
    assetPrefix: './',
    // polyfill: 'usage',
  },
  performance: {
    buildCache: true,
  },
});
