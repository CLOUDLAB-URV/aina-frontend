import { ref } from "vue";
import { defineStore } from "pinia";

// 1. Definir la interfaz para cada elemento del chat
export interface ChatItem {
  user: string;
  ai: string;
  info:String;
  liked:String;
}

export const useChatStore = defineStore("Chat", () => {
  const data = ref<ChatItem[]>([]);

  const addUserChat = (chat: string) => {
    data.value.push({
      user: chat,
      ai: "Thinking ... ",
      info:"" ,
      liked:"",
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

  const addInfoChat = (info: string) => {
    if (data.value.length > 0) {
      const lastItem = data.value[data.value.length - 1];
      if (lastItem != undefined){
        lastItem.info = lastItem.info + info;
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

  const like = (index:number,val : boolean | undefined)=>{
    if (data.value[index] !== undefined) {
      data.value[index].liked = val === undefined ? "" : `${val}`;
    }
  }

  return { data, addUserChat, addAiChat,lastThinking,addInfoChat,like};
});