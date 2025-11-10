<template>
    <div class="flex gap-5 mb-4">
        <!-- <div class="w-1/6 flex flex-col gap-4">
            <UploadFiles />
            <Button icon="pi pi-save" label="Save" severity="danger" class="h-full" />
        </div> -->
        <ChatComponent class="h-full grow" @agent-changed="(n) => agent = n" />
    </div>
    <Accordion v-if="agent" class="mb-4">
        <AccordionPanel value="0">
            <AccordionHeader>Share Agent</AccordionHeader>
            <AccordionContent>
                <AutoComplete v-model="agentUsers" multiple :selected="agentUsers" placeholder="Select Agent users"
                    class="w-full mb-4" :typeahead="false" />
                <AutoComplete v-model="agentCreators" multiple :selected="agentCreators"
                    placeholder="Select Agent creators" class="w-full" :typeahead="false" />
                <Button label="Save Sharing Settings" class="mt-4" @click="saveAgentUsersAndCreators" />
            </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
            <AccordionHeader>Advanced Agent Settings</AccordionHeader>
            <AccordionContent>
                <DynamicPrompt :agent="agent" />
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<script setup lang="ts">
import ChatComponent from '@/components/ChatComponent.vue';
import DynamicPrompt from '@/components/DynamicPrompt.vue';
// import UploadFiles from '@/components/UploadFiles.vue';
import type { AgentResponse } from '@/models';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { AgApi } from '@/apis/api';

import { ref, watch } from 'vue';
import { AutoComplete, Button } from 'primevue';

let agent = ref<AgentResponse>();

let agentUsers = ref<string[]>([]);
let agentCreators = ref<string[]>([]);

watch(agent, async (newAgent) => {
    console.log('Agent in AgentView changed:', newAgent);
    if (newAgent) {
        let res = await AgApi.getAgentUsersAndCreatorsApiV1AgentsAgentIdUsersGet({ agentId: newAgent.id });
        agentUsers.value = res.users;
        agentCreators.value = res.creators;
    } else {
        agentUsers.value = [];
        agentCreators.value = [];
    }
});

async function saveAgentUsersAndCreators() {
    if (agent.value) {
        await AgApi.updateAgentUsersAndCreatorsApiV1AgentsAgentIdUsersPost({
            agentId: agent.value.id,
            bodyUpdateAgentUsersAndCreatorsApiV1AgentsAgentIdUsersPost: {
                users: agentUsers.value,
                creators: agentCreators.value
            }
        });
    }
}

</script>