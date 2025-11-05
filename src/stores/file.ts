import { ref } from "vue";
import { defineStore } from "pinia";
import type { FileInfo } from "@/models";

export const useFilesStore = defineStore("files", () => {
  const files = ref<FileInfo[]>([]);

  const addFiles = (file: FileInfo) => {
    files.value.push(file);
  };

  const removeFile = (fileId: string) => {
    let filtered = files.value.filter(
      (element: FileInfo) => element.id !== fileId
    );
    files.value = filtered;
  };

  const updateFiles = (Files: FileInfo) => {
    let index = files.value.findIndex(
      (item: FileInfo) => item.name === Files.name
    );
    if (index !== -1) {
      files.value[index] = Files;
    }
  };

  return { files, addFiles, removeFile, updateFiles };
});
