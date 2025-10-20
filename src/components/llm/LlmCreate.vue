<template>
    <form class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label for="name">Name</label>
            <InputText id="name" placeholder="Name" v-model="llm_model.name" />
        </div>

        <div class="flex gap-2">
            <label for="default">Default</label>
            <Checkbox id="default" binary v-model="llm_model.default" />
        </div>

        <div class="flex flex-col gap-2">
            <label for="spec">Specifications</label>
            <textarea v-model="llm_model.spec" id="spec" placeholder="Specifications" class="border p-2" />
        </div>

        <div class="flex flex-col gap-2">
            <label for="vendorName">VendorName</label>
            <select v-model="llm_model.vendor" class="border p-2 rounded-xl border-[var(--surface-border)]">
                <option disabled value="">Please select one</option>
                <option v-for="vendor in vendors" :value="vendor">{{ vendor }}</option>
            </select>
        </div>

        <Button v-if="create" label="Submit" icon="pi pi-send" @click.prevent="sendCreate(llm_model)"></Button>
        <div v-if="!create" class="flex gap-2 w-full">
            <Button label="Save" class="grow" icon="pi pi-save" @click.prevent=""></Button>
            <Button label="Delete" severity="danger" class="grow" icon="pi pi-trash"
                @click.prevent="deleteLLm(llm_model)"></Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { LlmApi } from "@/apis/api.ts";
import type { LlmInfo } from "@/models";
import { deleteLLm, sendCreate, change_model } from "@/apis/crudLlmEmb";

const props = defineProps<{
    create: boolean;
    data?: LlmInfo;
}>();

let vendors = ref<any[]>([]);
let llm_model = ref({
    name: "",
    default: false,
    spec: "",
    vendor: "",
})

onMounted(async () => {
    vendors.value = await LlmApi.listVendorsApiV1LlmsVendorsGet();
    llm_model.value = change_model(props.data)
});

watch(() => props.data, () => {
    llm_model.value = change_model(props.data);
});

// function updateLlm() {
//     let name_llm: UpdateLlmApiV1LlmsLlmLlmNamePatchRequest = {
//         llmName: llm_model.value.name,
//         _default: llm_model.value.default
//     }
//     LlmApi.updateLlmApiV1LlmsLlmLlmNamePatch()
// }

</script>
