<template>
    <div class="flex">
        <div class="w-1/4 flex flex-col">
            <SelectorDropdown :label="`Agent`" :options="dataProva" />
            <AgentSelect class="col-start-1" />
            <AgentSelect class="col-start-1" />
        </div>
        <ChatComponent class="h-full grow" />
    </div>
</template>

<script setup lang="ts">
import AgentSelect from '@/components/AgentSelect.vue';
import ChatComponent from '@/components/ChatComponent.vue';
import SelectorDropdown from '@/components/SelectorDropdown.vue';

const dataProva = [
    "Agent 1", "Agent2", "Agent3", "Agent4"
]
</script>