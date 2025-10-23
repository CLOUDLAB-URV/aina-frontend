import { ref } from "vue";
import { defineStore } from "pinia";

export const useEmbStore = defineStore("emb", () => {
  const data = ref<any[]>([]);

  const addEmb = (emb: any) => {
    data.value.find((item: any) => item.name === emb.name);
    data.value.push(emb);
  };

  const removeEmb = (emb: any) => {
    let filtered = data.value.filter(
      (element: any) => element.name !== emb.name
    );
    data.value = filtered;
  };

  const updateEmb = (emb: any) => {
    let index = data.value.findIndex((item: any) => item.name === emb.name);
    if (index !== -1) {
      data.value[index] = emb;
    }
  };

  return { data, addEmb, removeEmb, updateEmb };
});
