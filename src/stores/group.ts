import { ref } from "vue";
import { defineStore } from "pinia";

export const useGroupsStore = defineStore("groups", () => {
  const data = ref<any[]>([]);
  const groups = ref();

  const addGroup = (group: any) => {
    data.value.push(group);
  };

  const removeGroup = (group: any) => {
    let filtered = groups.value.filter(
      (element: any) => element.name !== group.name
    );
    groups.value = filtered;
  };

  const updateGroups = (group: any) => {
    let index = data.value.findIndex((item: any) => item.name === group.name);
    if (index !== -1) {
      data.value[index] = group;
    }
  };

  return { data, groups, addGroup, removeGroup, updateGroups };
});
