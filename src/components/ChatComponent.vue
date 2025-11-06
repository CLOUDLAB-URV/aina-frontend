<template>
    <div class="flex flex-col gap-4">
        <div class="grow h-[70vh] overflow-y-auto rounded-lg p-4 flex flex-col gap-4 chat">
            <template v-for="chat in chat.data">
                <UserMessage :message="chat.user" :info="chat.info" />
                <AiMessage :message="chat.ai"/>
            </template>
            <Dialog v-model:visible="visible" header="Information Extract" :style="{ width: '40rem' }" position="right" :modal="true" :draggable="false">
                <template v-for="chat in  chat.data">
                    <div v-html="chat.info"></div>
                </template>
            </Dialog>
        </div>
        <PromptUser @more-info="visible = true"/>
    </div>
</template>
<script setup lang="ts">
import PromptUser from '@/components/PromptUser.vue';
import { useChatStore } from '@/stores/chat';
import UserMessage from '@/components/UserMessage.vue';
import AiMessage from '@/components/AiMessage.vue';
import { ref } from 'vue';

let chat = useChatStore();
let visible = ref(false);
</script>
<style scoped>
.chat{
    background-color: var(--surface-overlay);
    border-radius: var(--content-border-radius);
    scrollbar-width: none;
}
</style>