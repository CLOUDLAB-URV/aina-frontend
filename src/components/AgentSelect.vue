<template>
    <div class="flex gap-2 mt-2">
        <select name="agent" id="agent" v-model="agent" :key="store.data.length">
            <option disabled value="">Please select one</option>
            <option :value="agentItem" v-for="agentItem in store.data" :key="agentItem.id" >{{ agentItem.name }}</option>
        </select>
        <div class="flex justify-between items-center gap-2">
            <ModalCreateAgent create="create" />
            <ModalCreateAgent create="edit" :data="agent"/>
            <ModalCreateAgent create="trash" :data="agent"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { AgApi } from '@/apis/api';
import { onMounted, ref, watch } from 'vue';
import ModalCreateAgent from './ModalCreateAgent.vue';
import { useAgentStore } from '@/stores/agent';
const store = useAgentStore();
let agent = ref();

onMounted(async ()=>{
    store.data = await AgApi.listAgentsCreatedApiV1AgentsCreatedGet();
    agent.value = ""
})

watch(()=> store.data,()=>{
    if (store.data.length == 0){
        agent.value = ""
    }
})

</script>

<style scoped>
button{
    border-radius: var(--p-button-border-radius);
}
select{
 background-color: var(--p-inputtext-background);
 border-radius: var(--p-button-border-radius);
}
</style>