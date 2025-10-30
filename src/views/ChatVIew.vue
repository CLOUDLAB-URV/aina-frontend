<template>
    <div class="flex">
        <div class="w-1/4 flex flex-col">
            <AgentSelect class="col-start-1" />
            <AgentSelect class="col-start-1" />
            <AgentSelect class="col-start-1" />
        </div>
        <ChatComponent class="h-full grow" />
    </div>
</template>

<script setup lang="ts">
import AgentSelect from '@/components/AgentSelects.vue';
import ChatComponent from '@/components/ChatComponent.vue';
</script>