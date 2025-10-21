import { ref } from "vue";
import { defineStore } from "pinia";

export const useRankStore = defineStore("rank", () => {
  const ranks = ref<any[]>([]);

  const addRank = (rank: any) => {
    ranks.value.find((item: any) => item.name === rank.name);
    ranks.value.push(rank);
  }

  const removeRank = (rank: any) => {
    let filtered = ranks.value.filter((element: any) => element.name !== rank.name);
    ranks.value = filtered;
  }

  const updateRank = (rank: any) => {
    let index = ranks.value.findIndex((item: any) => item.name === rank.name);
    if (index !== -1) {
      ranks.value[index] = rank;
    }
  }

  return { ranks, addRank, removeRank, updateRank };
});
