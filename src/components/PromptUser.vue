<template>
    <div class="p-4 flex flex-col prompt-container">
        <section class="flex gap-2">
            <input type="text" placeholder="Type your message here..." class="w-full p-2 rounded" v-model="message" />
            <Button @click="sendMessage" icon="pi pi-send"></Button>
        </section>
        <section class="flex gap-4 items-center mt-2">
            <AgentSelects @agentSelected="(ag: AgentResponse | null) => agent = ag" />
            <ConversationSelect v-if="agent?.id" :agentId="agent?.id" @selectConv="(n: any) => conv = n" />
        </section>
        <section v-if="agent?.id && conv?.id" class="flex flex-wrap gap-4 mt-2">
            <div class="flex items-center gap-2">
                <RadioButton value="all" id="all" v-model="select" />
                <label for="all">Search all</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton value="select" id="select" v-model="select" />
                <label for="select">Search in files</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton value="disabled" id="disabled" v-model="select" />
                <label for="disabled">Disabled</label>
            </div>
        </section>
        <section>
            <MultiSelect v-if="showFiles" :options="files" v-model="selectedFiles" />
        </section>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import AgentSelects from '@/components/AgentSelects.vue';
// import { useToast } from 'primevue/usetoast';
import { useChatStore } from '@/stores/chat';
import ConversationSelect from './ConversationSelect.vue';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import MultiSelect from 'primevue/multiselect';
import type { AgentResponse, FileInfo } from '@/models';

let showFiles = ref(false);

let files = ref<FileInfo[]>([]);

let selectedFiles = ref([]);

let select = ref('all');
let agent = ref<AgentResponse | null>(null);
let conv = ref();
let ids = ref();
let message = ref();
const controller = new AbortController();
const chatter = useChatStore()

watch(select, (newValue) => {
    console.log('Select changed to:', newValue);
    showFiles.value = newValue === 'select';
});

watch(agent, (newAgent) => {
    console.log('Agent changed to:', newAgent);
    conv.value = null;
    if (newAgent) {
        files.value = [];
        selectedFiles.value = [];
    }
});


async function sendMessage(event: Event) {

    console.log('SendMessage');
    console.log(ids.value);

    if (!agent.value || !conv.value)
        return;

    const url = `http://localhost:8000/api/v1/chat/${agent.value.id}/${conv.value.id}`;

    event.preventDefault();

    const formData = new FormData();
    chatter.addUserChat(message.value)
    formData.append('message', message.value)

    const bodyData = {
        message: message.value
    };

    fetchEventSource(url, {
        method: 'POST',
        body: JSON.stringify(bodyData),
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