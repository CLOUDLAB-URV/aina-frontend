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
      <select v-model="llm_model.vendor" @click.prevent="getInfo(llm_model.vendor)"
        class="border p-2 rounded-xl border-[var(--surface-border)]">
        <option disabled value="">Please select one</option>
        <option v-for="vendor in vendors" :value="vendor">{{ vendor }}</option>
      </select>
    </div>

    <ButtonsCrud :create="create" @createElement="sendCreate" @updateElement="update" @deleteElement="delete_element" />
  </form>
  <section class="mt-8">
    <h3 class="text-xl mb-4 text-[var(--text-color)]">Spec Params definitions</h3>
    <DataTable :value="vendor_info" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem">
      <Column field="name" header="Name" style="width: 10%"></Column>
      <Column field="help" header="Help" style="width: 65%"></Column>
      <Column field="type" header="Type" style="width: 10%"></Column>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useLlmStore } from "@/stores/llm";
import type { AddLlmApiV1LlmsLlmPostRequest, DeleteLlmApiV1LlmsLlmLlmNameDeleteRequest, GetVendorDescApiV1LlmsVendorVendorNameGetRequest, UpdateLlmApiV1LlmsLlmLlmNamePatchRequest } from "@/apis/LlmsApi.ts";
import type { LlmCreate } from "@/models/index.ts";
import { transformParams } from "@/apis/DescSpec.ts";
import { LlmApi } from "@/apis/api.ts";
import type { LlmInfo } from "@/models";
import ButtonsCrud from "@/components/ButtonsCrud.vue";

let llmStore = useLlmStore();
let vendor_info = ref();

const props = defineProps<{
  create: boolean;
  data?: LlmInfo;
}>();


const emits = defineEmits(['deselect']);

let vendors = ref<any[]>([]);
let llm_model = ref({
  name: "",
  default: false,
  spec: "",
  vendor: "",
})

onMounted(async () => {
  vendors.value = await LlmApi.listVendorsApiV1LlmsVendorsGet();
  change_model();
});

watch(() => props.data, () => {
  change_model();
});


function change_model() {
  llm_model.value.name = props.data?.name ?? "";
  llm_model.value.default = props.data?._default ?? false;
  llm_model.value.spec = JSON.stringify(props.data?.spec) ?? "";
  llm_model.value.vendor = props.data?.vendorName ?? "";
  return llm_model;
}

function sendCreate() {
  let create: LlmCreate = {
    name: llm_model.value.name,
    _default: llm_model.value.default,
    vendorName: llm_model.value.vendor,
    spec: JSON.parse(llm_model.value.spec),
  };
  let createParam: AddLlmApiV1LlmsLlmPostRequest = {
    llmCreate: create,
  };
  LlmApi.addLlmApiV1LlmsLlmPost(createParam).then(() => {
    console.log("created " + llm_model.value.name);
    llmStore.addLlm(llm_model.value);
  });
}

function delete_element() {
  console.log("delete");
  let llmStore = useLlmStore();
  let name_llm: DeleteLlmApiV1LlmsLlmLlmNameDeleteRequest = {
    llmName: llm_model.value.name,
  };
  LlmApi.deleteLlmApiV1LlmsLlmLlmNameDelete(name_llm).then(() => {
    console.log("deleted " + llm_model.value.name);
    llmStore.removeLlm(llm_model.value);
    emits('deselect');
  });
  console.log("deleted " + llm_model.value.name);
}

function update() {
  console.log("update");
  let llmStore = useLlmStore();
  let name_llm: UpdateLlmApiV1LlmsLlmLlmNamePatchRequest = {
    llmName: llm_model.value.name,
    _default: llm_model.value.default,
    body: JSON.parse(llm_model.value.spec),
  };
  LlmApi.updateLlmApiV1LlmsLlmLlmNamePatch(name_llm).then(() => {
    console.log("updated " + llm_model.value.name);
    llmStore.updateLlm(llm_model.value);
  });
}

async function getInfo(value: string) {
  let name: GetVendorDescApiV1LlmsVendorVendorNameGetRequest = {
    vendorName: value
  }
  vendor_info.value = transformParams(Object.values(await LlmApi.getVendorDescApiV1LlmsVendorVendorNameGet(name))[1]);
}

</script>
