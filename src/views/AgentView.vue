<template>
    <div class="grid grid-cols-6 grid-rows-4 gap-4 p-4 h-full">
        <AgentSelect />
        <ChatComponent class="col-span-5 row-span-4" />
        <UploadFiles class="row-start-2 row-end-4 col-span-1" />
        <button class="col-start-1  bg-red-400 rounded-3xl">Save</button>
        <DynamicPrompt class="col-span-full"/>
    </div>
</template>

<script setup lang="ts">
import UploadFiles from '@/components/UploadFiles.vue';
import DynamicPrompt from '@/components/DynamicPrompt.vue';
import AgentSelect from '@/components/AgentSelect.vue';
import ChatComponent from '@/components/ChatComponent.vue';
</script>