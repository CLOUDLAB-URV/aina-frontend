<template>
    <div class="flex gap-3">
        <select name="" id="" class="p-2" v-model="conv">
            <option disabled :value="null">Select Conversations</option>
            <option v-for="conv in convStore.data" :value="conv">{{ conv.name }}</option>
        </select>
        <div class="flex justify-between items-center gap-4">
            <ModalConv create="create" :agentId="props.agentId" />
            <ModalConv create="edit" v-if="conv" :data="conv" :agentId="props.agentId" />
            <ModalConv create="trash" v-if="conv" :data="conv" :agentId="props.agentId" @deleted=" conv = null" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ConvApi } from '@/apis/api';
import { ChApi } from '@/apis/api';
import type { ChatItem } from '@/stores/chat';
import { watch, ref } from 'vue';
import type { ListConversationsApiV1ConversationsAgentIdGetRequest } from '@/apis/ConversationsApi';
import ModalConv from '@/components/ModalConv.vue';
import { useConvStore } from '@/stores/conv';
import { useChatStore } from '@/stores/chat';

const convStore = useConvStore();
const chatStore = useChatStore();
let conv = ref();
const emit = defineEmits(['selectConv'])

const props = defineProps({
    agentId: {
        type: String,
        required: true
    },
    conv: {
        type: Object,
        required: true
    }
})

watch(() => props.agentId, async () => {
    let listAgentConv: ListConversationsApiV1ConversationsAgentIdGetRequest = {
        agentId: props.agentId
    }
    convStore.data = await ConvApi.listConversationsApiV1ConversationsAgentIdGet(listAgentConv);
    conv.value = null
}, { immediate: true })

watch(
    () => props.conv,
    () => { conv.value = props.conv },
    { immediate: true }
)

watch(
    () => conv.value,
    async () => {
        emit('selectConv', conv.value)
        if (!conv.value) {
            chatStore.data = [];
            return;
        }
        const res = await ChApi.selectConversationApiV1ChatAgentIdConversationIdSelectPost({
            agentId: props.agentId,
            conversationId: conv.value.id
        });
        if (!chatStore.lastThinking()) {
            let aux = []
            for(let i = 0; i < res.messages.length;i++){
                const message = res.messages[i]
                console.log(message?.[0])
                aux.push({
                    user: message?.[0] ?? "",
                    ai: message?.[1] ?? "",
                    info: res.retrievalMessages[i] ?? ""
                } as ChatItem)
            }
            chatStore.data = aux
        }
    }
)

</script>

<style scoped>
button {
    border-radius: var(--p-button-border-radius);
}

select {
    background-color: var(--p-inputtext-background);
    border-radius: var(--p-button-border-radius);
}
</style>