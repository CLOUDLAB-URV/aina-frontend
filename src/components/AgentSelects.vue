<template>
    <div class="flex gap-3">
        <Select v-model="agent" :options="store.data" optionLabel="name" placeholder="Please select an agent" />
        <div v-if="auth.signedIn && auth.role && (auth.role === Role.AgentCreator || auth.role === Role.Admin)"
            class="flex justify-between items-center gap-4">
            <ModalCreateAgent create="create" @agentCreated="(a) => agent = a" />
            <ModalCreateAgent v-if="agent" create="edit" :data="agent" />
            <ModalCreateAgent v-if="agent" create="trash" :data="agent" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { AgApi } from '@/apis/api';
import { onMounted, ref, watch } from 'vue';
import ModalCreateAgent from './ModalCreateAgent.vue';
import { useAgentStore } from '@/stores/agent';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import { Role, type AgentResponse } from '@/models';
import Select from 'primevue/select';

const emit = defineEmits<{ 'agentSelected': [agent?: AgentResponse] }>();

const store = useAgentStore();
const chatStore = useChatStore();
const auth = useAuthStore();

let agent = ref<AgentResponse>();

onMounted(async () => {
    store.data = await AgApi.listAgentsCreatedApiV1AgentsCreatedGet();
    agent.value = undefined;
    chatStore.data = [];
})

watch(store.data, () => {
    if (store.data.length == 0) {
        agent.value = undefined;
        chatStore.data = [];
    }
})

watch(agent, () => {
    emit('agentSelected', agent.value)
    console.log('Selected agent:', agent.value);
    chatStore.data = [];
})

</script>

<style scoped>
button {
    border-radius: var(--p-button-border-radius);
}

select {
    padding: 0.25rem;
    background-color: var(--p-inputtext-background);
    border-radius: var(--p-button-border-radius);
}
</style>