import { ref } from "vue";
import { defineStore } from "pinia";

export const useRankStore = defineStore("rank", () => {
  const data = ref<any[]>([]);

  const addRank = (rank: any) => {
    data.value.find((item: any) => item.name === rank.name);
    data.value.push(rank);
  };

  const removeRank = (rank: any) => {
    let filtered = data.value.filter(
      (element: any) => element.name !== rank.name
    );
    data.value = filtered;
  };

  const updateRank = (rank: any) => {
    let index = data.value.findIndex((item: any) => item.name === rank.name);
    if (index !== -1) {
      data.value[index] = rank;
    }
  };

  return { data, addRank, removeRank, updateRank };
});
