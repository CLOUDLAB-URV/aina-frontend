import { ref } from "vue";
import { defineStore } from "pinia";

export const useLlmStore = defineStore("llm", () => {
  const llms = ref<any[]>([]);

  const addLlm = (llm: any) => {
    llms.value.find((item: any) => item.name === llm.name);
    llms.value.push(llm);
  }

  const removeLlm = (llm: any) => {
    let filtered = llms.value.filter((element: any) => element.name !== llm.name);
    llms.value = filtered;
  }

  const updateLlm = (llm: any) => {
    let index = llms.value.findIndex((item: any) => item.name === llm.name);
    if (index !== -1) {
      llms.value[index] = llm;
    }
  }

  return { llms, addLlm, removeLlm, updateLlm };
});
