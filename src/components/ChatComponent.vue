<template>
    <div class="flex flex-col gap-4">
        <div class="grow h-[70vh] overflow-y-auto rounded-lg p-4 flex flex-col gap-4 chat">
            <div v-for="chat in chat.data">
                <div>
                    User : {{ chat.user }}
                </div>
                <div>
                    Agent : {{ chat.ai }}
                </div>
            </div>
        </div>
        <PromptUser />
    </div>
</template>
<script setup lang="ts">
import PromptUser from '@/components/PromptUser.vue';
import { useChatStore } from '@/stores/chat';

let chat = useChatStore();
</script>
<style scoped>
.chat{
    background-color: var(--surface-overlay);
    border-radius: var(--content-border-radius);
    scrollbar-width: none;
}
</style>