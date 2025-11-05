<template>
    <div class="p-4 flex flex-col prompt-container">
        <section class="flex gap-2">
            <input type="text" placeholder="Type your message here..." class="w-full p-2 rounded" v-model="message" />
            <Button @click="sendMessage" icon="pi pi-send"></Button>
        </section>
        <section class="flex gap-4 items-center mt-2">
            <AgentSelects @agentSelected="(ag: AgentResponse | null) => agent = ag" />
            <ConversationSelect v-if="agent?.id" :agentId="agent?.id" @selectConv="(n: any) => conv = n" :conv="conv" />
        </section>
        <section v-if="agent?.id && conv?.id" class="flex flex-wrap gap-4 mt-2">
            <div v-for="option in SelectMode" :key="option" class="flex items-center gap-2">
                <RadioButton :value="option" :id="option" v-model="select" />
                <label :for="option">
                    {{
                        option === 'all' ? 'Search all' :
                            option === 'select' ? 'Search in files' :
                                'Disabled'
                    }}
                </label>
            </div>
        </section>
        <section>
            <MultiSelect v-if="showFiles" :options="files" optionLabel="name" optionValue="id"
                v-model="selectedFiles" />
        </section>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import AgentSelects from '@/components/AgentSelects.vue';
import type { ConversationCreate } from '@/models/index';
import type { AddConversationApiV1ConversationsPostRequest } from '@/apis/ConversationsApi';
import { useChatStore } from '@/stores/chat';
import ConversationSelect from './ConversationSelect.vue';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import MultiSelect from 'primevue/multiselect';
import { ConvApi } from '@/apis/api';
import { useConvStore } from '@/stores/conv';
import { ChatRequestToJSON, SelectMode, type AgentResponse, type ChatRequest, type FileInfo } from '@/models';
import { IndApi } from '@/apis/api';

let showFiles = ref(false);
const convStore = useConvStore();
let files = ref<FileInfo[]>([]);
let selectedFiles = ref([]);

let select = ref<SelectMode>(SelectMode.All);
let agent = ref<AgentResponse | null>(null);
let conv = ref();
let message = ref();
const controller = new AbortController();
const chatter = useChatStore()

watch(select, (newValue) => {
    console.log('Select changed to:', newValue);
    showFiles.value = newValue === 'select';
});

watch(agent, async (newAgent) => {
    console.log('Agent changed to:', newAgent);
    conv.value = null;
    if (newAgent && newAgent.indexId) {
        files.value = await IndApi.listFilesApiV1IndexIndexIdFilesGet({ indexId: newAgent.indexId });
        selectedFiles.value = [];
    }
});

async function sendMessage(event: Event) {

    if (!agent.value || !message.value)
        return;

    if (!conv.value) {
        let convCreate: ConversationCreate = {
            name: `${message.value}_conversation`,
            isPublic: false,
            agentId: agent.value.id,
        }
        let info: AddConversationApiV1ConversationsPostRequest = { conversationCreate: convCreate };
        await ConvApi.addConversationApiV1ConversationsPost(info).then((res) => {
            convStore.addConv(res);
            conv.value = res;
        });
    }

    const url = `http://localhost:8000/api/v1/chat/${agent.value.id}/${conv.value.id}`;

    event.preventDefault();

    const formData = new FormData();
    chatter.addUserChat(message.value)
    formData.append('message', message.value)

    const bodyData: ChatRequest = {
        message: message.value,
        selectedFiles: select.value === 'select' ? selectedFiles.value : undefined,
        selectMode: select.value
    };

    message.value = ""
    fetchEventSource(url, {
        method: 'POST',
        body: JSON.stringify(ChatRequestToJSON(bodyData)),
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        },
        signal: controller.signal,
        onmessage(ev: any) {
            let data = JSON.parse(ev.data)
            if (data.channel == 'chat' && data.content != "") {
                let contingut = data.content
                    .replace(/\n+/g, ' ')
                    .replace(/\*\*/g, ' ')
                    .replace(/\\/g, '')
                    .replace(/\s+/g, ' ');
                chatter.addAiChat(contingut);
            }
        }
    });
}

</script>
<style scoped>
.prompt-container,
input {
    background-color: var(--surface-overlay);
    border-radius: var(--p-inputtext-border-radius);
    border-radius: 1rem;
}

input {
    border: 1px solid var(--p-inputtext-border-color);
}
</style>