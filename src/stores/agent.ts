import { ref } from "vue";
import { defineStore } from "pinia";
import type { AgentResponse } from "@/models";

export const useAgentStore = defineStore("Agent", () => {
  const data = ref<AgentResponse[]>([]);

  const addAgent = (Agent: AgentResponse) => {
    data.value.push(Agent);
  };

  function removeAgent(id: string) {
    data.value = data.value.filter(agent => agent.id !== id)
  }

  const updateAgent = (Agent: AgentResponse) => {
    let index = data.value.findIndex((item: AgentResponse) => item.id === Agent.id);
    if (index !== -1) {
      data.value[index] = Agent;
    }
  };

  return { data, addAgent, removeAgent, updateAgent };
});
