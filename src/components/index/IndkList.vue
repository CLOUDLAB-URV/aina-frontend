<template>
    <DataTable :value="IndStore.ind" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" stripedRows
        tableStyle="min-width: 50rem" @row-click="madeClick">
        <Column field="id" header="Id" style="width: 10%"></Column>
        <Column field="name" :header="t('input.name.label')" style="width: 10%"></Column>
        <Column field="indexType" :header="t('input.index.label')" style="width: 10%"></Column>
        <Column field="config" :header="t('input.spec.label')" style="width: 70%"></Column>
    </DataTable>
    <section v-if="data_selected">
        <IndCreate :create="false" class="mt-4" :data="data_selected" @deselect="data_selected = null" />
    </section>
</template>

<script setup lang="ts">
import IndCreate from '@/components/index/IndCreate.vue';
import { useIndStore } from '@/stores/ind';
import type { IndexInfo } from '@/models';
import { onMounted, ref } from 'vue';
import { IndApi } from '@/apis/api';
import { useI18n } from 'vue-i18n';
import yaml from 'js-yaml';

const IndStore = useIndStore();
const {t} = useI18n()

let data_selected = ref();

onMounted(async () => {
    let data = parse_data(await IndApi.listIndicesApiV1IndexGet());
    console.log(data);
    IndStore.ind = Object.values(data);
})

function parse_data(data: IndexInfo[]) {
    return Object.values(data).map((ind: IndexInfo) => {
        let aux = {
            name: ind.name,
            id: ind.id,
            indexType: ind.indexType,
            config: "",
        };
        aux.config = yaml.dump(ind.config);
        return aux;
    });
}

function madeClick(value: any) {
    data_selected.value = value.data;
}

</script>
