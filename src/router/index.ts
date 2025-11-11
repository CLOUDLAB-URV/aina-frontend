import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import { getCurrentUser } from "@/apis/getCurrentUser";
import AgentView from "@/views/AgentView.vue";
import ChatView from "@/views/ChatVIew.vue";
import LoginView from "@/views/LoginView.vue";
import GeneralSettings from "@/views/GeneralSettings.vue";
import FilesView from "@/views/FilesView.vue";
import { Role } from "@/models";

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
          meta: { requiresAuth: true },
        },
        {
          path: "/agent",
          name: "agent",
          component: AgentView,
          meta: { requiresAuth: true, roles: [Role.AgentCreator, Role.Admin] },
        },
        {
          path: "/general",
          name: "general",
          component: GeneralSettings,
          meta: { requiresAuth: true, roles: [Role.Admin] },
        },
        {
          path: "/files",
          name: "files",
          component: FilesView,
          meta: { requiresAuth: true, roles: [Role.AgentCreator, Role.Admin] },
        },
        {
          path: "/login",
          name: "login",
          component: LoginView,
          meta: { requiresAuth: false },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach(async (to) => {
  const requiresAuth = (to.meta as any)?.requiresAuth;
  if (!requiresAuth) return true;

  try {
    const user = await getCurrentUser();

    const requiredRoles = (to.meta as any)?.roles as Role[] | undefined;
    if (
      requiredRoles &&
      Array.isArray(requiredRoles) &&
      requiredRoles.length > 0
    ) {
      if (requiredRoles.includes(user.role)) return true;
      return "/login";
    }

    return true;
  } catch (e) {
    return "/login";
  }
});

export default router;
