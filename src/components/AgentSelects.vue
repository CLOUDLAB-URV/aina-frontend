<template>
    <div class="flex gap-2">
        <select name="agent" id="agent" v-model="agent" :key="store.data.length">
            <option disabled :value="null">Please select one</option>
            <option :value="agentItem" v-for="agentItem in store.data" :key="agentItem.id">{{ agentItem.name }}</option>
        </select>
        <div class="flex justify-between items-center gap-2">
            <ModalCreateAgent create="create" />
            <ModalCreateAgent v-if="agent" create="edit" :data="agent" />
            <ModalCreateAgent v-if="agent" create="trash" :data="agent" />
        </div>
        <!-- <ConversationSelect v-if="agent?.id" :agentId="agent?.id" v-bind="$attrs" /> -->
    </div>
</template>
<script lang="ts" setup>
import { AgApi } from '@/apis/api';
import { onMounted, ref, watch } from 'vue';
import ModalCreateAgent from './ModalCreateAgent.vue';
import { useAgentStore } from '@/stores/agent';
import type { AgentResponse } from '@/models';

const emit = defineEmits<{ 'agentSelected': [agent: AgentResponse | null] }>();

const store = useAgentStore();
let agent = ref<AgentResponse | null>(null);

onMounted(async () => {
    store.data = await AgApi.listAgentsCreatedApiV1AgentsCreatedGet();
    agent.value = null;
})

watch(() => store.data, () => {
    if (store.data.length == 0) {
        agent.value = null;
    }
})

watch(() => agent.value, () => {
    emit('agentSelected', agent.value)
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