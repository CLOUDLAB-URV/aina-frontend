<template>
    <div class="flex gap-3">
        <Select v-model="conv" :options="convStore.data" optionLabel="name" placeholder="Select conversation" />
        <div class="flex justify-between items-center gap-4">
            <ModalConv create="create" :agentId="props.agentId" @convCreated="(c) => conv = c" />
            <ModalConv create="edit" v-if="conv" :conv="conv" :agentId="props.agentId" />
            <ModalConv create="trash" v-if="conv" :conv="conv" :agentId="props.agentId" @deleted="conv = undefined" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ConvApi } from '@/apis/api';
import { ChApi } from '@/apis/api';
import type { ChatItem } from '@/stores/chat';
import type { ApiSchemasConversationsConversationInfo } from '@/models';
import { watch, ref } from 'vue';
import type { ListConversationsApiV1ConversationsAgentIdGetRequest } from '@/apis/ConversationsApi';
import ModalConv from '@/components/ModalConv.vue';
import { useConvStore } from '@/stores/conv';
import { useChatStore } from '@/stores/chat';
import Select from 'primevue/select';

const convStore = useConvStore();
const chatStore = useChatStore();
let conv = ref<ApiSchemasConversationsConversationInfo>();
const emit = defineEmits<{
    selectConv: [conv?: ApiSchemasConversationsConversationInfo];
}>();

const props = defineProps<{
    agentId: string
    conv?: ApiSchemasConversationsConversationInfo
}>();

watch(() => props.agentId, async () => {
    let listAgentConv: ListConversationsApiV1ConversationsAgentIdGetRequest = {
        agentId: props.agentId
    }
    convStore.data = await ConvApi.listConversationsApiV1ConversationsAgentIdGet(listAgentConv);
    conv.value = undefined;
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
            for (let i = 0; i < res.messages.length; i++) {
                const message = res.messages[i]
                console.log(message?.[0])
                aux.push({
                    user: message?.[0] ?? "",
                    ai: message?.[1] ?? "",
                    info: res.retrievalMessages[i] ?? "",
                    liked: ""
                } as ChatItem)
            }

            for (let i = 0; i < res.likes.length; i++) {
                let like = res.likes[i];
                let info_like = like[0];
                const key = info_like[0];
                if (aux[key] !== undefined) {
                    aux[key].liked = like[2];
                }
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