import { ref } from "vue";
import { defineStore } from "pinia";

export const useIndStore = defineStore("Ind", () => {
  const ind = ref<any[]>([]);

  const addInd = (Ind: any) => {
    ind.value.push(Ind);
  };

  const removeInd = (Ind: any) => {
    let filtered = ind.value.filter(
      (element: any) => element.name !== Ind.name
    );
    ind.value = filtered;
  };

  const updateInd = (Ind: any) => {
    let index = ind.value.findIndex((item: any) => item.name === Ind.name);
    if (index !== -1) {
      ind.value[index] = Ind;
    }
  };

  return { ind, addInd, removeInd, updateInd };
});
