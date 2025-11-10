<template>
    <div class="flex flex-col gap-4">
        <div class="grow h-[70vh] overflow-y-auto rounded-lg p-4 flex flex-col gap-4 chat">
            <template v-for="(chat, index) in chat.data">
                <UserMessage :message="chat.user" :info="chat.info" />
                <AiMessage :message="chat.ai" :data_msg="[chat.liked, index]" :conv="conv" />
            </template>
            <Dialog v-model:visible="visible" header="Information Extract" :style="{ width: '40rem' }" position="right"
                :modal="true" :draggable="false">
                <template v-for="chat in chat.data">
                    <div v-html="chat.info"></div>
                </template>
            </Dialog>
        </div>
        <PromptUser @more-info="visible = true" @conversation-changed="(n) => conv = n"
            @agent-changed="(n) => agent = n" />
    </div>
</template>
<script setup lang="ts">
import PromptUser from '@/components/PromptUser.vue';
import { useChatStore } from '@/stores/chat';
import UserMessage from '@/components/UserMessage.vue';
import AiMessage from '@/components/AiMessage.vue';
import { ref, watch } from 'vue';
import type { AgentResponse, ApiSchemasConversationsConversationInfo } from '@/models';


let chat = useChatStore();
let visible = ref(false);
let conv = ref<ApiSchemasConversationsConversationInfo>();
let agent = ref<AgentResponse>();

const emit = defineEmits<{
    conversationChanged: [conv?: ApiSchemasConversationsConversationInfo];
    agentChanged: [agent?: AgentResponse];
}>();

watch(conv, (newConv) => {
    emit('conversationChanged', newConv);
});

watch(agent, (newAgent) => {
    emit('agentChanged', newAgent);
});

</script>
<style scoped>
.chat {
    background-color: var(--surface-overlay);
    border-radius: var(--content-border-radius);
    scrollbar-width: none;
}
</style>