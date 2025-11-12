import { ref } from "vue";
import { defineStore } from "pinia";

export const useRankStore = defineStore("rank", () => {
  const data = ref<any[]>([]);

  const addRank = (rank: any) => {
    if (rank._default == true){
      data.value = data.value.filter(
        (rank)=>{
          if (rank._default == true){
            rank._default = false
            return rank
          }else{
            return rank
          }
        }
      )
    }
    data.value.push(rank);
  };

  const removeRank = (name: string) => {
    let filtered = data.value.filter(
      (element: any) => element.name !== name
    );
    data.value = filtered;
  };

  const updateRank = (rank: any) => {
    if (rank._default == true){
      data.value = data.value.filter(
        (rank)=>{
          if (rank._default == true){
            rank._default = false
            return rank
          }else{
            return rank
          }
        }
      )
    }
    let index = data.value.findIndex((item: any) => item.name === rank.name);
    if (index !== -1) {
      data.value[index] = rank;
    }
  };

  return { data, addRank, removeRank, updateRank };
});
