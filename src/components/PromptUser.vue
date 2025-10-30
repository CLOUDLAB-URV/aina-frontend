<template>
    <div class="p-4 flex flex-col prompt-container">
        <section class="flex gap-2">
            <input type="text" placeholder="Type your message here..." class="w-full p-2 rounded" />
            <Button icon="pi pi-send"></Button>
        </section>
        <section class="flex gap-4 items-center mt-2">
            <AgentSelects />
        </section>
    </div>
</template>
<script lang="ts" setup>
import AgentSelects from '@/components/AgentSelects.vue';

</script>
<style scoped>
.prompt-container,
input {
    background-color: var(--surface-overlay);
    border-radius: var(--p-inputtext-border-radius);
    border-radius: 1rem;
}

input {
    border: 1px solid var(--p-inputtext-border-color);
}
</style>