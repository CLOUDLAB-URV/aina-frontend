<template>
    <div class="p-4 flex flex-col prompt-container">
        <section class="flex gap-2">
            <input type="text" placeholder="Type your message here..." class="w-full p-2 rounded" v-model="message"/>
            <Button @click="sendMessage" icon="pi pi-send"></Button>
        </section>
        <section class="flex gap-4 items-center mt-2">
            <AgentSelects @selectConv="(n:any)=>ids = n"/>
        </section>
    </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import AgentSelects from '@/components/AgentSelects.vue';
// import { useToast } from 'primevue/usetoast';
import { useChatStore } from '@/stores/chat';

let ids = ref();
let message =ref();
const controller = new AbortController();
const chatter = useChatStore()

async function sendMessage(event: Event) {

    console.log('SendMessage');
    console.log(ids.value);

    const url = `http://localhost:8000/api/v1/chat/${ids.value.agentId}/${ids.value.convId}`;

    event.preventDefault();

    const formData = new FormData();
    chatter.addUserChat(message.value)
    formData.append('message',message.value)

    const bodyData = {
        message: message.value
    };

    fetchEventSource(url, {
        method: 'POST',
        body:JSON.stringify(bodyData) ,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        },
        signal: controller.signal,
        onmessage(ev: any) {
            let data = JSON.parse(ev.data)
            if(data.channel == 'chat' && data.content != ""){
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