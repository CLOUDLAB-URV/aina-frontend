<template>
    <DataTable :value="rankStore.ranks" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
        @row-click="madeClick">
        <Column field="name" header="Name" style="width: 10%"></Column>
        <Column field="spec" header="Specifications" style="width: 65%"></Column>
        <Column field="_default" header="Default" style="width: 10%"></Column>
        <Column field="vendorName" header="Vendor Name" style="width: 15%"></Column>
    </DataTable>
    <section v-if="data_selected">
        <RankCreate :create="false" class="mt-4" :data="data_selected" @deselect="data_selected = null" />
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RankApi } from '@/apis/api';
import { useRankStore } from '@/stores/rank';
import RankCreate from '@/components/rank/RankCreate.vue';

const rankStore = useRankStore();
    
let data_selected = ref();

onMounted(async () => {
    let data = await RankApi.listRerankingsApiV1RerankingsGet();
    console.log(data);
    rankStore.ranks = Object.values(data);
})

function madeClick(value: any) {
    data_selected.value = value.data;
}

</script>
