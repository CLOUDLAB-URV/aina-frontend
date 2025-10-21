import { ref } from "vue";
import { defineStore } from "pinia";

export const useEmbStore = defineStore("emb", () => {
  const embs = ref<any[]>([]);

  const addEmb = (emb: any) => {
    embs.value.find((item: any) => item.name === emb.name);
    embs.value.push(emb);
  }

  const removeEmb = (emb: any) => {
    let filtered = embs.value.filter((element: any) => element.name !== emb.name);
    embs.value = filtered;
  }

  const updateEmb = (emb: any) => {
    let index = embs.value.findIndex((item: any) => item.name === emb.name);
    if (index !== -1) {
      embs.value[index] = emb;
    }
  }

  return { embs, addEmb, removeEmb, updateEmb };
});
