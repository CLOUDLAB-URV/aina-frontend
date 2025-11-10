import { type Middleware } from "@/runtime.ts"; // Or where Middleware is defined
import { AuthenticationApi } from "@/apis/AuthenticationApi";
import { LlmsApi } from "@/apis/LlmsApi";
import { EmbeddingsApi } from "@/apis/EmbeddingsApi";
import { RerankingsApi } from "@/apis/RerankingsApi";
import { IndexApi } from "@/apis/IndexApi";
import { AgentsApi } from "@/apis/AgentsApi";
import { ConversationsApi } from "@/apis/ConversationsApi";
import { ChatApi } from "@/apis/ChatApi";
import { ReasoningsApi } from "./ReasoningsApi";

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
export const LlmApi = new LlmsApi().withMiddleware(authMiddleware);
export const EmbApi = new EmbeddingsApi().withMiddleware(authMiddleware);
export const RankApi = new RerankingsApi().withMiddleware(authMiddleware);
export const IndApi = new IndexApi().withMiddleware(authMiddleware);
export const AgApi = new AgentsApi().withMiddleware(authMiddleware);
export const ConvApi = new ConversationsApi().withMiddleware(authMiddleware);
export const ChApi = new ChatApi().withMiddleware(authMiddleware);
export const ReasonApi = new ReasoningsApi().withMiddleware(authMiddleware);
