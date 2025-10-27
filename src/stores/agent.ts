import { ref } from "vue";
import { defineStore } from "pinia";

export const useAgentStore = defineStore("Agent", () => {
  const data = ref<any[]>([]);

  const addAgent = (Agent: any) => {
    data.value.push(Agent);
  };

  function removeAgent(id: string) {
    data.value = data.value.filter(agent => agent.id !== id)
  }

  const updateAgent = (Agent: any) => {
    let index = data.value.findIndex((item: any) => item.id === Agent.id);
    if (index !== -1) {
      data.value[index] = Agent;
    }
  };

  return { data, addAgent, removeAgent, updateAgent };
});
