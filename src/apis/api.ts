import { type Middleware } from "@/runtime.ts"; // Or where Middleware is defined
import { AuthenticationApi } from "@/apis/AuthenticationApi";

const authMiddleware: Middleware = {
  pre: async (context) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      context.init.headers = {
        ...context.init.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return context;
  },
};

export const AuthApi = new AuthenticationApi().withMiddleware(authMiddleware);
