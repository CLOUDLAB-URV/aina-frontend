<template>
    <div class="flex flex-col gap-4 ">
        <div class="grow border h-[70vh] border-gray-300 overflow-y-auto rounded-lg p-4 flex flex-col gap-4">
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