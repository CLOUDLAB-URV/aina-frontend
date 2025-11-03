import { ref } from "vue";
import { defineStore } from "pinia";

export const useFilesStore = defineStore("files", () => {
  const data = ref<any[]>([]);
  const files = ref();

  const addFiles = (Files: any) => {
    data.value.push(Files);
  };

  const removeFiles = (file: any) => {
    let filtered = files.value.filter(
      (element: any) => element.name !== file
    );
    files.value = filtered;
  };

  const updateFiles = (Files: any) => {
    let index = data.value.findIndex((item: any) => item.name === Files.name);
    if (index !== -1) {
      data.value[index] = Files;
    }
  };

  return { data, files, addFiles, removeFiles, updateFiles };
});
