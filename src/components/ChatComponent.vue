<template>
    <div class="flex flex-col gap-4">
        <div class="grow h-[70vh] overflow-y-auto rounded-lg p-4 flex flex-col gap-4 chat">
            <template v-for="chat in chat.data">
                <UserMessage :message="chat.user" />
                <AiMessage :message="chat.ai"/>
            </template>
        </div>
        <PromptUser />
    </div>
</template>
<script setup lang="ts">
import PromptUser from '@/components/PromptUser.vue';
import { useChatStore } from '@/stores/chat';
import UserMessage from '@/components/UserMessage.vue';
import AiMessage from '@/components/AiMessage.vue';

let chat = useChatStore();
</script>
<style scoped>
.chat{
    background-color: var(--surface-overlay);
    border-radius: var(--content-border-radius);
    scrollbar-width: none;
}
</style>