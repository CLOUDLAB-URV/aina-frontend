import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import HomeView from "@/views/HomeView.vue";
import { getCurrentUser } from "@/apis/getCurrentUser";
import AgentView from "@/views/AgentView.vue";
import ChatVIew from "@/views/ChatVIew.vue";
import LoginView from "@/views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: HomeView,
          beforeEnter: async (to, from) => {
            try {
              await getCurrentUser();
              return true;
            } catch (e: any) {
              return "/login";
            }
          },
        },
        {
          path: "/agent",
          name: "agent",
          component: AgentView,
          beforeEnter: async (to, from) => {
            try {
              await getCurrentUser();
              return true;
            } catch (e: any) {
              return "/login";
            }
          },
        },
        {
          path: "/chat",
          name: "chat",
          component: ChatVIew,
          beforeEnter: async (to, from) => {
            try {
              await getCurrentUser();
              return true;
            } catch (e: any) {
              return "/login";
            }
          },
        },
        {
          path: "/login",
          name: "login",
          component: LoginView,
        },
      ],
    },
  ],
});

export default router;
