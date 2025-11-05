import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import { getCurrentUser } from "@/apis/getCurrentUser";
import AgentView from "@/views/AgentView.vue";
import ChatView from "@/views/ChatVIew.vue";
import LoginView from "@/views/LoginView.vue";
import GeneralSettings from "@/views/GeneralSettings.vue";
import FilesView from "@/views/FilesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "/",
          name: "chat",
          component: ChatView,
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
          path: "/general",
          name: "general",
          component: GeneralSettings,
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
          path: "/files",
          name: "files",
          component: FilesView,
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
