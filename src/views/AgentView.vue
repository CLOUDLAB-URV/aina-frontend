<template>
    <div class="flex gap-5 mb-4">
        <!-- <div class="w-1/6 flex flex-col gap-4">
            <UploadFiles />
            <Button icon="pi pi-save" label="Save" severity="danger" class="h-full" />
        </div> -->
        <ChatComponent class="h-full grow" @agent-changed="(n) => agent = n" />
    </div>
    <Accordion v-if="agent" class="mb-4">
        <AccordionPanel value="0">
            <AccordionHeader>Advanced Agent Settings</AccordionHeader>
            <AccordionContent>
                <DynamicPrompt :agent="agent" />
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<script setup lang="ts">
import ChatComponent from '@/components/ChatComponent.vue';
import DynamicPrompt from '@/components/DynamicPrompt.vue';
// import UploadFiles from '@/components/UploadFiles.vue';
import type { AgentResponse } from '@/models';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

import { ref } from 'vue';

let agent = ref<AgentResponse>();

</script>