import { ref } from "vue";
import { defineStore } from "pinia";
import type { ApiSchemasConversationsConversationInfo } from "@/models";

export const useConvStore = defineStore("Conv", () => {
  const data = ref<ApiSchemasConversationsConversationInfo[]>([]);

  const addConv = (Conv: ApiSchemasConversationsConversationInfo) => {
    data.value.push(Conv);
  };

  const removeConv = (Conv: ApiSchemasConversationsConversationInfo) => {
    let filtered = data.value.filter((element: ApiSchemasConversationsConversationInfo) => element.id !== Conv.id);
    data.value = filtered;
  };

  const updateConv = (Conv: ApiSchemasConversationsConversationInfo) => {
    let index = data.value.findIndex((item: ApiSchemasConversationsConversationInfo) => item.id === Conv.id);
    if (index !== -1) {
      data.value[index] = Conv;
    }
  };

  return { data, addConv, removeConv, updateConv };
});
