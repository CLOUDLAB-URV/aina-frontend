<template>
    <DataTable v-model:selection="selected" :value="IndStore.ind" selectionMode="single" paginator :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]" stripedRows tableStyle="min-width: 50rem">
        <Column field="name" :header="t('input.name.label')" style="width: 10%"></Column>
        <Column field="indexType" :header="t('input.index.label')" style="width: 10%"></Column>
        <Column field="config" :header="t('input.spec.label')" style="width: 70%"></Column>
    </DataTable>
    <section v-if="selected">
        <IndCreate :create="false" class="mt-4" :data="selected" @deselect="selected = undefined" />
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
const { t } = useI18n()

export type TableIndex = {
    id: string;
    name: string;
    indexType: string;
    config: string;
}

let selected = ref<TableIndex>();

let indices = ref<TableIndex[]>([]);

onMounted(async () => {
    indices.value = parse_data(await IndApi.listIndicesApiV1IndexGet());
    IndStore.ind = indices.value;
    console.log(indices.value);
})

function parse_data(data: IndexInfo[]) {
    return data.map((item) => {
        return {
            ...item,
            config: yaml.dump(item.config),
        }
    });
}
</script>
