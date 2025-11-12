<template>
    <DataTable :value="store?.data" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" stripedRows
        tableStyle="min-width: 50rem" @row-click="madeClick">
        <Column field="name" :header="t('input.name.label')" style="width: 10%"></Column>
        <Column field="spec" :header="t('input.spec.label')" style="width: 65%"></Column>
        <Column field="_default" :header="t('input._default')" style="width: 10%"></Column>
        <Column field="vendorName" :header="t('input.vendor.label')" style="width: 15%"></Column>
    </DataTable>
    <section v-if="data_selected">
        <LlmCreate :create="false" class="mt-4" :data="data_selected" @deselect="data_selected = null" :type="props.type" />
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LlmCreate from '@/components/llm/LlmCreate.vue';
import { mount } from '@/apis/combinedCrud';
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
const props = defineProps(
    {
        type: { type: String, required: true },
        store: {
            type: Object,
        }
    }
)

onMounted(async () => {
    await mount(props.type);
})

let data_selected = ref();


function madeClick(value: any) {
    data_selected.value = value.data;
}

</script>
