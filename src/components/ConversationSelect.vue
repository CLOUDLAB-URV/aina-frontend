<template>
    <select name="" id="" class="p-2" v-model="conv">
        <option disabled :value="null">Select Conversations</option>
        <option v-for="conv in convStore.data" :value="conv">{{ conv.name }}</option>
    </select>
    <ModalConv create="create" :agentId="props.agentId" />
    <ModalConv create="edit" :data="conv" :agentId="props.agentId" />
    <ModalConv create="trash" :data="conv" :agentId="props.agentId" />
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
    }
})


watch(() => props.agentId, async () => {
    let listAgentConv: ListConversationsApiV1ConversationsAgentIdGetRequest = {
        agentId: props.agentId
    }
    convStore.data = await ConvApi.listConversationsApiV1ConversationsAgentIdGet(listAgentConv);
    conv.value = ""
}, { immediate: true })

watch(
    () => conv.value,
    async () => {
        emit('selectConv', conv.value)
        const res = await ChApi.selectConversationApiV1ChatAgentIdConversationIdSelectPost({
            agentId: props.agentId,
            conversationId: conv.value.id
        });
        chatStore.data = res.messages.map(v => {
            return {
                user: v[0],
                ai: v[1],
            } as ChatItem;
        });
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