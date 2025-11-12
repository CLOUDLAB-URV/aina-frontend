import { ref } from "vue";
import { defineStore } from "pinia";

export const useEmbStore = defineStore("emb", () => {
  const data = ref<any[]>([]);

  const addEmb = (emb: any) => {
    console.log("IMHERE")
    if (emb._default == true){
      console.log("IMHERE2")
      data.value = data.value.filter(
        (emb)=>{
          if (emb._default == true){
            emb._default = false
            return emb
          }else{
            return emb
          }
        }
      )
    }
    data.value.push(emb);
  };

  const removeEmb = (emb: string) => {
    let filtered = data.value.filter(
      (element: any) => element.name !== emb
    );
    data.value = filtered;
  };

  const updateEmb = (emb: any) => {
    if (emb._default == true){
      data.value = data.value.filter(
        (emb)=>{
          if (emb._default == true){
            emb._default = false
            return emb
          }else{
            return emb
          }
        }
      )
    }
    let index = data.value.findIndex((item: any) => item.name === emb.name);
    if (index !== -1) {
      data.value[index] = emb;
    }
  };

  return { data, addEmb, removeEmb, updateEmb };
});
