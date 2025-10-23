<template>
    <DataTable :value="store?.data" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem" @row-click="madeClick">
        <Column field="name" header="Name" style="width: 10%"></Column>
        <Column field="spec" header="Specifications" style="width: 65%"></Column>
        <Column field="_default" header="Default" style="width: 10%"></Column>
        <Column field="vendorName" header="Vendor Name" style="width: 15%"></Column>
    </DataTable>
    <section v-if="data_selected">
        <LlmCreate :create="false" class="mt-4" :data="data_selected" @deselect="data_selected = null"
            :type="props.type" />
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LlmCreate from '@/components/llm/LlmCreate.vue';
import { mount } from '@/apis/combinedCrud';

const props = defineProps(
    {
        type: { type: String, required: true },
        store: {
            type: Object,
        }
    }
)

onMounted(async () => {
    console.log(props.type);
    await mount(props.type);
})

let data_selected = ref();


function madeClick(value: any) {
    data_selected.value = value.data;
}

</script>
