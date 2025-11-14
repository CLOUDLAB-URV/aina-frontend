import { ref } from "vue";
import { defineStore } from "pinia";
import type { TableIndex } from "@/components/index/IndkList.vue";

export const useIndStore = defineStore("Ind", () => {
  const indices = ref<TableIndex[]>([]);

  const addInd = (ind: TableIndex) => {
    indices.value.push(ind);
  };

  const removeInd = (id: string) => {
    let filtered = indices.value.filter(
      (element: TableIndex) => element.id !== id
    );
    indices.value = filtered;
  };

  const updateInd = (ind: TableIndex) => {
    let index = indices.value.findIndex((item: any) => item.id === ind.id);
    if (index != -1) {
      indices.value[index] = ind;
    }
  };

  return { ind: indices, addInd, removeInd, updateInd };
});
