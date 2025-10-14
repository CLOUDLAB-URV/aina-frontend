import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue';
import HomeView from '@/views/HomeView.vue';
import { getCurrentUser } from '@/api/getCurrentUser';
import AgentView from '@/views/AgentView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView,
          beforeEnter: async (to, from) => {
            try {
              await getCurrentUser()
              return true
            } catch (e: any) {
              return '/login'
            }
          }
        },
        {
          path: '/agent',
          name: 'agent',
          component: AgentView,
          beforeEnter: async (to, from) => {
            try {
              await getCurrentUser()
              return true
            } catch (e: any) {
              return '/login'
            }
          }
        }
      ]
    }
  ]
});

export default router;
