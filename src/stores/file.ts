import { ref } from "vue";
import { defineStore } from "pinia";

export const useFilesStore = defineStore("files", () => {
  const data = ref<any[]>([]);

  const addFiles = (Files: any) => {
    data.value.push(Files);
  };

  const removeFiles = (Files: any) => {
    let filtered = data.value.filter(
      (element: any) => element.name !== Files.name
    );
    data.value = filtered;
  };

  const updateFiles = (Files: any) => {
    let index = data.value.findIndex((item: any) => item.name === Files.name);
    if (index !== -1) {
      data.value[index] = Files;
    }
  };

  return { data, addFiles, removeFiles, updateFiles };
});
