<template>
    <div class="p-4 flex flex-col prompt-container">
        <section class="flex gap-2">
            <input type="text" placeholder="Type your message here..." class="w-full p-2 rounded" />
            <Button icon="pi pi-send"></Button>
        </section>
        <section>
            <AgentSelect/>
        </section>
    </div>
</template>
<script lang="ts" setup>
import AgentSelect from '@/components/AgentSelect.vue';

</script>
<style scoped>
.prompt-container,input{
    /* border: 1px solid var(--p-inputtext-border-color); */
    border :1px solid black;
    /* border-radius: var(--p-inputtext-border-radius); */
    border-radius: 1rem;
}

</style>