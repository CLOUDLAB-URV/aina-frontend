<template>
    <div class="flex gap-5 mb-4">
        <!-- <div class="w-1/6 flex flex-col gap-4">
            <UploadFiles />
            <Button icon="pi pi-save" label="Save" severity="danger" class="h-full" />
        </div> -->
        <ChatComponent class="h-full grow" />
    </div>
    <DynamicPrompt />
</template>

<script setup lang="ts">
import ChatComponent from '@/components/ChatComponent.vue';
import DynamicPrompt from '@/components/DynamicPrompt.vue';
// import UploadFiles from '@/components/UploadFiles.vue';
</script>