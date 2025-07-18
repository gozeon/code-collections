import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/feedback' },
    {
      path: '/feedback',
      name: 'FaqPage',
      component: () => import('./page/FaqPage.vue'),
    },
    {
      path: '/feedback-faq',
      name: 'FaqDetailPage',
      component: () => import('./page/FaqDetailPage.vue'),
    },
    {
      path: '/feedback-chat',
      name: 'FaqFeedbackPage',
      component: () => import('./page/FaqFeedbackPage.vue'),
    },
    {
      path: '/debug',
      name: 'Debug',
      component: () => import('./page/Debug.vue'),
    },
  ],
});

export { router };
