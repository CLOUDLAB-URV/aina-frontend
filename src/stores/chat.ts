import { ref } from "vue";
import { defineStore } from "pinia";

// 1. Definir la interfaz para cada elemento del chat
export interface ChatItem {
  user: string;
  ai: String; // Un array, por si la IA da múltiples respuestas
}

export const useChatStore = defineStore("Chat", () => {
  const data = ref<ChatItem[]>([]);

  const addUserChat = (chat: string) => {
    data.value.push({
      user: chat,
      ai: "Thinking ... ", 
    });
  };

  const addAiChat = (chat: string) => {
    if (data.value.length > 0) {
      const lastItem = data.value[data.value.length - 1];
      if (lastItem != undefined){
        if (lastItem.ai == "Thinking ... "){
          lastItem.ai = chat;
        }else{
          lastItem.ai = lastItem.ai + chat;
        }
      }
    } else {
      console.warn("Se intentó añadir una respuesta de IA, pero no hay ningún chat de usuario al que responder.");
    }
  };

  const lastThinking = () => {
    const lastItem = data.value[data.value.length - 1];
    if (lastItem != undefined){
      return (lastItem.ai == "Thinking ... ")
    }
    return false
  }

  return { data, addUserChat, addAiChat,lastThinking };
});