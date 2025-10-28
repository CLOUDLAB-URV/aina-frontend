<template>
    <div class="flex flex-col gap-4">
        <div class="grow h-[70vh] overflow-y-auto rounded-lg p-4 flex flex-col gap-4 chat">
            <UserMessage :message="`How much is 2+2 ?`" />
            <AiMessage :message="`I don't know.`" />
            <UserMessage :message="`How much is 2+2 ?`" />
            <AiMessage :message="`I don't know.`" />
            <UserMessage :message="`How much is 2+2 ?`" />
            <AiMessage :message="`I don't know.`" />
            <UserMessage :message="`How much is 2+2 ?`" />
            <AiMessage :message="`I don't know.`" />
            <UserMessage :message="`How much is 2+2 ?`" />
            <AiMessage :message="`I don't know.`" />
            <AiMessage :message="`I don't know.`" />
            <UserMessage :message="`How much is 2+2 ?`" />
            <AiMessage :message="`I don't know.`" />
            <UserMessage :message="`How much is 2+2 ?`" />
            <AiMessage :message="`I don't know.`" />
        </div>
        <PromptUser />
    </div>
</template>
<script setup lang="ts">
import PromptUser from '@/components/PromptUser.vue';
import AiMessage from './AiMessage.vue';
import UserMessage from './UserMessage.vue';
</script>
<style scoped>
.chat{
    background-color: var(--surface-overlay);
    border-radius: var(--content-border-radius);
    scrollbar-width: none;
}
</style>