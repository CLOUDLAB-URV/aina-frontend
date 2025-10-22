<template>
    <DataTable :value="IndStore.ind" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" stripedRows
        tableStyle="min-width: 50rem" @row-click="madeClick">
        <Column field="id" header="Id" style="width: 10%"></Column>
        <Column field="name" header="Name" style="width: 10%"></Column>
        <Column field="indexType" header="Index Type" style="width: 10%"></Column>
        <Column field="config" header="Configuration" style="width: 70%"></Column>
    </DataTable>
    <section v-if="data_selected">
        <IndCreate :create="false" class="mt-4" :data="data_selected" @deselect="data_selected = null" />
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IndApi } from '@/apis/api';
import { useIndStore } from '@/stores/ind';
import IndCreate from '@/components/index/IndCreate.vue';

const IndStore = useIndStore();

let data_selected = ref();

onMounted(async () => {
    let data = await IndApi.listIndicesApiV1IndexGet();
    console.log(data);
    IndStore.ind = Object.values(data);
})

function madeClick(value: any) {
    data_selected.value = value.data;
}

</script>
