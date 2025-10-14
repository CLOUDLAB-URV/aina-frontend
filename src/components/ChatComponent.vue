<template>
    <div class="flex flex-col h-full gap-4">
        <div class="grow-1 border border-gray-300 h-[20rem] rounded-lg p-4 overflow-y-auto flex flex-col gap-4">
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