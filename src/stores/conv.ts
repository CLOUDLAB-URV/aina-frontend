import { ref } from "vue";
import { defineStore } from "pinia";

export const useConvStore = defineStore("Conv", () => {
  const data = ref<any[]>([]);

  const addConv = (Conv: any) => {
    data.value.push(Conv);
  };

  const removeConv = (Conv: any) => {
    let filtered = data.value.filter((element: any) => element.id !== Conv.id);
    data.value = filtered;
  };

  const updateConv = (Conv: any) => {
    let index = data.value.findIndex((item: any) => item.id === Conv.id);
    if (index !== -1) {
      data.value[index] = Conv;
    }
  };

  return { data, addConv, removeConv, updateConv };
});
