<template>
    <select name="" id="" class="p-2" v-model="conv">
        <option disabled :value="null">Select Conversations</option>
        <option v-for="conv in convStore.data" :value="conv">{{ conv.name }}</option>
    </select>
    <ModalConv create="create" :agentId="props.agentId" />
    <ModalConv create="edit" :data="conv" :agentId="props.agentId" />
    <ModalConv create="trash" :data="conv" :agentId="props.agentId" />
</template>

<script setup lang="ts">
import { ConvApi } from '@/apis/api';
import { watch, ref, onMounted } from 'vue';
import type { ListConversationsApiV1ConversationsAgentIdGetRequest } from '@/apis/ConversationsApi';
import ModalConv from '@/components/ModalConv.vue';
import { useConvStore } from '@/stores/conv';

const convStore = useConvStore();
let conv = ref();

const props = defineProps({
    agentId: {
        type: String,
        required: true
    }
})

onMounted(async () => {
    let listAgentConv: ListConversationsApiV1ConversationsAgentIdGetRequest = {
        agentId: props.agentId
    }
    convStore.data = await ConvApi.listConversationsApiV1ConversationsAgentIdGet(listAgentConv);
    conv.value = null
})

watch(() => props.agentId, async () => {
    let listAgentConv: ListConversationsApiV1ConversationsAgentIdGetRequest = {
        agentId: props.agentId
    }
    convStore.data = await ConvApi.listConversationsApiV1ConversationsAgentIdGet(listAgentConv);
    conv.value = null
})


</script>

<style scoped>
button {
    border-radius: var(--p-button-border-radius);
}

select {
    background-color: var(--p-inputtext-background);
    border-radius: var(--p-button-border-radius);
}
</style>