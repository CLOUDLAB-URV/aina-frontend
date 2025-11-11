<template>
    <div class="flex gap-2">
        <i class="pi pi-database"></i>
        <div class="flex flex-col gap-3 w-[70%]">
            <div class="p-4 bg-blue-100 rounded-lg">
                <p v-html="markdown.render(message)" class="text-black"></p>
            </div>
            <div class="flex gap-3 w-fit rounded-lg bg-blue-100">
                <button @click="sendLike(true)">
                    <i class="pi pi-thumbs-up-fill p-3 rounded-lg hover:text-green-500"
                        :class="{ 'text-green-500': props.data_msg[0] == 'true' }" />
                </button>
                <button @click="sendLike(false)">
                    <i class="pi pi-thumbs-down-fill p-3 rounded-lg hover:text-red-500"
                        :class="{ 'text-red-500': props.data_msg[0] == 'false' }" />
                </button>
                <button @click="sendLike(undefined)">
                    <i class="pi pi-plus p-3 rounded-lg hover:text-blue-500" />
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { LikeMessageApiV1ChatAgentIdConversationIdLikePostRequest } from '@/apis/ChatApi.ts'
import type { ApiSchemasConversationsConversationInfo } from '@/models';
import { useChatStore } from '@/stores/chat';
import MarkdownIt from "markdown-it";
import { ChApi } from '@/apis/api';

const props = defineProps<{
    message: string;
    data_msg: [String,Number];
    conv?: ApiSchemasConversationsConversationInfo
}>();

const markdown = new MarkdownIt();
const chatStore = useChatStore();

async function sendLike(val: boolean | undefined) {
    if (!props.conv || !props.conv.agentId) return;

    let data_like: LikeMessageApiV1ChatAgentIdConversationIdLikePostRequest = {
        agentId: props.conv.agentId.toString(),
        conversationId: props.conv.id.toString(),
        messageIndex: props.data_msg[1] as number,
        liked: val
    }

    await ChApi.likeMessageApiV1ChatAgentIdConversationIdLikePost(data_like).then(
        () => {
            chatStore.like(props.data_msg[1] as number, val)
        }
    )
}
</script>