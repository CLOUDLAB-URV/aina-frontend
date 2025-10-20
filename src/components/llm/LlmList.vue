<template>
    <DataTable :value="llms" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
        @row-click="madeClick">
        <Column field="name" header="Name" style="width: 10%"></Column>
        <Column field="spec" header="Specifications" style="width: 65%"></Column>
        <Column field="_default" header="Default" style="width: 10%"></Column>
        <Column field="vendorName" header="Vendor Name" style="width: 15%"></Column>
    </DataTable>
    <section v-if="data_selected">
        <LlmCreate :create="false" class="mt-4" :data="data_selected" />
    </section>
    {{ llms }}
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { LlmApi } from '@/apis/api';
import LlmCreate from '@/components/llm/LlmCreate.vue';

let llms = ref()
let data_selected = ref()

onMounted(async () => {
    let data = await LlmApi.listLlmsApiV1LlmsGet();
    llms.value = Object.values(data)
})

function madeClick(value: any) {
    // console.log(value.data)
    data_selected.value = value.data;
}

</script>
