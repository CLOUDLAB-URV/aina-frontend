import { ref } from "vue";
import { defineStore } from "pinia";

export const useLlmStore = defineStore("llm", () => {
  const data = ref<any[]>([]);

  const addLlm = (llm: any) => {
    if (llm._default == true){
      data.value = data.value.filter(
        (llm)=>{
          if (llm._default == true){
            llm._default = false
            return llm
          }else{
            return llm
          }
        }
      )
    }
    data.value.push(llm);
  };

  const removeLlm = (llm: any) => {
    let filtered = data.value.filter(
      (element: any) => element.name !== llm.name
    );
    data.value = filtered;
  };

  const updateLlm = (llm: any) => {
    if (llm._default == true){
      data.value = data.value.filter(
        (llm)=>{
          if (llm._default == true){
            llm._default = false
            return llm
          }else{
            return llm
          }
        }
      )
    }
    let index = data.value.findIndex((item: any) => item.name === llm.name);
    if (index !== -1) {
      data.value[index] = llm;
    }
  };

  return { data, addLlm, removeLlm, updateLlm };
});
