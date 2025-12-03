<template>
    <div class="flex gap-2">
        <i class="icon pi pi-database"></i>
        <div class="flex flex-col gap-3 md:w-[70%]">
            <div class="p-4 bg-blue-100 rounded-lg">
                <p v-html="markdown.render(message)" class="text-black"></p>
            </div>
            <div class="flex gap-2">
                <div class="flex gap-3 w-fit rounded-lg bg-blue-100">
                    <button @click="sendLike(true)">
                        <i class="pi pi-thumbs-up-fill p-3 rounded-lg hover:text-green-500"
                            :class="props.data_msg[0] == 'true' ? 'text-green-500' : 'text-black'" />
                    </button>
                    <button @click="sendLike(false)">
                        <i class="pi pi-thumbs-down-fill p-3 rounded-lg hover:text-red-500"
                            :class="props.data_msg[0] == 'false' ? 'text-red-500' : 'text-black'"
                            />
                    </button>
                    <button @click="sendLike(undefined)">
                        <i class="pi pi-plus p-3 rounded-lg hover:text-blue-500 text-black" 
                            :class="typeof(props.data_msg[0] ) == 'boolean' ? 'text-blue-500' : 'text-black'"
                        />
                    </button>
                </div>
                <div class="flex items-center rounded-lg bg-blue-100 p-3 gap-2">
                    <i class="pi pi-clock"></i>
                    <span class="font-bold text-black">{{ formatDuration(props.timestamp) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { LikeMessageApiV1ChatAgentIdConversationIdLikePostRequest } from '@/apis/ChatApi.ts'
import type { ApiSchemasConversationsConversationInfo } from '@/models';
import { formatDuration } from '@/utils/time.ts';
import { useChatStore } from '@/stores/chat';
import MarkdownIt from "markdown-it";
import { ChApi } from '@/apis/api';

const props = defineProps<{
    message: string;
    data_msg: [any,Number];
    conv?: ApiSchemasConversationsConversationInfo,
    timestamp: number
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
            console.log(val)
            chatStore.like(props.data_msg[1] as number, val)
        }
    )
}
</script>
<style scoped>
@media (max-width: 991px) {
    .icon {
        display: none;
    }
}
</style>